from bson import ObjectId
from datetime import datetime

class Voiture:
    def __init__(self, marque, modele, annee, immatriculation, couleur, kilometrage, prix_journalier, status, type_carburant, nombre_places, options, image=None, date_ajout=None, _id=None):
        self._id = ObjectId() if _id is None else _id
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
        self.options = options
        self.image = image
        self.date_ajout = date_ajout or datetime.utcnow()

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
