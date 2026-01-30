from typing import Optional, Dict, Any
import httpx
import jwt
from datetime import datetime, timedelta
import secrets
import structlog
from supabase import create_client, Client

from src.core.config import get_settings

logger = structlog.get_logger()
settings = get_settings()

class GitHubAuthService:
    """
    GitHub OAuth authentication service
    
    - Handles GitHub OAuth flow
    - Creates JWT tokens for authenticated users
    - Manages user sessions
    - Integrates with Supabase for user data
    """
    
    def __init__(self):
        self.client_id = settings.GITHUB_CLIENT_ID
        self.client_secret = settings.GITHUB_CLIENT_SECRET
        self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
        self.jwt_secret = settings.JWT_SECRET
        
    def get_auth_url(self, redirect_uri: str) -> str:
        """Generate GitHub OAuth URL"""
        params = {
            'client_id': self.client_id,
            'redirect_uri': redirect_uri,
            'scope': 'user:email',
            'state': secrets.token_urlsafe(32)
        }
        
        auth_url = f"https://github.com/login/oauth/authorize?{'&'.join(f'{k}={v}' for k, v in params.items())}"
        
        return auth_url
    
    async def exchange_code_for_token(self, code: str) -> Optional[Dict[str, Any]]:
        """Exchange OAuth code for access token"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    'https://github.com/login/oauth/access_token',
                    data={
                        'client_id': self.client_id,
                        'client_secret': self.client_secret,
                        'code': code
                    },
                    headers={'Accept': 'application/json'}
                )
            
            if response.status_code != 200:
                logger.error("github_token_exchange_failed", status=response.status_code)
                return None
            
            return response.json()
            
        except Exception as e:
            logger.error("github_token_exchange_error", error=str(e))
            return None
    
    async def get_user_info(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Get user information from GitHub"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://api.github.com/user',
                    headers={
                        'Authorization': f'token {access_token}',
                        'User-Agent': 'MeetingGPT'
                    }
                )
            
            if response.status_code != 200:
                logger.error("github_user_info_failed", status=response.status_code)
                return None
            
            return response.json()
            
        except Exception as e:
            logger.error("github_user_info_error", error=str(e))
            return None
    
    async def get_user_emails(self, access_token: str) -> Optional[list]:
        """Get user emails from GitHub"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://api.github.com/user/emails',
                    headers={
                        'Authorization': f'token {access_token}',
                        'User-Agent': 'MeetingGPT'
                    }
                )
            
            if response.status_code != 200:
                logger.error("github_emails_failed", status=response.status_code)
                return None
            
            emails = response.json()
            return [email['email'] for email in emails if email['verified']]
            
        except Exception as e:
            logger.error("github_emails_error", error=str(e))
            return None
    
    async def authenticate_user(self, code: str) -> Optional[Dict[str, Any]]:
        """Complete GitHub authentication flow"""
        
        # 1. Exchange code for token
        token_data = await self.exchange_code_for_token(code)
        if not token_data:
            return None
        
        access_token = token_data.get('access_token')
        if not access_token:
            return None
        
        # 2. Get user info
        user_info = await self.get_user_info(access_token)
        if not user_info:
            return None
        
        # 3. Get user emails
        emails = await self.get_user_emails(access_token)
        if not emails:
            return None
        
        primary_email = emails[0]
        
        # 4. Create or update user in Supabase
        user_data = {
            'github_id': user_info['id'],
            'username': user_info['login'],
            'name': user_info.get('name', ''),
            'email': primary_email,
            'avatar_url': user_info.get('avatar_url', ''),
            'github_access_token': access_token,
            'last_login': datetime.utcnow().isoformat()
        }
        
        try:
            # Check if user exists
            existing_user = self.supabase.table('users').select('*').eq('github_id', user_info['id']).execute()
            
            if existing_user.data:
                # Update existing user
                self.supabase.table('users').update(user_data).eq('github_id', user_info['id']).execute()
                user_id = existing_user.data[0]['id']
            else:
                # Create new user
                user_data['created_at'] = datetime.utcnow().isoformat()
                user_data['subscription_tier'] = 'free'
                user_data['meetings_processed'] = 0
                result = self.supabase.table('users').insert(user_data).execute()
                user_id = result.data[0]['id']
            
            # 5. Create JWT token
            jwt_token = self.create_jwt_token(user_id, user_info['login'])
            
            return {
                'user': {
                    'id': user_id,
                    'username': user_info['login'],
                    'name': user_info.get('name', ''),
                    'email': primary_email,
                    'avatar_url': user_info.get('avatar_url', ''),
                    'subscription_tier': user_data.get('subscription_tier', 'free')
                },
                'token': jwt_token,
                'expires_in': 3600  # 1 hour
            }
            
        except Exception as e:
            logger.error("user_authentication_failed", error=str(e))
            return None
    
    def create_jwt_token(self, user_id: str, username: str) -> str:
        """Create JWT token for user"""
        payload = {
            'user_id': user_id,
            'username': username,
            'exp': datetime.utcnow() + timedelta(hours=1),
            'iat': datetime.utcnow()
        }
        
        return jwt.encode(payload, self.jwt_secret, algorithm='HS256')
    
    def verify_jwt_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    async def get_user_subscription(self, user_id: str) -> Dict[str, Any]:
        """Get user subscription info"""
        try:
            result = self.supabase.table('users').select('subscription_tier, meetings_processed').eq('id', user_id).execute()
            
            if result.data:
                user = result.data[0]
                return {
                    'tier': user['subscription_tier'],
                    'meetings_processed': user['meetings_processed'],
                    'remaining_meetings': self.get_remaining_meetings(user['subscription_tier'], user['meetings_processed'])
                }
            
            return {'tier': 'free', 'meetings_processed': 0, 'remaining_meetings': 5}
            
        except Exception as e:
            logger.error("subscription_check_failed", error=str(e))
            return {'tier': 'free', 'meetings_processed': 0, 'remaining_meetings': 5}
    
    def get_remaining_meetings(self, tier: str, processed: int) -> int:
        """Calculate remaining meetings based on subscription tier"""
        if tier == 'free':
            return max(0, 5 - processed)
        elif tier == 'pro':
            return 999  # Unlimited
        else:
            return 0
