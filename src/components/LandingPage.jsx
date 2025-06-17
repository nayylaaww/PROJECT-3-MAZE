import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import { Link } from 'react-router-dom';


const user = JSON.parse(localStorage.getItem('currentUser'));

const LandingPage = () => {
  const navigate = useNavigate();

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
