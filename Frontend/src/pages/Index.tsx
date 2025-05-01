import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedCars from "@/components/FeaturedCars";
import axios from "axios";
import { useEffect, useState } from "react";

const Index = () => {
  const [stats, setStats] = useState<{ total_voitures: number; total_clients: number }>({
    total_voitures: 0,
    total_clients: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/stats") // Replace with your backend URL in production
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des statistiques:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        <Hero />
        <FeaturedCars />

        <section id="about" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  À Propos de TetouanCars
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  TetouanCars est votre partenaire de confiance pour la location de véhicules. Nous
                  nous engageons à fournir un service de qualité supérieure et des véhicules bien
                  entretenus pour tous vos besoins de déplacement.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Notre flotte diversifiée comprend des véhicules de toutes catégories, des
                  citadines économiques aux SUV luxueux, en passant par les options électriques et
                  hybrides pour une mobilité plus verte.
                </p>

                {loading ? (
                  <p className="text-gray-500">Chargement des statistiques...</p>
                ) : (
                  <div className="flex space-x-6">
                    <div>
                      <div className="text-3xl font-bold text-carRental-primary mb-2">5+</div>
                      <div className="text-gray-500">Années d'expérience</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-carRental-primary mb-2">
                        {stats.total_voitures}+
                      </div>
                      <div className="text-gray-500">Véhicules</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-carRental-primary mb-2">
                        {stats.total_clients}+
                      </div>
                      <div className="text-gray-500">Clients satisfaits</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute -top-5 -left-5 w-32 h-32 bg-carRental-light rounded-full z-0"></div>
                <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-carRental-primary rounded-full z-0"></div>
                <img
                  src="/images/team.jpg"
                  alt="Notre équipe - TetouanCars"
                  className="rounded-xl shadow-lg relative z-10 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
