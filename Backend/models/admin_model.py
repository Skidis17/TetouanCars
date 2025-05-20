from datetime import datetime
from bson import ObjectId
from db import mongo
from werkzeug.security import generate_password_hash

class Admin:
    def __init__(
        self,
        nom,
        email,
        mdp,
        date_creation=None
    ):
        self._id = ObjectId()
        self.nom = nom
        self.email = email
        self.mdp = generate_password_hash(mdp)
        self.date_creation = date_creation or datetime.utcnow()

    def save(self):
        return mongo.db.admins.insert_one(self.to_dict())

    def to_dict(self):
        return {
            "_id": self._id,
            "nom": self.nom,
            "email": self.email,
            "mdp": self.mdp,
            "date_creation": self.date_creation
        }