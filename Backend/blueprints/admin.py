from flask import Blueprint, jsonify, request, session
from flask_pymongo import PyMongo
from db import mongo 
import bcrypt
from functools import wraps
from bson import ObjectId
from datetime import datetime

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
def dashboard():
    # Directly fetch the first admin (since you only have one anyway)
    admin = mongo.db.admins.find_one()
    
    if not admin:
        return jsonify({"error": "Admin not found"}), 404

    # Calculate statistics
    now = datetime.now()
    start_of_month = datetime(now.year, now.month, 1)

    reservations_count = mongo.db.reservations.count_documents({
        'date_reservation': {'$gte': start_of_month}
    })

    clients_count = mongo.db.clients.count_documents({})
    voitures_dispo_count = mongo.db.voitures.count_documents({'status': 'disponible'})

    total_revenue = sum(
        reservation.get('prix_total', 0)
        for reservation in mongo.db.reservations.find({})
    )

    return jsonify({
        "admin": {
            "email": admin['email'],
            "nom": admin['nom']
        },
        "stats": [
            { "title": "Réservations ce mois", "value": reservations_count, "change": 12 },
            { "title": "Clients actifs", "value": clients_count, "change": -3 },
            { "title": "Voitures disponibles", "value": voitures_dispo_count, "change": 5 },
            { "title": "Revenus (MAD)", "value": f"{total_revenue:,.0f}", "change": 18 }
        ]
    })


@admin_bp.route('/admin/managers', methods=['GET'])
def get_managers():
    managers = list(mongo.db.managers.find())
    for manager in managers:
        manager['_id'] = str(manager['_id'])
    return jsonify(managers)
@admin_bp.route('/admin/managers', methods=['POST'])
def add_manager():
    data = request.get_json()

    if 'mot_de_passe' in data:
        hashed_password = bcrypt.hashpw(data['mot_de_passe'].encode('utf-8'), bcrypt.gensalt())
        data['mot_de_passe'] = hashed_password.decode('utf-8') 

    mongo.db.managers.insert_one(data)
    
    return jsonify({'message': 'Manager ajouté avec succès'}), 201

@admin_bp.route('/admin/managers/<id>', methods=['PUT'])
def update_manager(id):
    try:
        data = request.get_json()
        
        # Ne pas permettre la modification de l'email et de la date de création
        if 'email' in data:
            del data['email']
        if 'date_creation' in data:
            del data['date_creation']
        
        # Hashage du mot de passe si fourni
        if 'mot_de_passe' in data and data['mot_de_passe']:
            hashed_password = bcrypt.hashpw(data['mot_de_passe'].encode('utf-8'), bcrypt.gensalt())
            data['mot_de_passe'] = hashed_password.decode('utf-8')
        elif 'mot_de_passe' in data and not data['mot_de_passe']:
            del data['mot_de_passe']
        
        manager_id = ObjectId(id)
        result = mongo.db.managers.update_one(
            {'_id': manager_id},
            {"$set": data}
        )
        
        if result.matched_count == 0:
            return jsonify({'success': False, 'message': 'Manager non trouvé'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Manager mis à jour avec succès',
            'data': data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erreur lors de la mise à jour: {str(e)}'
        }), 500

@admin_bp.route('/admin/managers/<id>', methods=['DELETE'])
def delete_manager(id):

    manager_id = ObjectId(id)

    result = mongo.db.managers.delete_one({'_id': manager_id})

    if result.deleted_count == 0:
        return jsonify({'message': 'Aucun manager trouvé avec cet ID'}), 404

    return jsonify({'message': 'Manager supprimé avec succès'})

@admin_bp.route('/admin/reservations', methods=['GET'])
def get_reservations():
    reservations = list(mongo.db.reservations.find())
    for res in reservations:
        res['_id'] = str(res['_id'])
        res['client_id'] = str(res['client_id'])
        res['voiture_id'] = str(res['voiture_id'])
        res['manager_createur_id'] = str(res['manager_createur_id'])
        res['manager_traiteur_id'] = str(res['manager_traiteur_id'])
        res['date_debut'] = res['date_debut'].isoformat() 
        res['date_fin'] = res['date_fin'].isoformat() 
        res['date_reservation'] = res['date_reservation'].isoformat() 
    return jsonify(reservations)

@admin_bp.route('/admin/clients', methods=['GET'])
def get_clients():
    clients = list(mongo.db.clients.find())
    for client in clients:
        client['_id'] = str(client['_id'])
   
        client['date_expiration'] = client['date_expiration'].isoformat() if 'date_expiration' in client else None
        client['date_ajout'] = client['date_ajout'].isoformat() if 'date_ajout' in client else None
    return jsonify(clients)
