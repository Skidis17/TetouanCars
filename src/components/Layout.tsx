
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Car, FileText, LogOut, Menu, User, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'Admin' };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate('/login');
  };

  const menuItems = [
    { name: 'Tableau de Bord', path: '/dashboard', icon: <FileText className="h-5 w-5" /> },
    { name: 'Réservations', path: '/reservations', icon: <Car className="h-5 w-5" /> },
    { name: 'Calendrier', path: '/calendar', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Liste des Clients', path: '/clients', icon: <User className="h-5 w-5" /> }, 
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={`bg-secondary/50 backdrop-blur-sm border-r border-primary/20 w-64 fixed inset-y-0 left-0 z-30 transition-transform transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-primary/20 flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              TetouanCars
            </h2>
            <button 
              className="lg:hidden text-gray-500"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-4 py-2 border-b border-primary/20">
            <div className="flex items-center gap-3 py-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-200">{user.name}</p>
                <p className="text-xs text-gray-400">Gestionnaire</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'text-gray-400 hover:bg-primary/10 hover:text-gray-200'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-primary/20">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center hover:bg-primary/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-secondary/50 backdrop-blur-sm border-b border-primary/20 h-16 fixed top-0 right-0 left-0 lg:left-64 z-20">
          <div className="px-4 h-full flex items-center justify-between">
            <button
              className="lg:hidden text-gray-400 hover:text-gray-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>
        
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </div>
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
