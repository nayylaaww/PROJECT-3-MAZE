import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/scoreTable.css';

const ScoreTable = () => {
  const [scores, setScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    score: ''
  });
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

  const handleEdit = (score) => {
    setEditingId(score.id);
    setEditForm({
      username: score.username || '',
      score: score.score || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      username: '',
      score: ''
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      // Validasi input
      if (!editForm.username.trim()) {
        alert('Username tidak boleh kosong!');
        return;
      }
      
      if (!editForm.score || editForm.score < 0) {
        alert('Score harus berupa angka positif!');
        return;
      }

      // Update ke Firestore
      await updateDoc(doc(db, 'leaderboard', id), {
        username: editForm.username.trim(),
        score: parseInt(editForm.score)
      });

      // Reset form dan refresh data
      setEditingId(null);
      setEditForm({ username: '', score: '' });
      fetchScores();
      
      alert('Data berhasil diupdate!');
    } catch (err) {
      console.error('Gagal mengupdate data:', err);
      alert('Gagal mengupdate data!');
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const filteredScores = scores.filter(score =>
    score.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    score.difficulty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    score.score?.toString().includes(searchTerm) ||
    score.moves?.toString().includes(searchTerm)
  );

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
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredScores.length === 0 ? (
            <tr><td colSpan="6">Tidak ada hasil pencarian</td></tr>
          ) : filteredScores.map(score => (
            <tr key={score.id}>
              <td>{score.rank}</td>
              <td>
                {editingId === score.id ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="edit-input"
                    placeholder="Username"
                  />
                ) : (
                  score.username || '-'
                )}
              </td>
              <td>{score.difficulty || '-'}</td>
              <td>{score.moves ?? '-'}</td>
              <td>
                {editingId === score.id ? (
                  <input
                    type="number"
                    value={editForm.score}
                    onChange={(e) => handleInputChange('score', e.target.value)}
                    className="edit-input"
                    placeholder="Score"
                    min="0"
                  />
                ) : (
                  score.score
                )}
              </td>
              <td>
                {editingId === score.id ? (
                  <div className="edit-actions">
                    <button
                      className="save-btn"
                      onClick={() => handleSaveEdit(score.id)}
                    >
                      Simpan
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(score)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-score-btn"
                      onClick={() => handleDelete(score.id)}
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;