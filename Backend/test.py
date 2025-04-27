import bcrypt
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
admin = client.CarRental.admins.find_one({'email': 'admin@location.com'})

if admin:
    print("Admin trouvé!")
    print(f"Hash: {admin['mdp']}")
    
    # Test avec le mot de passe que vous utilisez
    if bcrypt.checkpw(b"Admin1234", admin['mdp'].encode('utf-8')):
        print("Mot de passe VALIDE")
    else:
        print("Mot de passe INVALIDE")
else:
    print("Admin non trouvé!")