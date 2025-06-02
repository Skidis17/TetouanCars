import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Car, FileText, LogOut, Menu, User, X, ClipboardList, LayoutDashboard, History} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
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
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Tableau de Bord', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Réservations', path: '/admin/reservations', icon: <ClipboardList className="h-5 w-5" /> },
    { name: 'Clients', path: '/admin/clients', icon: <User className="h-5 w-5" /> }, 
    { name: 'Managers', path: '/admin/managers', icon: <Calendar className="h-5 w-5" /> }, 
    { name: 'Voitures', path: '/admin/voitures', icon: <Car className="h-5 w-5" /> }, 
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TetouanCars
              </h2>
              <button 
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">Administrateur</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span className={`mr-3 ${({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center space-x-2 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 border-gray-200 hover:border-red-200 transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 lg:left-72 z-20">
          <div className="px-4 h-full flex items-center justify-between">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="pt-16 min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
