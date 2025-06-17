import { DrawMaze, Player } from '../utils/DrawMaze';

export function Maze(Width, Height) {
  let mazeMap;
  const width = Width;
  const height = Height;
  let startCoord, endCoord;
  const dirs = ["n", "s", "e", "w"];
  const modDir = {
    n: { y: -1, x: 0, o: "s" },
    s: { y: 1, x: 0, o: "n" },
    e: { y: 0, x: 1, o: "w" },
    w: { y: 0, x: -1, o: "e" },
  };

  this.map = () => mazeMap;
  this.startCoord = () => startCoord;
  this.endCoord = () => endCoord;

function genMap() {
  mazeMap = new Array(width);
  for (let x = 0; x < width; x++) {
    mazeMap[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      mazeMap[x][y] = {
        n: false,
        s: false,
        e: false,
        w: false,
        visited: false,
        priorPos: null,
      };
    }
  }
}


function defineMaze() {
  let isComp = false;
  let move = false;
  let cellsVisited = 1;
  let numLoops = 0;
  let maxLoops = 0;
  let pos = { x: 0, y: 0 };
  const numCells = width * height;

  while (!isComp) {
    move = false;
    mazeMap[pos.x][pos.y].visited = true;

    if (numLoops >= maxLoops) {
      shuffle(dirs);
      maxLoops = Math.round(rand(height / 8));
      numLoops = 0;
    }
    numLoops++;

    for (let index = 0; index < dirs.length; index++) {
      const direction = dirs[index];
      const nx = pos.x + modDir[direction].x;
      const ny = pos.y + modDir[direction].y;

      if (
        nx >= 0 &&
        nx < width &&
        ny >= 0 &&
        ny < height &&
        !mazeMap[nx][ny].visited
      ) {
        mazeMap[pos.x][pos.y][direction] = true;
        mazeMap[nx][ny][modDir[direction].o] = true;
        mazeMap[nx][ny].priorPos = pos;
        pos = { x: nx, y: ny };
        cellsVisited++;
        move = true;
        break;
      }
    }

    if (!move) {
      pos = mazeMap[pos.x][pos.y].priorPos;
    }

    if (cellsVisited === numCells) {
      isComp = true;
    }
  }
}



  function defineStartEnd() {
    const startEndOptions = [
      [{ x: 0, y: 0 }, { x: height - 1, y: width - 1 }],
      [{ x: 0, y: width - 1 }, { x: height - 1, y: 0 }],
      [{ x: height - 1, y: 0 }, { x: 0, y: width - 1 }],
      [{ x: height - 1, y: width - 1 }, { x: 0, y: 0 }],
    ];
    const selected = startEndOptions[rand(4)];
    startCoord = selected[0];
    endCoord = selected[1];
  }

  genMap();
  defineStartEnd();
  defineMaze();
}

export function rand(max) {
  return Math.floor(Math.random() * max);
}

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
