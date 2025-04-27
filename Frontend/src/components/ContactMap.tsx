import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ContactMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapRef.current).setView([35.5629, -5.3636], 15);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

      // Add custom marker
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });

      markerRef.current = L.marker([35.5629, -5.3636], { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">TetouanCars</h3>
            <p>ENSA Tétouan, Avenue de la Palestine, Tétouan 93030, Maroc</p>
          </div>
        `)
        .openPopup();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <div 
        ref={mapRef} 
        className="w-full h-[400px]"
        style={{ backgroundColor: '#f8fafc' }} // Fallback background
      >
        {/* Loading fallback text */}
        {!mapInstance.current && (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Chargement de la carte...
          </div>
        )}
      </div>
      <div className="bg-carRental-primary text-white p-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span className="font-medium">ENSA Tétouan, Avenue de la Palestine, Tétouan 93030, Maroc</span>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;