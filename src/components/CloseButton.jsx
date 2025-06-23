import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/closeButton.css'

const CloseButton = () => {
  const location = useLocation();
  const navigate = useNavigate();


  if (location.pathname === '/') return null;

  return (
    <img
      src="/back-icon.png" 
      alt="Close"
      onClick={() => navigate('/')}
      className="close-button"
    />
  );
};

export default CloseButton;
