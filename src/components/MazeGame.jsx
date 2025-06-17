import React, { useEffect, useRef, useState } from 'react';
import '../style.css';
import { Maze } from '../utils/Maze'; 
import { DrawMaze, Player } from '../utils/DrawMaze'; 
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

let player, draw, maze, cellSize, sprite, finishSprite;

const MazeGame = () => {
  const canvasRef = useRef(null);
  const diffSelectRef = useRef(null);
  const messageContainerRef = useRef(null);
  const movesRef = useRef(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [moveCount, setMoveCount] = useState(0);
  const [difficulty, setDifficulty] = useState('Easy');

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
    const size = sizeByDifficulty[level];

    cellSize = canvas.width / size;
    maze = new Maze(size, size);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, canvas, cellSize, (moves) => displayVictoryMess(moves, level), sprite);

    document.getElementById('mazeContainer').style.opacity = '100';
  };

  const displayVictoryMess = async (moves, difficulty) => {
    if (movesRef.current) movesRef.current.innerHTML = `You Moved ${moves} Steps.`;
    toggleVisibility('Message-Container');
    setMoveCount(moves);

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
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser?.username) {
      setUsername(storedUser.username);
    } else {
      setUsername('Guest');
    }
  }, []);

  useEffect(() => {
    if (!username) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const rand = (max) => Math.floor(Math.random() * max);
    const shuffle = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

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
      virtCanvas.remove();
      return spriteOutput;
    };

    const isComplete = () => {
      if (sprite.complete && finishSprite.complete) {
        setTimeout(() => {
          makeMaze();
        }, 500);
      }
    };

    sprite = new Image();
    finishSprite = new Image();

    sprite.src = '/key.png';
    sprite.crossOrigin = ' ';
    sprite.onload = () => {
      sprite = changeBrightness(1.2, sprite);
      isComplete();
    };

    finishSprite.src = '/home.png';
    finishSprite.crossOrigin = ' ';
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
      <div className="user-banner">
        <p>Logged in as <strong>{username}</strong></p>
        <button onClick={() => navigate('/')} className="back-button">⬅ Back</button>
      </div>

      <div id="Message-Container" ref={messageContainerRef}>
        <div id="message">
          <h1>Congratulations!</h1>
          <p>You are done.</p>
          <p id="moves" ref={movesRef}></p>
          <input id="okBtn" type="button" value="Cool!" onClick={() => toggleVisibility('Message-Container')} />
        </div>
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

      <p id="instructions">Gunakan tombol panah untuk menggerakkan kunci ke rumah!</p>
    </div>
  );
};

export default MazeGame;
