from flask import Flask
from flask_pymongo import PyMongo
import gridfs
from bson import ObjectId

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/CarRental"
mongo = PyMongo(app)
fs = gridfs.GridFS(mongo.db) 