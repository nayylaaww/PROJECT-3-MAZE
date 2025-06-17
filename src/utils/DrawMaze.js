export function DrawMaze(Maze, ctx, cellSize, endSprite = null) {
    
  const map = Maze.map();
  let drawEndMethod;
  ctx.lineWidth = cellSize / 40;

  this.redrawMaze = (size) => {
    cellSize = size;
    ctx.lineWidth = cellSize / 50;
    drawMap();
    drawEndMethod();
  };

  function drawCell(x, y, cell) {
    const posX = x * cellSize;
    const posY = y * cellSize;
    if (!cell.n) { ctx.beginPath(); ctx.moveTo(posX, posY); ctx.lineTo(posX + cellSize, posY); ctx.stroke(); }
    if (!cell.s) { ctx.beginPath(); ctx.moveTo(posX, posY + cellSize); ctx.lineTo(posX + cellSize, posY + cellSize); ctx.stroke(); }
    if (!cell.e) { ctx.beginPath(); ctx.moveTo(posX + cellSize, posY); ctx.lineTo(posX + cellSize, posY + cellSize); ctx.stroke(); }
    if (!cell.w) { ctx.beginPath(); ctx.moveTo(posX, posY); ctx.lineTo(posX, posY + cellSize); ctx.stroke(); }
  }

  function drawMap() {
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
  }

  function drawEndFlag() {
    const coord = Maze.endCoord();
    const gridSize = 4;
    const fraction = cellSize / gridSize - 2;
    let colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 === 0) colorSwap = !colorSwap;
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.rect(coord.x * cellSize + x * fraction + 4.5, coord.y * cellSize + y * fraction + 4.5, fraction, fraction);
        ctx.fillStyle = colorSwap ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }

  function drawEndSprite() {
    const offset = cellSize / 50;
    const size = cellSize - cellSize / 25;
    const coord = Maze.endCoord();
    ctx.drawImage(endSprite, 2, 2, endSprite.width, endSprite.height,
      coord.x * cellSize + offset, coord.y * cellSize + offset, size, size);
  }

  function clear() {
    const canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  }

  drawEndMethod = endSprite ? drawEndSprite : drawEndFlag;
  clear();
  drawMap();
  drawEndMethod();
}

export function Player(maze, canvas, cellSize, onComplete, sprite = null) {
  const ctx = canvas.getContext('2d');
  const map = maze.map();
  const half = cellSize / 2;
  let coord = maze.startCoord();
  let moves = 0;
  const draw = sprite ? drawImg : drawCircle;

  this.redrawPlayer = (newSize) => {
    cellSize = newSize;
    draw(coord);
  };

  function drawCircle(pos) {
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc((pos.x + 1) * cellSize - half, (pos.y + 1) * cellSize - half, half - 2, 0, 2 * Math.PI);
    ctx.fill();
    checkComplete(pos);
  }

  function drawImg(pos) {
    const offset = cellSize / 50;
    const size = cellSize - cellSize / 25;
    ctx.drawImage(sprite, 0, 0, sprite.width, sprite.height,
      pos.x * cellSize + offset, pos.y * cellSize + offset, size, size);
    checkComplete(pos);
  }

  function remove(pos) {
    const offset = cellSize / 50;
    const size = cellSize - cellSize / 25;
    ctx.clearRect(pos.x * cellSize + offset, pos.y * cellSize + offset, size, size);
  }

  function checkComplete(pos) {
    if (pos.x === maze.endCoord().x && pos.y === maze.endCoord().y) {
      onComplete(moves);
      window.removeEventListener('keydown', handleKey);
    }
  }

  function handleKey(e) {
    const cell = map[coord.x][coord.y];
    let moved = false;
    moves++;
    switch (e.keyCode) {
      case 37: case 65: if (cell.w) moved = { x: coord.x - 1, y: coord.y }; break;
      case 38: case 87: if (cell.n) moved = { x: coord.x, y: coord.y - 1 }; break;
      case 39: case 68: if (cell.e) moved = { x: coord.x + 1, y: coord.y }; break;
      case 40: case 83: if (cell.s) moved = { x: coord.x, y: coord.y + 1 }; break;
      default: return;
    }
    if (moved) {
      remove(coord);
      coord = moved;
      draw(coord);
    }
  }

  this.bindKeyDown = () => {
    window.addEventListener('keydown', handleKey);
  };

  this.unbindKeyDown = () => {
    window.removeEventListener('keydown', handleKey);
  };

  draw(coord);
  this.bindKeyDown();
}
