from .admin import admin_bp
from .auth import auth_bp
from .cars import cars_bp
from .manager import manager_bp
from .rentals import rentals_bp

__all__ = ['admin_bp', 'auth_bp', 'cars_bp', 'manager_bp', 'rentals_bp']