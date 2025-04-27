from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
import jwt
import datetime
from functools import wraps
from db import mongo
from config import Config

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# Clé secrète depuis la config
SECRET_KEY = Config.SECRET_KEY

@admin_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email et mot de passe requis"}), 400

    # Recherche de l'admin dans MongoDB
    admin = mongo.db.admins.find_one({"email": email})
    
    if admin and check_password_hash(admin['mdp'], password):
        # Création du token JWT
        token = jwt.encode({
            'admin_id': str(admin['_id']),
            'email': admin['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "success": True,
            "token": token,
            "admin": {
                "id": str(admin['_id']),
                "email": admin['email'],
                "nom": admin['nom']
            }
        })
    
    return jsonify({"success": False, "message": "Identifiants incorrects"}), 401

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({"message": "Token manquant"}), 401
            
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_admin = mongo.db.admins.find_one({"_id": ObjectId(data['admin_id'])})
            if not current_admin:
                return jsonify({"message": "Admin non trouvé"}), 401
        except Exception as e:
            return jsonify({"message": "Token invalide", "error": str(e)}), 401
            
        return f(current_admin, *args, **kwargs)
    
    return decorated

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def dashboard(current_admin):
    # Statistiques à récupérer depuis MongoDB
    stats = {
        "clients": mongo.db.clients.count_documents({}),
        "voitures": mongo.db.voitures.count_documents({}),
        "reservations": mongo.db.reservations.count_documents({}),
        "revenus": 12500  # À remplacer par un calcul réel
    }
    
    return jsonify({
        "success": True,
        "admin": {
            "id": str(current_admin['_id']),
            "email": current_admin['email'],
            "nom": current_admin['nom']
        },
        "stats": stats
    })