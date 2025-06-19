import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
// import '../styles/scoreTable.css';

const ScoreTable = () => {
  const [scores, setScores] = useState([]);

  const fetchScores = async () => {
    try {
      const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data(),~
      }));
      setScores(data);
    } catch (err) {
      console.error('Gagal mengambil skor:', err);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div className="score-table-container">
      <h2>Data Skor Pemain</h2>
      <table className="score-table">
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
          {scores.length === 0 ? (
            <tr><td colSpan="5">Belum ada data skor</td></tr>
          ) : (
            scores.map(score => (
              <tr key={score.id}>
                <td>{score.rank}</td>
                <td>{score.username || '-'}</td>
                <td>{score.difficulty || '-'}</td>
                <td>{score.moves ?? '-'}</td>
                <td>{score.score}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
