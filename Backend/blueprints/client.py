from flask import Blueprint, jsonify
from Backend.db import mongo

client_bp = Blueprint('client', __name__)

@client_bp.route('/clients', methods=['GET'])
def get_clients():
    clients = list(mongo.db.clients.find())
    for client in clients:
        client['_id'] = str(client['_id'])  
    return jsonify(clients)
