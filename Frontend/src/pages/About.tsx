
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">À Propos de TetouanCars</h1>
            
            <div className="prose prose-lg">
              <p className="text-lg text-gray-600 mb-6">
                Bienvenue chez TetouanCars, votre solution de location de voitures à Tétouan. Cette application a été spécialement conçue dans le cadre de notre projet MongoDB, démontrant l'utilisation efficace des technologies modernes dans le secteur de la location automobile.
              </p>
              
              <p className="text-lg text-gray-600 mb-6">
                Notre plateforme a été développée pour offrir une expérience utilisateur optimale, en utilisant MongoDB comme base de données principale pour gérer efficacement notre flotte de véhicules et les réservations de nos clients.
              </p>
              
              <div className="bg-carRental-light rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Notre Mission</h2>
                <p className="text-gray-600">
                  Faciliter la location de voitures à Tétouan en proposant une plateforme moderne, efficace et conviviale, soutenue par une technologie de pointe et un service client exceptionnel.
                </p>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Pourquoi Nous Choisir ?</h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <span className="text-carRental-primary">•</span>
                  <span>Interface utilisateur intuitive et moderne</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-carRental-primary">•</span>
                  <span>Gestion efficace des réservations grâce à MongoDB</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-carRental-primary">•</span>
                  <span>Service client réactif et professionnel</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-carRental-primary">•</span>
                  <span>Large sélection de véhicules bien entretenus</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
