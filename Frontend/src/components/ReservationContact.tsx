
import { Manager } from "@/types/car";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReservationContactProps {
  manager: Manager;
  carId: string;
}

const ReservationContact = ({ manager, carId }: ReservationContactProps) => {
  return (
    <Card className="p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Réserver ce véhicule</h3>
      <p className="text-gray-600 mb-6">
        Pour réserver ce véhicule, veuillez contacter notre agence via:
      </p>
      
      <div className="space-y-1 mb-6">
        
        <div className="pl-12 space-y-3">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <a href={`tel:+212 500-800-332`} className="text-carRental-primary hover:underline">
            +212 500-800-332
            </a>
          </div>
          
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <a href={`mailto:tetouancars@gmail.com`} className="text-carRental-primary hover:underline">
              tetouancars@gmail.com
            </a>
          </div>
          
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-1" />
            <span className="text-gray-600">Tétouan, Maroc</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={() => window.location.href = `tel:+212 500-800-332`}
          className="w-full bg-carRental-primary hover:bg-carRental-secondary"
        >
          Appeler maintenant
        </Button>
        
        <Button 
          onClick={() => window.location.href = `mailto:tetouancars@gmail.com?subject=Réservation véhicule réf:${carId}`}
          variant="outline"
          className="w-full border-carRental-primary text-carRental-primary hover:bg-carRental-light"
        >
          Envoyer un email
        </Button>
      </div>
    </Card>
  );
};

export default ReservationContact;
