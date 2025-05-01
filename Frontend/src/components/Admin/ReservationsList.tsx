import { useEffect, useState } from "react";
import { getReservations } from "../../services/api";

const ReservationsList = () => {
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getReservations();
      setReservations(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Liste des Réservations</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Client</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Date de début</th>
            <th className="p-2">Date de fin</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res._id} className="border-b">
              <td className="p-2">{res._id}</td>
              <td className="p-2">{res.client_id}</td> {/* Changer clientId en client_id */}
              <td className="p-2">{res.statut}</td> {/* Changer status en statut */}
              <td className="p-2">{new Date(res.date_debut).toLocaleString()}</td> {/* Changer dateDebut en date_debut */}
              <td className="p-2">{new Date(res.date_fin).toLocaleString()}</td> {/* Changer dateFin en date_fin */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ReservationsList;