from flask import Blueprint, jsonify
from Backend.db import mongo


client_bp = Blueprint('client', __name__)

@client_bp.route('/clients', methods=['GET'])
def get_clients():
    clients = list(mongo.db.clients.find())
    for client in clients:
        client['_id'] = str(client['_id'])
        # Convertir les dates en ISO format
        client['date_expiration'] = client['date_expiration'].isoformat() if 'date_expiration' in client else None
        client['date_ajout'] = client['date_ajout'].isoformat() if 'date_ajout' in client else None
    return jsonify(clients)