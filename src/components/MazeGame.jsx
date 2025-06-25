// MazeGame.jsx (FINAL VERSION with D-Pad movement fix)

import React, { useEffect, useRef, useState } from 'react';
import '../styles/mazeGame.css';
import { Maze } from '../utils/Maze'; 
import { DrawMaze, Player } from '../utils/DrawMaze'; 
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Howl } from 'howler';

let player, draw, maze, cellSize, sprite, finishSprite;

const MazeGame = () => {
  const toggleSound = () => {
    if (soundRef.current) {
      if (soundOn) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
      setSoundOn(!soundOn);
    }
  };

  const [soundOn, setSoundOn] = useState(true);
  const soundRef = useRef(null);
  const canvasRef = useRef(null);
  const diffSelectRef = useRef(null);
  const messageContainerRef = useRef(null);
  const movesRef = useRef(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [moveCount, setMoveCount] = useState(0);
  const [difficulty, setDifficulty] = useState('Easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isNarrowScreen = window.innerWidth <= 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsMobile(isNarrowScreen || isPortrait);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const movePlayer = (direction) => {
    if (!player || !gameStarted) return;

    const keyMap = {
      up: 38,
      down: 40,
      left: 37,
      right: 39,
    };

    const keyCode = keyMap[direction];
    if (!keyCode) return;

    const fakeEvent = { keyCode };
    player.handleKey(fakeEvent);
  };

  const toggleVisibility = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.visibility = el.style.visibility === 'visible' ? 'hidden' : 'visible';
    }
  };

  const makeMaze = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (player) {
      player.unbindKeyDown();
      player = null;
    }

    const sizeByDifficulty = {
      Easy: 10,
      Medium: 15,
      Hard: 25,
      Extreme: 38
    };

    const e = diffSelectRef.current;
    const level = e.options[e.selectedIndex].value;
    setDifficulty(level);
    setGameStarted(true);

    const size = sizeByDifficulty[level];
    cellSize = canvas.width / size;
    maze = new Maze(size, size);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, canvas, cellSize, (moves) => displayVictoryMess(moves, level), sprite);

    document.getElementById('mazeContainer').style.opacity = '1';
  };

  const displayVictoryMess = async (moves, difficulty) => {
    if (movesRef.current) movesRef.current.innerHTML = `Kamu Berpindah ${moves} Langkah.`;
    toggleVisibility('Message-Container');
    setMoveCount(moves);
    setGameStarted(false);

    try {
      await addDoc(collection(db, 'leaderboard'), {
        username,
        moves,
        score: calculateScore(moves, difficulty),
        difficulty,
        createdAt: new Date()
      });
      console.log('Score saved to Firestore');
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  };

  useEffect(() => {
    const sound = new Howl({
      src: ['/sound/magical.mp3'],
      loop: true,
      volume: 0.4,
    });
    sound.play();
    soundRef.current = sound;
    return () => sound.stop();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    setUsername(storedUser?.username || 'Guest');
  }, []);

  useEffect(() => {
    if (!username) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const changeBrightness = (factor, sprite) => {
      const virtCanvas = document.createElement('canvas');
      virtCanvas.width = 500;
      virtCanvas.height = 500;
      const context = virtCanvas.getContext('2d');
      context.drawImage(sprite, 0, 0, 500, 500);
      const imgData = context.getImageData(0, 0, 500, 500);
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] *= factor;
        imgData.data[i + 1] *= factor;
        imgData.data[i + 2] *= factor;
      }
      context.putImageData(imgData, 0, 0);
      const spriteOutput = new Image();
      spriteOutput.src = virtCanvas.toDataURL();
      return spriteOutput;
    };

    const isComplete = () => {
      if (sprite.complete && finishSprite.complete) {
        setTimeout(() => makeMaze(), 500);
      }
    };

    sprite = new Image();
    finishSprite = new Image();
    sprite.src = '/key.png';
    sprite.onload = () => {
      sprite = changeBrightness(1.2, sprite);
      isComplete();
    };

    finishSprite.src = '/home.png';
    finishSprite.onload = () => {
      finishSprite = changeBrightness(1.1, finishSprite);
      isComplete();
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      const viewEl = document.getElementById('view');
      if (!canvas || !viewEl) return;

      const ctx = canvas.getContext('2d');
      const viewWidth = viewEl.offsetWidth;
      const viewHeight = viewEl.offsetHeight;
      const size = Math.min(viewWidth, viewHeight) * 0.99;

      ctx.canvas.width = size;
      ctx.canvas.height = size;

      if (maze && maze.map()) {
        cellSize = canvas.width / maze.map().length;
      }
      if (player && draw) {
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [username]);

  const calculateScore = (moves, difficulty) => {
    const baseScore = {
      Easy: 100,
      Medium: 300,
      Hard: 500,
      Extreme: 800
    };
    return baseScore[difficulty] - moves;
  };

  return (
    <div id="page">
      <div id="Message-Container" ref={messageContainerRef}>
        <div id="message">
          <h1>Congratulations!</h1>
          <p>You are done.</p>
          <p id="moves" ref={movesRef}></p>
          <input 
            id="okBtn" 
            type="button" 
            value="Next" 
            onClick={() => {
              toggleVisibility('Message-Container');
              setGameStarted(false);
            }} 
          />
        </div>
      </div>

      <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
        <button onClick={toggleSound} style={{
          backgroundColor: '#d7fdff',
          border: 'none',
          borderRadius: '10px',
          padding: '0.5rem 1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          {soundOn ? '🔊 Sound ON' : '🔇 Sound OFF'}
        </button>
      </div>

      <div id="menu">
        <div className="custom-select">
          <select id="diffSelect" ref={diffSelectRef}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Extreme">Extreme</option>
          </select>
        </div>
        <input id="startMazeBtn" type="button" value="Start" onClick={() => makeMaze()} />
      </div>

      <div id="view">
        <div id="mazeContainer">
          <canvas
            id="mazeCanvas"
            className="border"
            height="1100"
            width="1100"
            ref={canvasRef}
          ></canvas>
        </div>
      </div>

      {isMobile && gameStarted && (
        <div className="mobile-controls">
          <div className="dpad-container">
            <button className="dpad-btn dpad-up" onClick={() => movePlayer('up')}>⬆️</button>
            <div className="dpad-horizontal">
              <button className="dpad-btn dpad-left" onClick={() => movePlayer('left')}>⬅️</button>
              <div className="dpad-center"></div>
              <button className="dpad-btn dpad-right" onClick={() => movePlayer('right')}>➡️</button>
            </div>
            <button className="dpad-btn dpad-down" onClick={() => movePlayer('down')}>⬇️</button>
          </div>
        </div>
      )}

      <p id="instructions">
        {isMobile ?
          "Gunakan tombol panah di atas untuk menggerakkan energy ball ke portal!" :
          "Gunakan tombol panah untuk menggerakkan energy ball ke portal!"
        }
      </p>
    </div>
  );
};

export default MazeGame;
