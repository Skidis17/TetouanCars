from flask import Blueprint, jsonify, request, session
from flask_pymongo import PyMongo
from Backend import mongo 
import bcrypt
from functools import wraps
from bson import ObjectId
admin_bp = Blueprint('admin', __name__) 


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/admin/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON required"}), 400

    email = data.get('email', '').lower().strip()
    password = data.get('password', '').encode('utf-8') 

    admin = mongo.db.admins.find_one({'email': email})
    
    if admin and bcrypt.checkpw(password, admin['mdp'].encode('utf-8')):
        session['admin_id'] = str(admin['_id'])
        return jsonify({
            "success": True,
            "admin": {
                "id": str(admin['_id']),
                "email": admin['email'],
                "nom": admin['nom']
            }
        })
    return jsonify({"success": False, "error": "Invalid credentials"}), 401


@admin_bp.route('/admin/dashboard')
@login_required
def dashboard():
    admin = mongo.db.admins.find_one({'_id': ObjectId(session['admin_id'])})
    return jsonify({
        "admin": {
            "email": admin['email'],
            "nom": admin['nom']
        }
    })
