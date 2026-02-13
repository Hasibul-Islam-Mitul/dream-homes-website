
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

// Explicitly define props to include children for better type compatibility in strict environments.
interface ProtectedRouteProps {
  // Fix: Make children optional to resolve TS error in App.tsx usage
  children?: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Safety check: if auth is not initialized (e.g., missing API key), don't try to subscribe.
    if (!auth) {
      console.warn("Auth not available in ProtectedRoute.");
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-royalGreen text-4xl"></i></div>;
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
