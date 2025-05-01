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
@manager_bp.route('/api/managers', methods=['POST'])
def add_manager():
    data = request.get_json()

    if 'password' in data:
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        data['password'] = hashed_password.decode('utf-8') 

    mongo.db.managers.insert_one(data)
    
    return jsonify({'message': 'Manager ajouté avec succès'}), 201

@manager_bp.route('/api/managers/<id>', methods=['PUT'])
def update_manager(id):
    data = request.get_json()


    manager_id = ObjectId(id)
  
    result = mongo.db.managers.update_one({'_id': manager_id}, {"$set": data})

    if result.matched_count == 0:
        return jsonify({'message': 'Aucun manager trouvé avec cet ID'}), 404
    
    return jsonify({'message': 'Manager mis à jour avec succès'})

@manager_bp.route('/api/managers/<id>', methods=['DELETE'])
def delete_manager(id):

    manager_id = ObjectId(id)

    result = mongo.db.managers.delete_one({'_id': manager_id})

    if result.deleted_count == 0:
        return jsonify({'message': 'Aucun manager trouvé avec cet ID'}), 404

    return jsonify({'message': 'Manager supprimé avec succès'})
