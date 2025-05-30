from flask import Blueprint, jsonify, request, session, send_file
from flask_pymongo import PyMongo
from db import mongo 
import bcrypt
from functools import wraps
from bson import ObjectId
from datetime import datetime
from datetime import datetime
from werkzeug.utils import secure_filename
import gridfs
import io
import os


admin_bp = Blueprint('admin', __name__) 
def get_gridfs():
    return gridfs.GridFS(mongo.db)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
CARBURANT_TYPES = ['Essence', 'Diesel', 'Hybride', 'Electrique', 'GPL']
OPTIONS_LIST = ['GPS', 'Climatisation', 'Bluetooth', 'Caméra de recul', 
               'Sièges chauffants', 'Toit ouvrant', 'Régulateur de vitesse', 
               'Aide au stationnement']

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
        float(reservation.get('prix_total', 0))  # Convert to float
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
        res['client_id'] = str(res.get('client_id', ''))
        res['voiture_id'] = str(res.get('voiture_id', ''))
        res['manager_createur_id'] = str(res.get('manager_createur_id', ''))
        res['manager_traiteur_id'] = str(res.get('manager_traiteur_id', ''))
        
        # Convert string dates to ISO format
        res['date_debut'] = (
            datetime.strptime(res['date_debut'], "%Y-%m-%d").isoformat()
            if res.get('date_debut') else None
        )
        res['date_fin'] = (
            datetime.strptime(res['date_fin'], "%Y-%m-%d").isoformat()
            if res.get('date_fin') else None
        )
        res['date_reservation'] = (
            datetime.strptime(res['date_reservation'], "%Y-%m-%d").isoformat()
            if res.get('date_reservation') else None
        )
    return jsonify(reservations)

@admin_bp.route('/admin/clients', methods=['GET'])
def get_clients():
    clients = list(mongo.db.clients.find())
    for client in clients:
        client['_id'] = str(client['_id'])
   
        client['date_expiration'] = client['date_expiration'].isoformat() if 'date_expiration' in client else None
        client['date_ajout'] = client['date_ajout'].isoformat() if 'date_ajout' in client else None
    return jsonify(clients)



def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_voiture_data(data):
    errors = []
    
    # Validation des champs obligatoires
    required_fields = ['marque', 'modele', 'annee', 'immatriculation', 
                      'couleur', 'kilometrage', 'prix_journalier', 
                      'status', 'type_carburant', 'nombre_places']
    
    for field in required_fields:
        if field not in data:
            errors.append(f"Le champ {field} est obligatoire")
    
    # Validation du type de carburant
    if 'type_carburant' in data and data['type_carburant'] not in CARBURANT_TYPES:
        errors.append(f"Type de carburant invalide. Options: {', '.join(CARBURANT_TYPES)}")
    
    # Validation des options
    if 'options' in data:
        if not isinstance(data['options'], list):
            errors.append("Les options doivent être un tableau")
        else:
            for opt in data['options']:
                if opt not in OPTIONS_LIST:
                    errors.append(f"Option invalide: {opt}. Options valides: {', '.join(OPTIONS_LIST)}")
    
    return errors

@admin_bp.route('/admin/voiture', methods=['GET'])
def get_voitures():
    voitures = []
    for voiture in mongo.db.voitures.find():
        voiture['_id'] = str(voiture['_id'])
        if 'image_id' in voiture and voiture['image_id']:
            voiture['image_id'] = str(voiture['image_id'])
        else:
            voiture['image_id'] = None
        voitures.append(voiture)
    return jsonify(voitures)

@admin_bp.route('/admin/voiture', methods=['POST'])
def add_voiture():
    data = request.form.to_dict()
    file = request.files.get('image')

    # Convertir les options en liste
    if 'options' in data:
        data['options'] = [opt.strip() for opt in data['options'].split(',') if opt.strip()]
    
    # Validation
    errors = validate_voiture_data(data)
    if errors:
        return jsonify({"errors": errors}), 400

    fs = get_gridfs()  # Initialisation de GridFS ici
    image_id = None
    if file and allowed_file(file.filename):
        image_id = fs.put(
            file.read(),
            filename=secure_filename(file.filename),
            content_type=file.content_type
        )

    voiture = {
        "marque": data['marque'],
        "modele": data['modele'],
        "annee": int(data['annee']),
        "immatriculation": data['immatriculation'],
        "couleur": data['couleur'],
        "kilometrage": int(data['kilometrage']),
        "prix_journalier": float(data['prix_journalier']),
        "status": data['status'],
        "type_carburant": data['type_carburant'],
        "nombre_places": int(data['nombre_places']),
        "options": data.get('options', []),
        "date_ajout": datetime.utcnow()
    }

    if image_id:
        voiture['image_id'] = image_id

    result = mongo.db.voitures.insert_one(voiture)
    voiture['_id'] = str(result.inserted_id)
    if 'image_id' in voiture:
        voiture['image_id'] = str(voiture['image_id'])
    
    return jsonify(voiture), 201

@admin_bp.route('/admin/image/<image_id>')
def get_image(image_id):
    try:
        if not image_id or image_id == 'undefined':
            return jsonify({"error": "Invalid image ID"}), 400
        
        fs = get_gridfs() 
        image_data = fs.get(ObjectId(image_id))
        return send_file(
            io.BytesIO(image_data.read()),
            mimetype=image_data.content_type,
            as_attachment=False
        )
    except Exception as e:
        print(f"Error retrieving image: {str(e)}")
        return jsonify({"error": "Image not found"}), 404
    
    
@admin_bp.route('/admin/voiture/<id>', methods=['PUT'])
def update_voiture(id):
    try:
        # Initialiser GridFS
        fs = gridfs.GridFS(mongo.db)
        
        data = request.form.to_dict()
        file = request.files.get('image')

        # Convertir les options en liste
        if 'options' in data:
            data['options'] = [opt.strip() for opt in data['options'].split(',') if opt.strip()]
        
        # Validation
        errors = validate_voiture_data(data)
        if errors:
            return jsonify({"errors": errors}), 400

        update_data = {
            "marque": data['marque'],
            "modele": data['modele'],
            "annee": int(data['annee']),
            "couleur": data['couleur'],
            "kilometrage": int(data['kilometrage']),
            "prix_journalier": float(data['prix_journalier']),
            "status": data['status'],
            "type_carburant": data['type_carburant'],
            "nombre_places": int(data['nombre_places']),
            "options": data.get('options', []),
            "date_modification": datetime.utcnow()  # Ajout d'un champ de date de modification
        }

        if file and allowed_file(file.filename):
            # Supprimer l'ancienne image si elle existe
            voiture = mongo.db.voitures.find_one({"_id": ObjectId(id)})
            if voiture and 'image_id' in voiture and voiture['image_id']:
                try:
                    fs.delete(ObjectId(voiture['image_id']))
                except Exception as e:
                    print(f"Error deleting old image: {str(e)}")
            
            # Ajouter la nouvelle image
            image_id = fs.put(
                file.read(),
                filename=secure_filename(file.filename),
                content_type=file.content_type
            )
            update_data['image_id'] = image_id

        result = mongo.db.voitures.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Voiture non trouvée"}), 404
        
        if result.modified_count == 0:
            return jsonify({"message": "Aucune modification nécessaire", "voiture_id": id}), 200
        
        # Récupérer la voiture mise à jour pour la réponse
        updated_voiture = mongo.db.voitures.find_one({"_id": ObjectId(id)})
        updated_voiture['_id'] = str(updated_voiture['_id'])
        if 'image_id' in updated_voiture:
            updated_voiture['image_id'] = str(updated_voiture['image_id'])
        
        return jsonify({
            "message": "Voiture mise à jour avec succès",
            "voiture": updated_voiture
        }), 200

    except Exception as e:
        print(f"Error updating voiture: {str(e)}")
        return jsonify({
            "error": "Erreur lors de la mise à jour de la voiture",
            "details": str(e)
        }), 500
@admin_bp.route('/admin/voiture/<id>', methods=['DELETE'])
def delete_voiture(id):
    voiture = mongo.db.voitures.find_one({"_id": ObjectId(id)})
    if not voiture:
        return jsonify({"error": "Voiture non trouvée"}), 404
    
    if 'image_id' in voiture and voiture['image_id']:
        try:
            fs.delete(ObjectId(voiture['image_id']))
        except Exception as e:
            print(f"Error deleting image: {str(e)}")
    
    result = mongo.db.voitures.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Échec de la suppression"}), 400
    
    return jsonify({"message": "Voiture supprimée"})