import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cek user saat komponen dimount
    const storedUser = localStorage.getItem('currentUser');
    setUser(storedUser ? JSON.parse(storedUser) : null);

    // Listener untuk perubahan localStorage dari tab lain
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('currentUser');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-buttons">
        <button
          onClick={() => navigate('/play')}
          className="landing-btn play"
        >
          PLAY
        </button>

        <button
          onClick={() => navigate('/leaderboard')}
          className="landing-btn secondary"
        >
          RANK
        </button>

        {user ? (
          <Link to="/profile">
            <button className="nav-btn">PROFILE</button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="nav-btn">LOGIN</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
