from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from blueprints.cars import voiture_bp  # example route
from config import Config
from Backend.db import mongo

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    mongo.init_app(app)

    # # Register blueprints
    app.register_blueprint(voiture_bp)
    # app.register_blueprint(cars_bp, url_prefix='/api/cars')

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
