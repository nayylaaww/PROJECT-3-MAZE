import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import '../styles/profile.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('currentUser'));
    if (!stored) return navigate('/login');
    setUserData(stored);

    const fetchScores = async () => {
      try {
        const q = query(
          collection(db, 'leaderboard'),
          where('username', '==', stored.username),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const scores = snapshot.docs.map(doc => doc.data());
        setScoreHistory(scores);
      } catch (err) {
        console.error('Failed to fetch score:', err);
      }
    };

    fetchScores();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (!userData) return null;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={userData.photoURL || '/deafult-profile.png'}
          alt="Profile"
          className="profile-image"
        />
        <h2>{userData.username}</h2>
        <p>{userData.email}</p>

        <h3>Score History</h3>
        {scoreHistory.length === 0 ? (
          <p>Belum ada skor yang tercatat.</p>
        ) : (
          <div className="score-table-container">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Difficulty</th>
                  <th>Moves</th>
                  <th>Score</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {scoreHistory.map((item, index) => (
                  <tr key={index}>
                    <td>{item.difficulty || '-'}</td>
                    <td>{item.moves || '-'}</td>
                    <td>{item.score || '-'}</td>
                    <td>{item.createdAt?.toDate().toLocaleString() || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
