
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactMap from "@/components/ContactMap";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Contactez-nous</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="space-y-8">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-carRental-primary mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Notre Adresse</h3>
                      <p className="text-gray-600">15 Avenue Mohammed V, Tétouan 93000, Maroc</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-carRental-primary mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
                      <p className="text-gray-600">+212 539-123-456</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-carRental-primary mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Email</h3>
                      <p className="text-gray-600">contact@tetouancars.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-carRental-light rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Heures d'ouverture</h2>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Lundi - Vendredi:</span>
                      <span>8:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Samedi:</span>
                      <span>9:00 - 16:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dimanche:</span>
                      <span>Fermé</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <ContactMap />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
