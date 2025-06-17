import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import '../styles/login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Simpan info user ke localStorage untuk penggunaan di MazeGame
      localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

    const handleGoogleLogin = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const username = user.displayName || user.email.split('@')[0] || 'Guest';

        localStorage.setItem(
          'currentUser',
          JSON.stringify({ email: user.email, username })
        );

        navigate('/');
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };


return (
  <div className="login-container">
    <div className="login-form-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <button type="submit" className="btn primary">Login</button>
        <button type="button" onClick={handleGoogleLogin} className="btn google">
          Login with Google 
        </button>
        <p>
          Belum punya akun?{' '}
          <span className="link" onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </form>
    </div>
  </div>
);
};

export default LoginPage;
