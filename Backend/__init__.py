from flask import Flask
from flask_pymongo import PyMongo
from .config import Config

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialisation de MongoDB avec l'URI explicite
    mongo.init_app(app, uri=app.config['MONGO_URI'])
    
    # Import des blueprints après initialisation
    from .main.routes import main
    app.register_blueprint(main)
    
    return app