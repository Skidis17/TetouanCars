from flask import Blueprint, request, jsonify
from Backend.models.manager_model import Manager
from Backend.db import mongo
import bcrypt
from bson import ObjectId

manager_bp = Blueprint('manager', __name__)

@manager_bp.route('/managers', methods=['GET'])
def get_managers():
    managers = list(mongo.db.managers.find())
    for manager in managers:
        manager['_id'] = str(manager['_id'])
    return jsonify(managers)
@manager_bp.route('/managers', methods=['POST'])
def add_manager():
    data = request.get_json()

    if 'mot_de_passe' in data:
        hashed_password = bcrypt.hashpw(data['mot_de_passe'].encode('utf-8'), bcrypt.gensalt())
        data['mot_de_passe'] = hashed_password.decode('utf-8') 

    mongo.db.managers.insert_one(data)
    
    return jsonify({'message': 'Manager ajouté avec succès'}), 201

@manager_bp.route('/managers/<id>', methods=['PUT'])
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

@manager_bp.route('/managers/<id>', methods=['DELETE'])
def delete_manager(id):

    manager_id = ObjectId(id)

    result = mongo.db.managers.delete_one({'_id': manager_id})

    if result.deleted_count == 0:
        return jsonify({'message': 'Aucun manager trouvé avec cet ID'}), 404

    return jsonify({'message': 'Manager supprimé avec succès'})
