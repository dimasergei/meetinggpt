from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional
import structlog

from src.services.auth import GitHubAuthService
from src.core.config import get_settings

logger = structlog.get_logger()
settings = get_settings()
router = APIRouter()

class AuthResponse(BaseModel):
    user: dict
    token: str
    expires_in: int

class AuthURLRequest(BaseModel):
    redirect_uri: str

@router.post("/auth/github/url")
async def get_github_auth_url(request: AuthURLRequest):
    """Get GitHub OAuth URL"""
    try:
        auth_service = GitHubAuthService()
        auth_url = auth_service.get_auth_url(request.redirect_uri)
        
        return {"auth_url": auth_url}
        
    except Exception as e:
        logger.error("github_auth_url_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to generate auth URL")

@router.post("/auth/github/callback")
async def github_callback(code: str):
    """Handle GitHub OAuth callback"""
    try:
        auth_service = GitHubAuthService()
        auth_result = await auth_service.authenticate_user(code)
        
        if not auth_result:
            raise HTTPException(status_code=400, detail="Authentication failed")
        
        return AuthResponse(**auth_result)
        
    except Exception as e:
        logger.error("github_callback_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Authentication failed")

@router.get("/auth/github/callback")
async def github_callback_get(code: str, state: Optional[str] = None):
    """Handle GitHub OAuth callback (GET for redirect flow)"""
    try:
        auth_service = GitHubAuthService()
        auth_result = await auth_service.authenticate_user(code)
        
        if not auth_result:
            raise HTTPException(status_code=400, detail="Authentication failed")
        
        # Redirect to frontend with token
        redirect_url = f"{settings.FRONTEND_URL}/auth/callback?token={auth_result['token']}"
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        logger.error("github_callback_get_failed", error=str(e))
        redirect_url = f"{settings.FRONTEND_URL}/auth/error"
        return RedirectResponse(url=redirect_url)

@router.post("/auth/verify")
async def verify_token(request: Request):
    """Verify JWT token and return user info"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="No token provided")
        
        token = auth_header.split(" ")[1]
        auth_service = GitHubAuthService()
        
        payload = auth_service.verify_jwt_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user subscription info
        subscription = await auth_service.get_user_subscription(payload['user_id'])
        
        return {
            "user_id": payload['user_id'],
            "username": payload['username'],
            "subscription": subscription
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("token_verification_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Token verification failed")

@router.post("/auth/refresh")
async def refresh_token(request: Request):
    """Refresh JWT token"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="No token provided")
        
        token = auth_header.split(" ")[1]
        auth_service = GitHubAuthService()
        
        payload = auth_service.verify_jwt_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Create new token
        new_token = auth_service.create_jwt_token(payload['user_id'], payload['username'])
        
        return {
            "token": new_token,
            "expires_in": 3600
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("token_refresh_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Token refresh failed")

@router.get("/auth/me")
async def get_current_user(request: Request):
    """Get current user info"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="No token provided")
        
        token = auth_header.split(" ")[1]
        auth_service = GitHubAuthService()
        
        payload = auth_service.verify_jwt_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get full user info from Supabase
        user_result = auth_service.supabase.table('users').select('*').eq('id', payload['user_id']).execute()
        
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = user_result.data[0]
        
        return {
            "id": user['id'],
            "username": user['username'],
            "name": user['name'],
            "email": user['email'],
            "avatar_url": user['avatar_url'],
            "subscription_tier": user['subscription_tier'],
            "meetings_processed": user['meetings_processed'],
            "created_at": user['created_at'],
            "last_login": user['last_login']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_user_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to get user info")
