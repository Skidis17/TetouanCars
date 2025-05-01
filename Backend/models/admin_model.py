import bcrypt
from datetime import datetime
from bson import ObjectId
from Backend.db import mongo

class Admin:
    @staticmethod
    def create_admin(nom, email, password):
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        return mongo.db.admins.insert_one({
            "nom": nom,
            "email": email,
            "mdp": hashed_pw.decode('utf-8'),  
            "date_creation": datetime.utcnow()
        })

    @staticmethod
    def find_by_email(email):
        return mongo.db.admins.find_one({"email": email})