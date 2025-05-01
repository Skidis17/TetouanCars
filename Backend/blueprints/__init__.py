from .admin import admin_bp
from .client import client_bp
from .auth import auth_bp
from .voiture import voiture_bp
from .manager import manager_bp
from .reservation import reservation_bp

__all__ = ['admin_bp', 'client_bp', 'auth_bp', 'voiture_bp', 'manager_bp', 'reservation_bp']