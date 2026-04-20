import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // A mock mode just in case Firebase keys are not provided yet
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.warn("Auth context running in MOCK mode due to missing Firebase config.");
      setIsMockMode(true);
      
      // Check local storage for mock user
      const storedTheme = localStorage.getItem('mockUser');
      if (storedTheme) {
        setCurrentUser(JSON.parse(storedTheme));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  function signup(email, password, name) {
    if (isMockMode) {
      const mockUser = { uid: 'mock123', email, displayName: name };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return Promise.resolve();
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    if (isMockMode) {
      const mockUser = { uid: 'mock123', email, displayName: "Demo User" };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return Promise.resolve();
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (isMockMode) {
      localStorage.removeItem('mockUser');
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isMockMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
