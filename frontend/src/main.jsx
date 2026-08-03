from app.routes.auth import router as auth_router
from app.routes.items import router as items_router
from app.routes.matches import router as matches_router
from app.routes.admin import router as admin_router
from app.routes.demo import router as demo_router

__all__ = ["auth_router", "items_router", "matches_router", "admin_router", "demo_router"]
