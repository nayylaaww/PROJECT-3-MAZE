import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
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

      // Ambil data dari Firestore
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

      if (!userData.isActive) {
        localStorage.removeItem('currentUser');
        navigate('/banned'); 
        return;
      }

        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            email: user.email,
            username: userData.username
          })
        );

        navigate('/');
      } else {
        setError('User tidak ditemukan di database.');
      }
    } catch (err) {
      console.error(err);
      setError('Email atau password salah.');
    }
  };


const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const username = user.displayName || user.email.split('@')[0] || 'Guest';

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (!userData.isActive) {
        setError('Akun ini telah diblokir.');
        return;
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify({ email: user.email, username: userData.username })
      );
    } else {
      // Buat akun baru jika belum ada
      await setDoc(userRef, {
        email: user.email,
        username,
        isActive: true,
        createdAt: serverTimestamp()
      });

      localStorage.setItem(
        'currentUser',
        JSON.stringify({ email: user.email, username })
      );
    }

    navigate('/');
  } catch (err) {
    console.error(err);
    setError('Login gagal. Silakan coba lagi.');
  }
};


  return (
    <div className="login-container">
      <Link to="/">
        <img src="/back-icon.svg" alt="Back" className="back-icon" />
      </Link>
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

          <div className="login-button-row">
            <button type="submit" className="btn primary">LOGIN</button>
            <button type="button" onClick={() => navigate('/register')} className="btn primary">SIGN-IN</button>
          </div>

          <div className="google-row">
            <button type="button" onClick={handleGoogleLogin} className="btn google">
              LOGIN WITH GOOGLE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
