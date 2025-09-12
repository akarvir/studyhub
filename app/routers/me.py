from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..db import get_session
from ..auth import get_current_profile
from ..schemas import ProfileOut

router = APIRouter(prefix="", tags=["me"])  # root-scoped

@router.get("/me", response_model=ProfileOut)
async def read_me(session: AsyncSession = Depends(get_session), profile=Depends(get_current_profile)):
    return profile