from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import io
from flask import send_file
from werkzeug.utils import secure_filename

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    
    # Charge la configuration AVANT d'initialiser les extensions
    app.config.from_object('Backend.config.Config')
    
    CORS(app, resources={ r"/api/*": {"origins": ["http://localhost:3000"], "supports_credentials": True} })
    
    # Initialise MongoDB avec l'application
    mongo.init_app(app, uri=app.config['MONGO_URI'])
    
    # Enregistrer les blueprints avec le préfixe '/api'
    from Backend.blueprints import admin, client, voiture, manager, reservation
    app.register_blueprint(admin.admin_bp, url_prefix='/api') 
    app.register_blueprint(client.client_bp, url_prefix='/api')  
    app.register_blueprint(voiture.voiture_bp, url_prefix='/api') 
    app.register_blueprint(manager.manager_bp, url_prefix='/api')
    app.register_blueprint(reservation.reservation_bp, url_prefix='/api') 
    
    return app
from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Configuration pour dossier uploads
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Route pour servir les images uploadées
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Ensuite tu importes et enregistres tes blueprints ou routes
# Exemple :
# from routes.voiture import voiture_bp
# app.register_blueprint(voiture_bp, url_prefix="/api")
