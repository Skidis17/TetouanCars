import bcrypt
from pymongo import MongoClient

# Connexion à MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.CarRental

# Données de l'admin
email = "admin@location.com"
mot_de_passe = "Admin1234"

# Vérifie si l'admin existe déjà
if db.admins.find_one({"email": email}):
    print("Admin déjà existant.")
else:
    # Hachage du mot de passe
    hashed_password = bcrypt.hashpw(mot_de_passe.encode('utf-8'), bcrypt.gensalt())

    # Insertion
    admin_data = {
        "nom": "Admin",
        "email": email,
        "mdp": hashed_password.decode('utf-8')  # decode() pour stocker en string
    }

    db.admins.insert_one(admin_data)
    print("Admin inséré avec succès.")