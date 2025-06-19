import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/userTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);

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

  const handleBan = async (id) => {
    try {
      await updateDoc(doc(db, 'users', id), { isActive: false });
      fetchUsers();
    } catch (err) {
      console.error('Gagal mem-ban user:', err);
    }
  };

  const handleUnban = async (id) => {
    try {
      await updateDoc(doc(db, 'users', id), { isActive: true });
      fetchUsers();
    } catch (err) {
      console.error('Gagal unban user:', err);
    }
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
                <td>{user.isActive === false ? 'Banned' : 'Aktif'}</td>
                <td>
                  {user.isActive === false ? (
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
