# =============================
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .db import get_session
from .core.config import settings
from .models import Profile
import httpx
from uuid import UUID

bearer = HTTPBearer(auto_error=False)

async def verify_supabase_jwt(token: str) -> dict:
    """Call Supabase /auth/v1/user to validate the token and fetch the user."""
    url = f"{settings.supabase_url}/auth/v1/user"
    headers = {"Authorization": f"Bearer {token}", "apikey": settings.supabase_anon_key}
    async with httpx.AsyncClient(timeout=8.0) as client:
        r = await client.get(url, headers=headers)
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return r.json()  # contains 'id', 'email', 'user_metadata', etc.

async def ensure_profile(session: AsyncSession, auth_user: dict) -> Profile:
    user_id = UUID(auth_user["id"])  # Supabase auth.users.id
    result = await session.execute(select(Profile).where(Profile.id == user_id)) # can return tuple(Profile, something), we just want the profile. The first column. 
    profile = result.scalar_one_or_none()
    if profile:
        return profile
    # Create a profile row linked to auth.users.id
    email = auth_user.get("email") or "user"
    username = (email.split("@")[0] if email else str(user_id))[:50]
    profile = Profile(id=user_id, username=username, avatar_url=None)
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile

async def get_current_profile(
    creds: HTTPAuthorizationCredentials = Security(bearer),
    session: AsyncSession = Depends(get_session),
) -> Profile:
    if creds is None:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    auth_user = await verify_supabase_jwt(creds.credentials)
    profile = await ensure_profile(session, auth_user)
    return profile



# frontend and backend both have access to same supabase project url 