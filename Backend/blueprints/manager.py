from flask import Blueprint, jsonify
import json
from bson import ObjectId
from Backend.models.manager_model import Manager
from Backend.db import mongo

manager_bp = Blueprint('manager', __name__)

@manager_bp.route('/manager', methods=['GET'])
def get_all_managers():
    try:
        managers = mongo.db.managers.find()
        result = []
        for manager in managers:
            manager['_id'] = str(manager['_id'])  # Convert ObjectId to string
            if 'date_creation' in manager:
                manager['date_creation'] = manager['date_creation'].isoformat()  # Convert date to ISO string
            result.append(manager)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @voiture_bp.route('/cars/<string:car_id>', methods=['GET'])
# def get_manager_by_car(car_id):
#     try:
#         car = mongo.db.cars.find_one({'_id': ObjectId(car_id)})
#         if car:
#             car['_id'] = str(car['_id'])
#             return jsonify(car), 200
#         return jsonify({'message': 'Car not found'}), 404
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500