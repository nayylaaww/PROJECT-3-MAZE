import React, { useEffect, useState } from 'react';
import '../styles/leaderboard.css';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data());
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
        <Link to="/">
          <img src="/back-icon.svg" alt="Back" className="back-icon" />
        </Link>
      <div className="table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Difficulty</th>
              <th>Moves</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.username || 'Guest'}</td>
                <td>{entry.difficulty || '-'}</td>
                <td>{typeof entry.moves === 'number' ? entry.moves : '-'}</td>
                <td>{Number.isFinite(entry.score) ? entry.score : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
