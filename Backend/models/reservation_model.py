from datetime import datetime
from bson import ObjectId
from db import mongo

class Reservation:
    def __init__(
        self,
        client_id,
        voiture_id,
        manager_traiteur_id,
        manager_createur_id,
        date_debut,
        date_fin,
        prix_total,
        statut="en attente",
        date_reservation=None
    ):
        self._id = ObjectId()
        self.client_id = ObjectId(client_id)
        self.voiture_id = ObjectId(voiture_id)
        self.manager_traiteur_id = ObjectId(manager_traiteur_id)
        self.manager_createur_id = ObjectId(manager_createur_id)
        self.date_debut = date_debut
        self.date_fin = date_fin
        self.prix_total = prix_total
        self.statut = statut  # en attente/acceptée/refusee
        self.date_reservation = date_reservation or datetime.utcnow()
        self.paiement = None

    def save(self):
        return mongo.db.reservations.insert_one(self.to_dict())

    def to_dict(self):
        return {
            "_id": self._id,
            "client_id": self.client_id,
            "voiture_id": self.voiture_id,
            "manager_traiteur_id": self.manager_traiteur_id,
            "manager_createur_id": self.manager_createur_id,
            "date_debut": self.date_debut,
            "date_fin": self.date_fin,
            "prix_total": self.prix_total,
            "statut": self.statut,
            "date_reservation": self.date_reservation,
            "paiement": self.paiement
        }