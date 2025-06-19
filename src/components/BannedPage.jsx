import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/banned.css';

const BannedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="banned-container">
      <h1>Akun Anda Diblokir</h1>
      <p>Maaf, akun ini telah diblokir oleh admin karena melanggar ketentuan.</p>
      <button onClick={() => navigate('/')} className="btn">Kembali ke Beranda</button>
    </div>
  );
};

export default BannedPage;
