from pymongo import MongoClient
import re

# Connexion MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client.CarRental
voitures = db.voitures

# Correction de toutes les images
for voiture in voitures.find():
    if 'image' in voiture:
        old_image = voiture['image']
        if old_image.startswith('http'):
            # Extraire uniquement le nom de fichier
            filename = re.sub(r'.*/', '', old_image)
            # Mise à jour dans la base
            voitures.update_one(
                {'_id': voiture['_id']},
                {'$set': {'image': filename}}
            )
            print(f"Document {voiture['_id']} corrigé : {filename}")

print("✅ Correction terminée.")
