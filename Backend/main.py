from flask import Flask
from flask_cors import CORS
from flask import send_file
from werkzeug.utils import secure_filename
from flask import Flask, send_from_directory
from config import Config
import os

# from flask_pymongo import PyMongo
from blueprints.cars import voiture_bp  # example route
from blueprints.manager import manager_bp
from blueprints.index import stats_bp
from Backend.db import mongo
from Backend.blueprints import admin, client, manager, reservation

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    mongo.init_app(app)

    # # Register blueprints
    app.register_blueprint(stats_bp)
    app.register_blueprint(voiture_bp)
    app.register_blueprint(admin.admin_bp) 
    app.register_blueprint(client.client_bp)  
    app.register_blueprint(manager.manager_bp)
    app.register_blueprint(reservation.reservation_bp) 
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

# Configuration pour dossier uploads
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Route pour servir les images uploadées
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
