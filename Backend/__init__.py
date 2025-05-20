from flask import Flask
from flask_pymongo import PyMongo
from config import Config

# Initialize PyMongo instance
mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    
    # Load configuration settings from the Config class
    app.config.from_object(Config)
    
    # Initialize the PyMongo with the app
    mongo.init_app(app)

    # Import the routes and register them
    # from routes import auth, car
    # app.register_blueprint(auth.bp)
    # app.register_blueprint(car.bp)

    return app
