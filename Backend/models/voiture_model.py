from datetime import datetime
from bson import ObjectId
from flask_pymongo import PyMongo
from db import mongo

class Voiture:
    def __init__(
        self,
        marque,
        modele,
        annee,
        immatriculation,
        couleur,
        kilometrage,
        prix_journalier,
        status="disponible",
        type_carburant="Essence",
        nombre_places=5,
        options=None,
        image=None,
        date_ajout=None
    ):
        self._id = ObjectId()
        self.marque = marque
        self.modele = modele
        self.annee = annee
        self.immatriculation = immatriculation
        self.couleur = couleur
        self.kilometrage = kilometrage
        self.prix_journalier = prix_journalier
        self.status = status
        self.type_carburant = type_carburant
        self.nombre_places = nombre_places
        self.options = options or []
        self.image = image or "default_car.jpg"
        self.date_ajout = date_ajout or datetime.utcnow()

    def save(self):
        return mongo.db.voitures.insert_one(self.to_dict())

    def to_dict(self):
        return {
            "_id": self._id,
            "marque": self.marque,
            "modele": self.modele,
            "annee": self.annee,
            "immatriculation": self.immatriculation,
            "couleur": self.couleur,
            "kilometrage": self.kilometrage,
            "prix_journalier": self.prix_journalier,
            "status": self.status,
            "type_carburant": self.type_carburant,
            "nombre_places": self.nombre_places,
            "options": self.options,
            "image": self.image,
            "date_ajout": self.date_ajout
        }

    @staticmethod
    def find_by_id(car_id):
        return mongo.db.voitures.find_one({"_id": ObjectId(car_id)})

    @staticmethod
    def find_all():
        return list(mongo.db.voitures.find())