import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/scoreTable.css'; 

const ScoreTable = () => {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  const fetchScores = async () => {
    try {
      const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data(),
      }));
      setScores(data);
    } catch (err) {
      console.error('Gagal mengambil skor:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Yakin ingin menghapus skor ini?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'leaderboard', id));
      fetchScores(); // refresh data
    } catch (err) {
      console.error('Gagal menghapus skor:', err);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const filteredScores = scores.filter(score =>
  score.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  score.difficulty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  score.score?.toString().includes(searchTerm) ||
  score.moves?.toString().includes(searchTerm)
);

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div className="admin-score-table-container">
      <button onClick={() => navigate('/adminpanel')} className="back-button">Back</button>   
       <div className="user-header">
      <h2>Data Skor Pemain</h2>
       <input
        type="text"
        placeholder="Cari skor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      </div>



      <table className="admin-score-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Difficulty</th>
            <th>Moves</th>
            <th>Score</th>
            <th>Aksi</th> {/* Tambahan kolom aksi */}
          </tr>
        </thead>
        <tbody>
            {filteredScores.length === 0 ? (
              <tr><td colSpan="6">Tidak ada hasil pencarian</td></tr>
            ) : filteredScores.map(score => (
            <tr key={score.id}>
              <td>{score.rank}</td>
              <td>{score.username || '-'}</td>
              <td>{score.difficulty || '-'}</td>
              <td>{score.moves ?? '-'}</td>
              <td>{score.score}</td>
              <td><button className="delete-score-btn" onClick={() => handleDelete(score.id)}>Hapus</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
