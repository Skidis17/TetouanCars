from flask import Blueprint, jsonify
from Backend.db import mongo

reservation_bp = Blueprint('reservation', __name__)

@reservation_bp.route('/reservations', methods=['GET'])
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
