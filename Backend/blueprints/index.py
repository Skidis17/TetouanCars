from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask import Blueprint, jsonify
from flask import Blueprint, jsonify
import json
from bson import ObjectId
from models.manager_model import Manager
from db import mongo

app = Flask(__name__)
CORS(app)

stats_bp = Blueprint('stats', __name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/CarRental"
mongo = PyMongo(app)

@stats_bp.route("/stats", methods=["GET"])
def get_stats():
    total_voitures = mongo.db.voitures.count_documents({})
    total_clients = mongo.db.clients.count_documents({})

    return jsonify({
        "total_voitures": total_voitures,
        "total_clients": total_clients
    })

if __name__ == "__main__":
    app.run(debug=True)
