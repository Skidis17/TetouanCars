from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Allow all origins
CORS(app, resources={r"/*": {"origins": "*"}})

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["CarRental"]  
reservations_collection = db["reservations"] 
cars_collection = db["voitures"]
clients_collection = db["clients"]

# Dashboard Stats Endpoint
@app.route("/api/dashboard/stats", methods=["GET"])
def dashboard_stats():
    # Total Reservations
    total_reservations = reservations_collection.count_documents({})

    # Available Cars
    reserved_car_ids = reservations_collection.distinct("voiture_id", {
        "date_debut": {"$lte": datetime.now()},
        "date_fin": {"$gte": datetime.now()}
    })
    total_cars = cars_collection.count_documents({})
    available_cars = total_cars - len(reserved_car_ids)

    # Active Clients
    active_client_ids = reservations_collection.distinct("client_id", {
        "date_fin": {"$gte": datetime.now()}
    })
    active_clients = len(active_client_ids)

    return jsonify({
        "totalReservations": total_reservations,
        "availableCars": available_cars,
        "activeClients": active_clients
    })


# Upcoming Reservations Endpoint
@app.route("/api/dashboard/upcoming-reservations", methods=["GET"])
def upcoming_reservations():
    reservations = list(reservations_collection.find(
        {"date_debut": {"$gte": datetime.now()}},
        {"_id": 0, "client_id": 1, "voiture_id": 1, "date_debut": 1, "statut": 1}
    ).sort("date_debut", 1))

    # Enrich reservations with client and car details
    enriched_reservations = []
    for reservation in reservations:
        client = clients_collection.find_one({"_id": reservation["client_id"]}, {"_id": 0, "nom": 1, "prenom": 1})
        car = cars_collection.find_one({"_id": reservation["voiture_id"]}, {"_id": 0, "marque": 1, "modele": 1})
        enriched_reservations.append({
            "clientName": f"{client['prenom']} {client['nom']}" if client else "Unknown",
            "carModel": f"{car['marque']} {car['modele']}" if car else "Unknown",
            "startDate": reservation["date_debut"],
            "status": reservation["statut"]
        })

    return jsonify({"upcomingReservations": enriched_reservations})

# Fetch all reservations
@app.route("/api/reservations", methods=["GET"])
def get_reservations():
    reservations = list(reservations_collection.find({}, {
        "_id": 1,
        "client_id": 1,
        "voiture_id": 1,
        "date_debut": 1,
        "date_fin": 1,
        "statut": 1,
        "prix_total": 1,
        "paiement": 1,  # Fetch the entire paiement object
        "date_reservation": 1
    }))

    # Enrich reservations with client and car details
    enriched_reservations = []
    for reservation in reservations:
        client = clients_collection.find_one({"_id": reservation["client_id"]}, {"_id": 0, "nom": 1, "prenom": 1, "email": 1, "telephone": 1})
        car = cars_collection.find_one({"_id": reservation["voiture_id"]}, {"_id": 0, "marque": 1, "modele": 1})
        
        paiement = reservation.get("paiement", {})
        payment_method = paiement.get("methode", "N/A")
        payment_status = paiement.get("statut", "N/A")

        enriched_reservations.append({
            "id": str(reservation["_id"]),
            "clientName": f"{client['prenom']} {client['nom']}" if client else "Unknown",
            "clientEmail": client["email"] if client else "Unknown",
            "clientPhone": client["telephone"] if client else "Unknown",
            "carModel": f"{car['marque']} {car['modele']}" if car else "Unknown",
            "startDate": reservation["date_debut"],
            "endDate": reservation["date_fin"],
            "status": reservation["statut"],
            "totalAmount": reservation["prix_total"],
            "paymentMethod": payment_method,
            "paymentStatus": payment_status,
            "reservationDate": reservation.get("date_reservation")
        })

    return jsonify(enriched_reservations)

# Delete a reservation
@app.route("/api/reservations/<reservation_id>", methods=["DELETE"])
def delete_reservation(reservation_id):
    result = reservations_collection.delete_one({"_id": ObjectId(reservation_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Reservation deleted successfully"}), 200
    else:
        return jsonify({"error": "Reservation not found"}), 404

@app.route("/api/reservations/<reservation_id>", methods=["PATCH"])
def patch_reservation(reservation_id):
    data = request.json
    update_fields = {}

    # Update status if provided
    if "status" in data:
        update_fields["statut"] = data["status"]

    # Update payment status if provided
    if "paymentStatus" in data:
        update_fields["paiement.statut"] = data["paymentStatus"]

    if not update_fields:
        return jsonify({"error": "No valid fields to update"}), 400

    result = reservations_collection.update_one(
        {"_id": ObjectId(reservation_id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Reservation not found"}), 404

    return jsonify({"message": "Reservation updated successfully"}), 200


# Add a new reservation
@app.route("/api/reservations", methods=["POST"])
def add_reservation():
    try:
        data = request.json
        print("Received data:", data)
        client_id = ObjectId(data["clientId"])
        car_id = ObjectId(data["carId"])
        details = data["reservationDetails"]

        reservation = {
            "client_id": client_id,
            "voiture_id": car_id,
            "date_debut": datetime.fromisoformat(details["startDate"].replace("Z", "+00:00")),
            "date_fin": datetime.fromisoformat(details["endDate"].replace("Z", "+00:00")),
            "prix_total": details["totalAmount"],
            "discount": details.get("discount", 0),  
            "statut": "en attente",
            "date_reservation": datetime.now(),
            "paiement": {
                "methode": details["paymentMethod"],
                "statut": details["paymentStatus"]
            }
        }
        result = reservations_collection.insert_one(reservation)
        return jsonify({"message": "Reservation created successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Failed to create reservation", "message": str(e)}), 500
    
# Fetch a single reservation by ID
@app.route("/api/reservations/<reservation_id>", methods=["GET"])
def get_reservation(reservation_id):
    reservation = reservations_collection.find_one({"_id": ObjectId(reservation_id)})
    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404

    client = clients_collection.find_one({"_id": reservation["client_id"]}, {"_id": 0, "nom": 1, "prenom": 1})
    car = cars_collection.find_one({"_id": reservation["voiture_id"]}, {"_id": 0, "marque": 1, "modele": 1})

    return jsonify({
        "id": str(reservation["_id"]),
        "clientId": str(reservation["client_id"]),
        "carId": str(reservation["voiture_id"]),
        "clientName": f"{client['prenom']} {client['nom']}" if client else "Unknown",
        "carModel": f"{car['marque']} {car['modele']}" if car else "Unknown",
        "startDate": reservation["date_debut"],
        "endDate": reservation["date_fin"],
        "status": reservation["statut"],
        "totalAmount": reservation["prix_total"]
    })

# Update a reservation
@app.route("/api/reservations/<reservation_id>", methods=["PUT"])
def update_reservation(reservation_id):
    data = request.json
    updated_reservation = {
        "client_id": ObjectId(data["client_id"]),
        "voiture_id": ObjectId(data["car_id"]),
        "date_debut": data["startDate"],
        "date_fin": data["endDate"],
        "statut": data["status"],
        "prix_total": data["totalAmount"]
    }
    result = reservations_collection.update_one({"_id": ObjectId(reservation_id)}, {"$set": updated_reservation})
    if result.matched_count == 0:
        return jsonify({"error": "Reservation not found"}), 404

    return jsonify({"message": "Reservation updated successfully"}), 200

# calendar 
@app.route("/api/calendar/reservations", methods=["GET"])
def calendar_reservations():
    try:
        # Fetch all reservations
        reservations = list(reservations_collection.find({}, {
            "_id": 1,
            "client_id": 1,
            "voiture_id": 1,
            "date_debut": 1,
            "date_fin": 1,
            "statut": 1
        }))

        # Enrich reservations with client and car details
        enriched_reservations = []
        for reservation in reservations:
            client = clients_collection.find_one({"_id": reservation["client_id"]}, {"_id": 0, "nom": 1, "prenom": 1})
            car = cars_collection.find_one({"_id": reservation["voiture_id"]}, {"_id": 0, "marque": 1, "modele": 1})
            enriched_reservations.append({
                "id": str(reservation["_id"]),
                "clientName": f"{client['prenom']} {client['nom']}" if client else "Unknown",
                "carModel": f"{car['marque']} {car['modele']}" if car else "Unknown",
                "startDate": reservation["date_debut"],
                "endDate": reservation["date_fin"],
                "status": reservation["statut"]
            })

        return jsonify({"reservations": enriched_reservations}), 200
    except Exception as e:
        print("Error fetching calendar reservations:", str(e))
        return jsonify({"error": "Failed to fetch reservations"}), 500
    
# clients list
@app.route("/api/clients", methods=["GET"])
def get_clients():
    try:
        clients = list(clients_collection.find({}, {
            "_id": 1,
            "nom": 1,
            "prenom": 1,
            "email": 1,
            "telephone": 1,
            "adresse": 1,
            "CIN": 1,
            "permis_conduire": 1,
            "numero_permis": 1,
        }))
        # Convert ObjectId to string
        for client in clients:
            client["_id"] = str(client["_id"])
        return jsonify({"clients": clients}), 200
    except Exception as e:
        print("Error fetching clients:", str(e))
        return jsonify({"error": "Failed to fetch clients"}), 500

# Add a new client
@app.route("/api/clients", methods=["POST"])
def add_client():
    try:
        data = request.json
        new_client = {
            "nom": data["nom"],
            "prenom": data["prenom"],
            "email": data["email"],
            "telephone": data["telephone"],
            "adresse": {
                "rue": data["adresse"]["rue"],
                "immeuble": data["adresse"]["immeuble"],
                "appartement": data["adresse"]["appartement"],
                "ville": data["adresse"]["ville"],
                "code_postal": data["adresse"]["code_postal"],
            },
            "CIN": data["CIN"],
            "permis_conduire": data["permis_conduire"],
            "numero_permis": data["numero_permis"],
        }
        result = clients_collection.insert_one(new_client)
        return jsonify({"message": "Client added successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        print("Error adding client:", str(e))
        return jsonify({"error": "Failed to add client"}), 500

#delete client
@app.route("/api/clients/<client_id>", methods=["DELETE"])
def delete_client(client_id):
    try:
        result = clients_collection.delete_one({"_id": ObjectId(client_id)})
        if result.deleted_count == 1:
            # Delete all reservations related to this client
            reservations_collection.delete_many({"client_id": ObjectId(client_id)})
            return jsonify({"message": "Client and related reservations deleted"}), 200
        else:
            return jsonify({"error": "Client not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#UPDATE CLIENT
@app.route("/api/clients/<client_id>", methods=["PUT"])
def update_client(client_id):
    try:
        data = request.json
        update_fields = {
            "nom": data["nom"],
            "prenom": data["prenom"],
            "email": data["email"],
            "telephone": data["telephone"],
            "adresse": {
                "rue": data["adresse"]["rue"],
                "immeuble": data["adresse"]["immeuble"],
                "appartement": data["adresse"]["appartement"],
                "ville": data["adresse"]["ville"],
                "code_postal": data["adresse"]["code_postal"],
            },
            "CIN": data["CIN"],
            "permis_conduire": data["permis_conduire"],
            "numero_permis": data["numero_permis"],
        }
        result = clients_collection.update_one(
            {"_id": ObjectId(client_id)},
            {"$set": update_fields}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Client not found"}), 404
        return jsonify({"message": "Client updated successfully"}), 200
    except Exception as e:
        print("Error updating client:", str(e))
        return jsonify({"error": "Failed to update client"}), 500
    
# List all cars
@app.route("/api/cars", methods=["GET"])
def get_cars():
    cars = list(cars_collection.find())
    now = datetime.now()
    for car in cars:
        car_id = car["_id"]
        # Check if there is an active reservation for this car
        active_res = reservations_collection.find_one({
            "voiture_id": car_id,
            "date_debut": {"$lte": now},
            "date_fin": {"$gte": now},
            "statut": {"$in": ["acceptée", "en attente"]}
        })
        car["status"] = "indisponible" if active_res else "disponible"
        car["_id"] = str(car["_id"])
        if "date_ajout" in car and hasattr(car["date_ajout"], "isoformat"):
            car["date_ajout"] = car["date_ajout"].isoformat()
    return jsonify({"cars": cars})

# Add a new car
@app.route("/api/cars", methods=["POST"])
def add_car():
    data = request.json
    car = {
        "marque": data["marque"],
        "modele": data["modele"],
        "annee": data["annee"],
        "immatriculation": data["immatriculation"],
        "couleur": data["couleur"],
        "kilometrage": data["kilometrage"],
        "prix_journalier": data["prix_journalier"],
        "status": data.get("status", "disponible"),
        "type_carburant": data["type_carburant"],
        "nombre_places": data["nombre_places"],
        "options": data.get("options", []),
        "date_ajout": datetime.now(),
        "image": data.get("image", ""),
    }
    result = cars_collection.insert_one(car)
    car["_id"] = str(result.inserted_id)
    car["date_ajout"] = car["date_ajout"].isoformat()
    return jsonify(car), 201

# Delete a car
@app.route("/api/cars/<car_id>", methods=["DELETE"])
def delete_car(car_id):
    result = cars_collection.delete_one({"_id": ObjectId(car_id)})
    if result.deleted_count == 1:
        # Delete all reservations related to this car
        reservations_collection.delete_many({"voiture_id": ObjectId(car_id)})
        return jsonify({"message": "Car and related reservations deleted"}), 200
    else:
        return jsonify({"error": "Car not found"}), 404
    
# Update a car
@app.route("/api/cars/<car_id>", methods=["PUT"])
def update_car(car_id):
    data = request.json
    update_fields = {
        "marque": data.get("marque"),
        "modele": data.get("modele"),
        "annee": int(data.get("annee")),
        "immatriculation": data.get("immatriculation"),
        "couleur": data.get("couleur"),
        "kilometrage": int(data.get("kilometrage")),
        "prix_journalier": float(data.get("prix_journalier")),
        "status": data.get("status", "disponible"),
        "type_carburant": data.get("type_carburant"),
        "nombre_places": int(data.get("nombre_places")),
        "options": data.get("options", []),
        "image": data.get("image", ""),
    }
    result = cars_collection.update_one(
        {"_id": ObjectId(car_id)},
        {"$set": update_fields}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Car not found"}), 404
    return jsonify({"message": "Car updated successfully"}), 200
    
#get available cars
@app.route("/api/cars/available", methods=["GET"])
def get_available_cars():
    try:
        start = request.args.get("start")
        end = request.args.get("end")
        if not start or not end:
            return jsonify({"error": "Missing start or end date"}), 400

        start_date = datetime.fromisoformat(start)
        end_date = datetime.fromisoformat(end)

        # Find cars that are NOT reserved in the given range
        reserved_car_ids = reservations_collection.distinct("voiture_id", {
            "$or": [
                {
                    "date_debut": {"$lte": end_date},
                    "date_fin": {"$gte": start_date},
                    "statut": {"$in": ["acceptée", "en attente"]}
                }
            ]
        })
        available_cars = list(cars_collection.find({
            "_id": {"$nin": reserved_car_ids}
        }))
        for car in available_cars:
            car["_id"] = str(car["_id"])
        return jsonify({"cars": available_cars}), 200
    except Exception as e:
        print("Error fetching available cars:", str(e))
        return jsonify({"error": "Failed to fetch available cars"}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5000)