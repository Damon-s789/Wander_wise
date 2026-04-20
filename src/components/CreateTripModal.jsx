import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTrips } from '../context/TripContext';

export default function CreateTripModal({ isOpen, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { addTrip } = useTrips();

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  async function onSubmit(data) {
    try {
      await addTrip({
        ...data,
        budget: parseFloat(data.budget) || 0,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add trip", error);
      alert("Failed to create trip");
    }
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
        >
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Create New Trip</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trip Name</label>
              <input
                {...register('title', { required: 'Trip name is required' })}
                placeholder="e.g., Summer in Europe"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors shadow-sm"
              />
              {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <input
                {...register('destination', { required: 'Destination is required' })}
                placeholder="e.g., Paris, France"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors shadow-sm"
              />
              {errors.destination && <span className="text-red-500 text-xs mt-1">{errors.destination.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  {...register('startDate', { required: true })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  {...register('endDate', { required: true })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('budget', { required: true })}
                placeholder="1000.00"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
            </div>

            <div className="pt-4 ml-auto flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Create Trip
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
