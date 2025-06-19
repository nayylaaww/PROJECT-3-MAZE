import React, { useState } from 'react';
import UserTable from './UserTable.jsx';
import ScoreTable from './ScoreTable';
import '../styles/admin.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab('users')}>Kelola User</button>
        <button onClick={() => setActiveTab('scores')}>Lihat Skor</button>
      </div>

      <div className="admin-content">
        {activeTab === 'users' ? <UserTable /> : <ScoreTable />}
      </div>
    </div>
  );
};

export default AdminPanel;
