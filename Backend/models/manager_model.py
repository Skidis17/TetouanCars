from datetime import datetime
from bson import ObjectId
from db import mongo
from werkzeug.security import generate_password_hash

class Manager:
    def __init__(
        self,
        nom,
        prenom,
        email,
        mot_de_passe,
        telephone,
        statut="actif",
        date_creation=None
    ):
        self._id = ObjectId()
        self.nom = nom
        self.prenom = prenom
        self.email = email
        self.mot_de_passe = generate_password_hash(mot_de_passe)
        self.telephone = telephone
        self.statut = statut  # actif/inactif
        self.date_creation = date_creation or datetime.utcnow()

    def save(self):
        return mongo.db.managers.insert_one(self.to_dict())

    def to_dict(self):
        return {
            "_id": self._id,
            "nom": self.nom,
            "prenom": self.prenom,
            "email": self.email,
            "mot_de_passe": self.mot_de_passe,
            "telephone": self.telephone,
            "statut": self.statut,
            "date_creation": self.date_creation
        }