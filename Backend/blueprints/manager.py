from flask import Blueprint, request, jsonify
from db import mongo
import bcrypt
from bson import ObjectId
from datetime import datetime

manager_bp = Blueprint('manager', __name__)


# bd config
# MONGO_URI = os.getenv("MONGO_URI")
# client = MongoClient(MONGO_URI)
# db = client["Location"]  
# reservations_collection = db["reservations"] 
# cars_collection = db["voitures"]
# clients_collection = db["clients"]



##--------------- GET METHOD ---------------##

@manager_bp.route('/managers', methods=['GET'])
def get_managers():
    managers = list(mongo.db.managers.find())
    for manager in managers:
        manager['_id'] = str(manager['_id'])
    return jsonify(managers)

# Stat manager
@manager_bp.route("/manager/dashboard/stats", methods=["GET"])
def dashboard_stats():
    reservations_collection = mongo.db.reservations
    cars_collection = mongo.db.voitures
    now = datetime.now()
    total_reservations = reservations_collection.count_documents({})
    reserved_car_ids = reservations_collection.distinct("voiture_id", {
        "date_debut": {"$lte": now},
        "date_fin": {"$gte": now}
    })

    total_cars = cars_collection.count_documents({})
    available_cars = total_cars - len(reserved_car_ids)

    active_client_ids = reservations_collection.distinct("client_id", {
        "date_fin": {"$gte": now}
    })
    active_clients = len(active_client_ids)

    return jsonify({
        "totalReservations": total_reservations,
        "availableCars": available_cars,
        "activeClients": active_clients
    })


# Les Reservations Endpoint
@manager_bp.route("/manager/dashboard/upcoming-reservations", methods=["GET"])
def upcoming_reservations():
    now = datetime.now()
    reservations = list(mongo.db.reservations.find(
        {"date_debut": {"$gte": now}},
        {"_id": 0, "client_id": 1, "voiture_id": 1, "date_debut": 1, "statut": 1}
    ).sort("date_debut", 1))

    enriched_reservations = []
    for reservation in reservations:
        client = mongo.db.clients.find_one(
            {"_id": reservation["client_id"]},
            {"_id": 0, "nom": 1, "prenom": 1}
        )
        car = mongo.db.voitures.find_one(
            {"_id": reservation["voiture_id"]},
            {"_id": 0, "marque": 1, "modele": 1}
        )

        enriched_reservations.append({
            "clientName": f"{client['prenom']} {client['nom']}" if client else "Unknown",
            "carModel": f"{car['marque']} {car['modele']}" if car else "Unknown",
            "startDate": reservation["date_debut"],
            "status": reservation["statut"]
        })

    return jsonify({"upcomingReservations": enriched_reservations})


# Tout les Reservations
@manager_bp.route("/managers/reservations", methods=["GET"])
def get_reservations():
    reservations = list(mongo.db.reservations.find({}, {
        "_id": 1,
        "client_id": 1,
        "voiture_id": 1,
        "date_debut": 1,
        "date_fin": 1,
        "statut": 1,
        "prix_total": 1,
        "paiement": 1,  
        "date_reservation": 1
    }))
    enriched_reservations = []
    for reservation in reservations:
        client = mongo.db.clients.find_one(
            {"_id": reservation["client_id"]},
            {"_id": 0, "nom": 1, "prenom": 1, "email": 1, "telephone": 1}
        )
        car = mongo.db.voitures.find_one(
            {"_id": reservation["voiture_id"]},
            {"_id": 0, "marque": 1, "modele": 1}
        )

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


# Reservation by ID
@manager_bp.route("/managers/reservations/<reservation_id>", methods=["GET"])
def get_reservation(reservation_id):
    try:
        reservation = mongo.db.reservations.find_one({"_id": ObjectId(reservation_id)})
    except:
        return jsonify({"error": "Invalid reservation ID"}), 400

    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404

    client = mongo.db.clients.find_one(
        {"_id": reservation["client_id"]},
        {"_id": 0, "nom": 1, "prenom": 1}
    )
    car = mongo.db.voitures.find_one(
        {"_id": reservation["voiture_id"]},
        {"_id": 0, "marque": 1, "modele": 1}
    )

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

# Tout les voitures 
@manager_bp.route("/manager/cars", methods=["GET"])
def get_cars():
    cars = list(mongo.db.voitures.find())
    now = datetime.now()

    for car in cars:
        car_id = car["_id"]

        # Check if there is an active reservation for this car
        active_res = mongo.db.reservations.find_one({
            "voiture_id": car_id,
            "date_debut": {"$lte": now},
            "date_fin": {"$gte": now},
            "statut": {"$in": ["acceptee", "en attente"]}
        })

        car["status"] = "indisponible" if active_res else "disponible"
        car["_id"] = str(car["_id"])
        if "date_ajout" in car and hasattr(car["date_ajout"], "isoformat"):
            car["date_ajout"] = car["date_ajout"].isoformat()

    return jsonify({"cars": cars})


@manager_bp.route("/manager/cars/available", methods=["GET"])
def get_available_cars():
    try:
        start = request.args.get("start")
        end = request.args.get("end")

        if not start or not end:
            return jsonify({"error": "Missing start or end date"}), 400

        start_date = datetime.fromisoformat(start)
        end_date = datetime.fromisoformat(end)

        # Get list of car IDs that are reserved in the given date range
        reserved_car_ids = mongo.db.reservations.distinct("voiture_id", {
            "date_debut": {"$lte": end_date},
            "date_fin": {"$gte": start_date},
            "statut": {"$in": ["acceptee", "en_attente"]}
        })

        # Find all cars not in the reserved list
        available_cars = list(mongo.db.cars.find({
            "_id": {"$nin": reserved_car_ids}
        }))

        for car in available_cars:
            car["_id"] = str(car["_id"])
            if "date_ajout" in car and hasattr(car["date_ajout"], "isoformat"):
                car["date_ajout"] = car["date_ajout"].isoformat()

        return jsonify({"cars": available_cars}), 200

    except Exception as e:
        print("Error fetching available cars:", str(e))
        return jsonify({"error": "Failed to fetch available cars", "details": str(e)}), 500


# Calendrie (Pedagoquique hihi)
@manager_bp.route("/manager/calendar/reservations", methods=["GET"])
def calendar_reservations():
    try:
        reservations = list(mongo.db.reservations.find({}, {
            "_id": 1,
            "client_id": 1,
            "voiture_id": 1,
            "date_debut": 1,
            "date_fin": 1,
            "statut": 1
        }))

        enriched_reservations = []
        for reservation in reservations:
            client = mongo.db.clients.find_one(
                {"_id": reservation["client_id"]},
                {"_id": 0, "nom": 1, "prenom": 1}
            )
            car = mongo.db.voitures.find_one(
                {"_id": reservation["voiture_id"]},
                {"_id": 0, "marque": 1, "modele": 1}
            )

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


# Clients list
@manager_bp.route("/managers/clients", methods=["GET"])
def get_clients():
    try:
        clients = list(mongo.db.clients.find({}, {
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

        for client in clients:
            client["_id"] = str(client["_id"])

        return jsonify({"clients": clients}), 200
    except Exception as e:
        print("Error fetching clients:", str(e))
        return jsonify({"error": "Failed to fetch clients"}), 500
    
##------------------------------------------##



##--------------- POST METHOD ---------------##

@manager_bp.route('/managers', methods=['POST'])
def add_manager():
    data = request.get_json()

    if 'password' in data:
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        data['password'] = hashed_password.decode('utf-8') 

    mongo.db.managers.insert_one(data)
    return jsonify({'message': 'Manager ajouté avec succès'}), 201

# Add a new reservation
@manager_bp.route("/managers/reservations", methods=["POST"])
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
        result = mongo.db.reservations.insert_one(reservation)
        return jsonify({"message": "Reservation created successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Failed to create reservation", "message": str(e)}), 500
    

# Add a new client
@manager_bp.route("/managers/clients", methods=["POST"])
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

        result = mongo.db.clients.insert_one(new_client)
        return jsonify({
            "message": "Client added successfully",
            "id": str(result.inserted_id)
        }), 201

    except Exception as e:
        print("Error adding client:", str(e))
        return jsonify({
            "error": "Failed to add client",
            "message": str(e)
        }), 500

# Add a new car
@manager_bp.route("/managers/cars", methods=["POST"])
def add_car():
    try:
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

        result = mongo.db.cars.insert_one(car)

        car["_id"] = str(result.inserted_id)
        car["date_ajout"] = car["date_ajout"].isoformat()

        return jsonify(car), 201

    except Exception as e:
        print("Error adding car:", str(e))
        return jsonify({
            "error": "Failed to add car",
            "message": str(e)
        }), 500

##------------------------------------------##




##--------------- PUT METHOD ---------------##

@manager_bp.route('/Update_manager/<id>', methods=['PUT'])
def update_manager(id):
    data = request.get_json()

    manager_id = ObjectId(id)
  
    result = mongo.db.managers.update_one({'_id': manager_id}, {"$set": data})

    if result.matched_count == 0:
        return jsonify({'message': 'Aucun manager trouvé avec cet ID'}), 404
    return jsonify({'message': 'Manager mis à jour avec succès'})

# Update a reservation
@manager_bp.route("/manager/reservations/<reservation_id>", methods=["PUT"])
def update_reservation(reservation_id):
    try:
        data = request.json
        updated_reservation = {
            "client_id": ObjectId(data["client_id"]),
            "voiture_id": ObjectId(data["car_id"]),
            "date_debut": data["startDate"],
            "date_fin": data["endDate"],
            "statut": data["status"],
            "prix_total": data["totalAmount"]
        }

        result = mongo.db.reservations.update_one(
            {"_id": ObjectId(reservation_id)},
            {"$set": updated_reservation}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Reservation not found"}), 404

        return jsonify({"message": "Reservation updated successfully"}), 200

    except Exception as e:
        print("Error updating reservation:", str(e))
        return jsonify({
            "error": "Failed to update reservation",
            "message": str(e)
        }), 500
    
@manager_bp.route("/manager/cars/<car_id>", methods=["PUT"])
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
    result = mongo.db.cars.update_one(
        {"_id": ObjectId(car_id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Car not found"}), 404
    return jsonify({"message": "Car updated successfully"}), 200

##------------------------------------------##




##--------------- DELETE METHOD ---------------##

@manager_bp.route('/Delete_manager/<id>', methods=['DELETE'])
def delete_manager(id):

    manager_id = ObjectId(id)

    result = mongo.db.managers.delete_one({'_id': manager_id})

    if result.deleted_count == 0:
        return jsonify({'message': 'Aucun manager trouvé avec cet ID'}), 404

    return jsonify({'message': 'Manager supprimé avec succès'})

# Delete a reservation
@manager_bp.route("/manager/reservations/<reservation_id>", methods=["DELETE"])
def delete_reservation(reservation_id):
    try:
        result = mongo.db.reservations.delete_one({"_id": ObjectId(reservation_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Reservation deleted successfully"}), 200
        else:
            return jsonify({"error": "Reservation not found"}), 404
    except Exception as e:
        print("Error deleting reservation:", str(e))
        return jsonify({
            "error": "Failed to delete reservation",
            "message": str(e)
        }), 500


#delete client
@manager_bp.route("/manager/clients/<client_id>", methods=["DELETE"])
def delete_client(client_id):
    try:
        result = mongo.db.clients.delete_one({"_id": ObjectId(client_id)})
        if result.deleted_count == 1:
            # Delete all reservations related to this client
            mongo.db.reservations.delete_many({"client_id": ObjectId(client_id)})
            return jsonify({"message": "Client and related reservations deleted"}), 200
        else:
            return jsonify({"error": "Client not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a car
@manager_bp.route("/manger/cars/<car_id>", methods=["DELETE"])
def delete_car(car_id):
    result = mongo.db.cars.delete_one({"_id": ObjectId(car_id)})

    if result.deleted_count == 1:
        # Delete all reservations related to this car
        mongo.db.reservations.delete_many({"voiture_id": ObjectId(car_id)})
        return jsonify({"message": "Car and related reservations deleted"}), 200
    else:
        return jsonify({"error": "Car not found"}), 404
    


##--------------- UPDATE METHOD ---------------##

@manager_bp.route("/manager/clients/<client_id>", methods=["PUT"])
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

        result = mongo.db.clients.update_one(
            {"_id": ObjectId(client_id)},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Client not found"}), 404

        return jsonify({"message": "Client updated successfully"}), 200

    except Exception as e:
        print("Error updating client:", str(e))
        return jsonify({"error": "Failed to update client"}), 500
    
##--------------------------------------------##




##--------------- PATCH METHOD ---------------##

@manager_bp.route("/manager/reservations/<reservation_id>", methods=["PATCH"])
def patch_reservation(reservation_id):
    data = request.json
    update_fields = {}

    if "status" in data:
        update_fields["statut"] = data["status"]

    if "paymentStatus" in data:
        update_fields["paiement.statut"] = data["paymentStatus"]

    if not update_fields:
        return jsonify({"error": "No valid fields to update"}), 400

    # Directly access the collection via mongo
    result = mongo.db.reservations.update_one(
        {"_id": ObjectId(reservation_id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Reservation not found"}), 404

    return jsonify({"message": "Reservation updated successfully"}), 200

##--------------------------------------------##
