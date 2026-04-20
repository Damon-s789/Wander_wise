import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Compass className="text-blue-600 mr-2" size={28} />
            <span className="font-bold text-xl text-slate-900 tracking-tight">WanderWise</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-6">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <User size={18} />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {currentUser?.email?.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout}
                className="ml-4 text-slate-400 hover:text-red-500 transition-colors p-2"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
