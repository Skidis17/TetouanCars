from flask import Blueprint, jsonify
import json
from bson import ObjectId
from models.voiture_model import Voiture
from db import mongo

voiture_bp = Blueprint('voiture', __name__)

@voiture_bp.route('/', methods=['GET'])
def get_all_cars():
    try:
        voitures = mongo.db.voitures.find()
        result = []
        for voiture in voitures:
            voiture['_id'] = str(voiture['_id'])  # Convert ObjectId to string
            if 'date_ajout' in voiture:
                voiture['date_ajout'] = voiture['date_ajout'].isoformat()  # Convert date to ISO string
            result.append(voiture)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voiture_bp.route('/cars/<string:car_id>', methods=['GET'])
def get_car(car_id):
    try:
        # Validate ObjectId format first
        if not ObjectId.is_valid(car_id):
            return jsonify({'error': 'Invalid car ID format'}), 400

        car = mongo.db.voitures.find_one({'_id': ObjectId(car_id)})
        
        if not car:
            return jsonify({'error': 'Car not found'}), 404

        # Convert ObjectId and handle dates
        car['_id'] = str(car['_id'])
        if 'date_ajout' in car:
            car['date_ajout'] = car['date_ajout'].isoformat() if car['date_ajout'] else None
            
        return jsonify(car), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
