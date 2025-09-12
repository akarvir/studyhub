

def to_asyncpg_url(sync_url: str) -> str:
    """Convert 'postgresql://...' to 'postgresql+asyncpg://...'."""
    if sync_url.startswith("postgresql+asyncpg://"):
        return sync_url
    if sync_url.startswith("postgresql://"):
        return sync_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    # Allow postgres:// as well
    if sync_url.startswith("postgres://"):
        return sync_url.replace("postgres://", "postgresql+asyncpg://", 1)
    return sync_url
