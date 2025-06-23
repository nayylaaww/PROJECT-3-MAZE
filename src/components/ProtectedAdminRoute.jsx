import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const adminEmail = 'narazahra86@gmail.com';

  // Jika tidak login atau email bukan admin, arahkan ke halaman akses ditolak
  if (!user || user.email !== adminEmail) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
