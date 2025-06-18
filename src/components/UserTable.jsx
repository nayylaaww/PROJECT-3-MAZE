import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/userTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);

  // Ambil data user dari Firestore
  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(data);
    } catch (err) {
      console.error('Gagal mengambil user:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fungsi ban user
  const handleBan = async (id) => {
    await updateDoc(doc(db, 'users', id), { banned: true });
    fetchUsers(); // refresh
  };

  // Fungsi unban user
  const handleUnban = async (id) => {
    await updateDoc(doc(db, 'users', id), { banned: false });
    fetchUsers(); // refresh
  };

  return (
    <div className="user-table-container">
      <h2>Data Pengguna</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="4">Belum ada user</td></tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.username || '-'}</td>
                <td>{user.banned ? 'Banned' : 'Aktif'}</td>
                <td>
                  {user.banned ? (
                    <button className="unban-button" onClick={() => handleUnban(user.id)}>Unban</button>
                  ) : (
                    <button className="ban-button" onClick={() => handleBan(user.id)}>Ban</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
