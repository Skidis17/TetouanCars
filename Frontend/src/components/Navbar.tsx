
import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-carRental-primary" />
          <span className="font-bold text-xl text-carRental-dark">TetouanCars</span>
        </Link>
        
        <nav className="flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-carRental-primary font-medium transition-colors">
            Accueil
          </Link>
          <Link to="/cars" className="text-gray-700 hover:text-carRental-primary font-medium transition-colors">
            Voitures
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-carRental-primary font-medium transition-colors">
            À propos
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-carRental-primary font-medium transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
