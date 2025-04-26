import os
from dotenv import load_dotenv

# Load environment variables from .flaskenv or .env
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "f11d93faae63d3322d96a3e5d83f9fe63db74d04728caa908e63e59dc12e1d26")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/Location")

class DevConfig(Config):
    DEBUG = True

class ProdConfig(Config):
    DEBUG = False
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://prod_db:27017/Location")
