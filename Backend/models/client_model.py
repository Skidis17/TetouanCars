from datetime import datetime
from bson import ObjectId
from Backend.db import mongo

class Client:
    def __init__(
        self,
        nom,
        prenom,
        email,
        telephone,
        permis_conduire,
        numero_permis,
        date_expiration,
        CIN,
        photo=None,
        date_ajout=None,
        adresse=None
    ):
        self._id = ObjectId()
        self.nom = nom
        self.prenom = prenom
        self.email = email
        self.telephone = telephone
        self.adresse = adresse or {}
        self.permis_conduire = permis_conduire  
        self.numero_permis = numero_permis
        self.date_expiration = date_expiration
        self.CIN = CIN
        self.photo = photo
        self.date_ajout = date_ajout or datetime.utcnow()

    def save(self):
        return mongo.db.clients.insert_one(self.to_dict())

    def to_dict(self):
        return {
            "_id": self._id,
            "nom": self.nom,
            "prenom": self.prenom,
            "email": self.email,
            "telephone": self.telephone,
            "adresse": self.adresse,
            "permis_conduire": self.permis_conduire,
            "numero_permis": self.numero_permis,
            "date_expiration": self.date_expiration,
            "CIN": self.CIN,
            "photo": self.photo,
            "date_ajout": self.date_ajout
        }