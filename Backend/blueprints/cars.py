from flask import Blueprint, jsonify
import json
from bson import ObjectId
from Backend.models.voiture_model import Voiture
from Backend.db import mongo

voiture_bp = Blueprint('voiture', __name__)

@voiture_bp.route('/', methods=['GET'])
def get_all_cars():
    try:
        voiture = mongo.db.voitures.find()
        result = []
        for voiture in voiture:
            voiture['_id'] = str(voiture['_id'])  # Convert ObjectId to string
            result.append(voiture)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voiture_bp.route('/<string:car_id>', methods=['GET'])
def get_single_car(car_id):
    try:
        car = mongo.db.cars.find_one({'_id': ObjectId(car_id)})
        if car:
            car['_id'] = str(car['_id'])
            return jsonify(car), 200
        return jsonify({'message': 'Car not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500