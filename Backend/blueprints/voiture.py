from flask import Blueprint, jsonify, request, send_file
from Backend import mongo
from bson import ObjectId
from datetime import datetime
from werkzeug.utils import secure_filename
import gridfs
import io
import os

voiture_bp = Blueprint('voiture', __name__)
fs = gridfs.GridFS(mongo.db)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
CARBURANT_TYPES = ['Essence', 'Diesel', 'Hybride', 'Electrique', 'GPL']
OPTIONS_LIST = ['GPS', 'Climatisation', 'Bluetooth', 'Caméra de recul', 
               'Sièges chauffants', 'Toit ouvrant', 'Régulateur de vitesse', 
               'Aide au stationnement']

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

@voiture_bp.route('/voiture', methods=['GET'])
def get_voitures():
    voitures = []
    for voiture in mongo.db.voitures.find():
        voiture['_id'] = str(voiture['_id'])
        if 'image_id' in voiture:
            voiture['image_id'] = str(voiture['image_id'])
        voitures.append(voiture)
    return jsonify(voitures)

@voiture_bp.route('/voiture', methods=['POST'])
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

@voiture_bp.route('/image/<image_id>')
def get_image(image_id):
    try:
        if not image_id or image_id == 'undefined':
            return jsonify({"error": "Invalid image ID"}), 400
            
        image_data = fs.get(ObjectId(image_id))
        return send_file(
            io.BytesIO(image_data.read()),
            mimetype=image_data.content_type,
            as_attachment=False
        )
    except Exception as e:
        print(f"Error retrieving image: {str(e)}")
        return jsonify({"error": "Image not found"}), 404

@voiture_bp.route('/voiture/<id>', methods=['PUT'])
def update_voiture(id):
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
        "options": data.get('options', [])
    }

    if file and allowed_file(file.filename):
        # Supprimer l'ancienne image
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
    
    if result.modified_count == 0:
        return jsonify({"error": "Aucune modification effectuée"}), 400
    
    return jsonify({"message": "Voiture mise à jour", "image_id": str(update_data.get('image_id', ''))})

@voiture_bp.route('/voiture/<id>', methods=['DELETE'])
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