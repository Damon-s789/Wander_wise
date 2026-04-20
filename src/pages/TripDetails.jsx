import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import Navbar from '../components/Navbar';
import ExpenseTracker from '../components/ExpenseTracker';
import { MapPin, Calendar, ArrowLeft, Wallet } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, updateTrip } = useTrips();

  const trip = useTrips().trips.find(t => t.id === id);

  // useMemo to automatically recalculate total expenses whenever the expenses array changes
  const totalExpenses = useMemo(() => {
    if (!trip?.expenses) return 0;
    return trip.expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  }, [trip?.expenses]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const budgetRemaining = trip.budget - totalExpenses;
  const progressPercentage = Math.min((totalExpenses / trip.budget) * 100, 100) || 0;

  async function handleAddExpense(expense) {
    const newExpenses = [...(trip.expenses || []), expense];
    await updateTrip(trip.id, { expenses: newExpenses });
  }

  async function handleDeleteExpense(expenseId) {
    const newExpenses = (trip.expenses || []).filter(e => e.id !== expenseId);
    await updateTrip(trip.id, { expenses: newExpenses });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{trip.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-slate-600">
            <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium">
              <MapPin size={16} className="mr-2 text-blue-500" />
              {trip.destination}
            </div>
            <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium">
              <Calendar size={16} className="mr-2 text-blue-500" />
              {trip.startDate ? format(parseISO(trip.startDate), 'MMM d, yyyy') : ''} - 
              {trip.endDate ? format(parseISO(trip.endDate), ' MMM d, yyyy') : ''}
            </div>
            <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium">
              <Wallet size={16} className="mr-2 text-blue-500" />
              Budget: ${trip.budget}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Itinerary Planning</h2>
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <p className="text-slate-500 font-medium">Itinerary feature coming soon...</p>
                <p className="text-sm text-slate-400 mt-2">Manage your day-to-day schedule here.</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Expense Tracker */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Budget Overview</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 font-medium">Total Budget</span>
                    <span className="font-bold text-slate-900">${parseFloat(trip.budget).toFixed(2)}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 font-medium">Spent</span>
                    <span className="font-bold text-red-500">${totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${progressPercentage > 90 ? 'bg-red-500' : progressPercentage > 75 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Remaining</span>
                    <span className={`font-bold ${budgetRemaining < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      ${budgetRemaining.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <ExpenseTracker 
                expenses={trip.expenses || []} 
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
