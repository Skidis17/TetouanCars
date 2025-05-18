import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const EditReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reservations/${id}`);
        setReservation(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservation:", error);
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReservation((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      client_id: reservation.clientId,
      car_id: reservation.carId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      status: reservation.status,
      totalAmount: reservation.totalAmount,
    };
    console.log("Submitting payload:", payload); // Debug log
    try {
      const response = await axios.put(`http://localhost:5000/api/reservations/${id}`, payload);
      console.log("Update response:", response.data); // Debug log
      toast({
        title: "Reservation Updated",
        description: "The reservation has been successfully updated.",
      });
      navigate("/reservations");
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!reservation) {
    return <p>Reservation not found.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Reservation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Client Name</label>
          <Input
            type="text"
            name="clientName"
            value={reservation.clientName}
            disabled
            className="bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Car Model</label>
          <Input
            type="text"
            name="carModel"
            value={reservation.carModel}
            disabled
            className="bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <Input
            type="date"
            name="startDate"
            value={reservation.startDate.split("T")[0]}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <Input
            type="date"
            name="endDate"
            value={reservation.endDate.split("T")[0]}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <Input
            type="text"
            name="status"
            value={reservation.status}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Total Amount</label>
          <Input
            type="number"
            name="totalAmount"
            value={reservation.totalAmount}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/reservations")}>
            Cancel
          </Button>
          <Button type="submit" className="ml-2">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditReservation;