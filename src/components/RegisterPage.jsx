import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/login.css'; // Sudah benar

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('currentUser', JSON.stringify({ username, email: user.email }));
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
<div className="login-container">
  <div className="login-form-wrapper register-form-wrapper">
    <form className="login-form" onSubmit={handleRegister}>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn primary">SIGN-IN</button>
          <p>
            Sudah punya akun?{' '}
            <span className="link" onClick={() => navigate('/login')}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
