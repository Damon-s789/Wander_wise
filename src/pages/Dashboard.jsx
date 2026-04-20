import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CreateTripModal from '../components/CreateTripModal';
import { useTrips } from '../context/TripContext';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { trips, loading, deleteTrip } = useTrips();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Trips</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your upcoming and past adventures</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
          >
            <Plus size={20} className="mr-1" />
            New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-900 mb-2">No trips planned yet</p>
            <p className="mb-6">Click "New Trip" to start planning your next journey.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 font-medium hover:underline"
            >
              Start Planning →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group relative"
              >
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white truncate drop-shadow-sm">{trip.title}</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-slate-600 mb-3 text-sm">
                    <MapPin size={16} className="mr-2 text-slate-400" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center text-slate-600 mb-6 text-sm">
                    <Calendar size={16} className="mr-2 text-slate-400" />
                    {trip.startDate ? format(parseISO(trip.startDate), 'MMM d, yyyy') : 'No Date'} - 
                    {trip.endDate ? format(parseISO(trip.endDate), ' MMM d, yyyy') : 'No Date'}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <Link 
                      to={`/trip/${trip.id}`}
                      className="text-blue-600 font-medium hover:text-blue-800 text-sm"
                    >
                      View Details &rarr;
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm('Are you sure you want to delete this trip?')) {
                          deleteTrip(trip.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      title="Delete Trip"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
