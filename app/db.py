from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from .core.config import settings
from .utils.db_url import to_asyncpg_url


ASYNC_DB_URL = to_asyncpg_url(settings.database_url)
engine = create_async_engine(ASYNC_DB_URL, echo=False, pool_pre_ping=True)
AsyncSessionLocal = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
# automatically closes session when function ends. 