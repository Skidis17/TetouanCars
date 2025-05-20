from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import io
from flask import send_file
from werkzeug.utils import secure_filename

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config.from_object('Backend.config.Config')
    
    # Enhanced CORS configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": "http://localhost:3000",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    mongo.init_app(app, uri=app.config['MONGO_URI'])
    
    from Backend.blueprints import admin, client, voiture, manager, reservation
    app.register_blueprint(admin.admin_bp, url_prefix='/api/admin')
    app.register_blueprint(client.client_bp, url_prefix='/api')
    app.register_blueprint(voiture.voiture_bp, url_prefix='/api')
    app.register_blueprint(manager.manager_bp, url_prefix='/api')
    app.register_blueprint(reservation.reservation_bp, url_prefix='/api')
    
    return app