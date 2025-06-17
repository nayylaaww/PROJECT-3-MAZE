import React, { useEffect, useState } from 'react';
import '../styles/RotateWarning.css';
import Lottie from 'lottie-react';
import rotateAnim from '../assets/Animation - 1750134620196.json'; 

const RotateWarning = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  const checkOrientation = () => {
    const portrait = window.matchMedia('(orientation: portrait)').matches;
    setIsPortrait(portrait);
  };

  useEffect(() => {
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return isPortrait ? (
    <div className="rotate-warning">
      <div className="rotate-content">
        <Lottie animationData={rotateAnim} style={{ width: 500, height: 500 }} />
      </div>
    </div>
  ) : null;
};

export default RotateWarning;
