import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const TripContext = createContext();

export function useTrips() {
  return useContext(TripContext);
}

export function TripProvider({ children }) {
  const { currentUser, isMockMode } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setTrips([]);
      setLoading(false);
      return;
    }

    if (isMockMode) {
      // Mock data load
      const mockTrips = localStorage.getItem('mockTrips');
      if (mockTrips) {
        setTrips(JSON.parse(mockTrips));
      } else {
        const defaultTrips = [
          { id: '1', title: 'Paris Getaway', destination: 'Paris, France', startDate: '2026-05-10', endDate: '2026-05-15', budget: 1500, expenses: [{ id: 'e1', title: 'Flight', amount: 400 }] },
          { id: '2', title: 'Weekend in Kyoto', destination: 'Kyoto, Japan', startDate: '2026-06-20', endDate: '2026-06-25', budget: 2200, expenses: [] }
        ];
        localStorage.setItem('mockTrips', JSON.stringify(defaultTrips));
        setTrips(defaultTrips);
      }
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'trips'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrips(tripsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, isMockMode]);

  async function addTrip(tripData) {
    if (isMockMode) {
      const newTrip = { id: Date.now().toString(), expenses: [], ...tripData, userId: currentUser.uid };
      const updatedTrips = [...trips, newTrip];
      setTrips(updatedTrips);
      localStorage.setItem('mockTrips', JSON.stringify(updatedTrips));
      return newTrip;
    }
    
    const docRef = await addDoc(collection(db, 'trips'), {
      ...tripData,
      userId: currentUser.uid,
      expenses: [],
      createdAt: new Date()
    });
    return docRef.id;
  }

  async function updateTrip(tripId, updatedData) {
    if (isMockMode) {
      const updatedTrips = trips.map(t => t.id === tripId ? { ...t, ...updatedData } : t);
      setTrips(updatedTrips);
      localStorage.setItem('mockTrips', JSON.stringify(updatedTrips));
      return;
    }
    
    const tripRef = doc(db, 'trips', tripId);
    await updateDoc(tripRef, updatedData);
  }

  async function deleteTrip(tripId) {
    if (isMockMode) {
      const updatedTrips = trips.filter(t => t.id !== tripId);
      setTrips(updatedTrips);
      localStorage.setItem('mockTrips', JSON.stringify(updatedTrips));
      return;
    }
    
    await deleteDoc(doc(db, 'trips', tripId));
  }

  const value = {
    trips,
    loading,
    addTrip,
    updateTrip,
    deleteTrip
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}
