from fastapi import APIRouter
import stripe
from src.core.config import get_settings

settings = get_settings()
stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

@router.post("/create-checkout-session")
async def create_checkout_session():
    """Create Stripe checkout session for subscription"""
    
    session = stripe.checkout.Session.create(
        mode="subscription",
        payment_method_types=["card"],
        line_items=[
            {
                "price": settings.STRIPE_PRICE_ID,  # $15/month
                "quantity": 1,
            }
        ],
        success_url=f"{settings.FRONTEND_URL}/success",
        cancel_url=f"{settings.FRONTEND_URL}/pricing",
    )
    
    return {"checkout_url": session.url}
