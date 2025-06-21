import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import '../styles/Leaderboard.css';
import { Link } from 'react-router-dom';

const LeaderboardPage = () => {
  const [scores, setScores] = useState([]);
  const [selectedMode, setSelectedMode] = useState('Easy');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const q = query(
          collection(db, 'leaderboard'),
          where('difficulty', '==', selectedMode),
          orderBy('score', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedScores = snapshot.docs.map(doc => doc.data());
        setScores(fetchedScores);
      } catch (err) {
        console.error('Error fetching scores:', err);
      }
    };

    fetchScores();
  }, [selectedMode]);

  return (
    <div className="leaderboard-container">
      {/* <Link to="/" className="back-btn">
        <img src="/back-icon..png" alt="Back" />
      </Link> */}

      <h1 className="leaderboard-title"> {selectedMode} Mode</h1>

      <div className="mode-selector">
        <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Extreme">Extreme</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
              <th>Moves</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr><td colSpan="5">Belum ada skor.</td></tr>
            ) : (
              scores.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.username || '-'}</td>
                  <td>{item.score || '-'}</td>
                  <td>{item.moves || '-'}</td>
                  <td>{item.createdAt?.toDate().toLocaleString() || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
