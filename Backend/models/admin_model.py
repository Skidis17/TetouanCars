from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash
from db import mongo

class Admin:
    @staticmethod
    def create_admin(nom, email, password):
        hashed_pw = generate_password_hash(password)
        return mongo.db.admins.insert_one({
            "nom": nom,
            "email": email,
            "mdp": hashed_pw,
            "date_creation": datetime.utcnow()
        })

    @staticmethod
    def find_by_email(email):
        return mongo.db.admins.find_one({"email": email})