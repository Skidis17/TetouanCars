
import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const ContactMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = () => {
      if (!mapRef.current) return;
      
      const ensaTetouan = { lat: 35.5629, lng: -5.3636 };
      
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: ensaTetouan,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });
      
      const marker = new window.google.maps.Marker({
        position: ensaTetouan,
        map: map,
        title: "TetouanCars",
        animation: window.google.maps.Animation.DROP,
      });
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">TetouanCars</h3>
            <p>ENSA Tétouan, Avenue de la Palestine, Tétouan 93030, Maroc</p>
          </div>
        `,
      });
      
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
      
      infoWindow.open(map, marker);
    };
    
    document.head.appendChild(script);
    
    return () => {
      window.initMap = undefined;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <div ref={mapRef} className="w-full h-[400px]"></div>
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
