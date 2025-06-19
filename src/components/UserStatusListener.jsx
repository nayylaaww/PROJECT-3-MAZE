// src/components/UserStatusListener.jsx
import { useEffect } from 'react';
import { onSnapshot, query, collection, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const UserStatusListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!storedUser || !storedUser.email) return;

    const q = query(collection(db, 'users'), where('email', '==', storedUser.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        if (!userData.isActive) {
          alert('Akun kamu telah diblokir oleh admin.');
          signOut(auth);
          localStorage.removeItem('currentUser');
          navigate('/banned');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return null; // Komponen ini tidak menampilkan UI
};

export default UserStatusListener;
