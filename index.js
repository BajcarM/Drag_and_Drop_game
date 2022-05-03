const gameboard = document.querySelector(".gameboard");
const tiles = document.querySelectorAll(".tile");

let tilesArray = [];

let rowsCount = 4;
let colsCount = 6;
let boardSizeWidth = 900;
let boardSizeHeight = 600;

class Tile {
  constructor(row, col, id) {
    this.id = id;
    this.curRow = row;
    this.curCol = col;
  }

  placeTile() {
    document.querySelector(
      `[data-id="${this.id}"]`
    ).style.gridArea = `${this.curRow}/${this.curCol}/${this.curRow}/${this.curCol}`;
  }
}

function addTilesToDOM() {
  let displayedTiles = tilesArray.map((tile) => {
    tile = `
    <div class="tile" data-id="${tile.id}" draggable="true" style="
    grid-area: ${tile.curRow} / ${tile.curCol} / ${tile.curRow} / ${
      tile.curCol
    };
    height: ${boardSizeHeight / rowsCount}px; width: ${
      boardSizeWidth / colsCount
    }px; background-size: auto ${boardSizeWidth}px ;
    background-position: ${
      -(boardSizeWidth / colsCount) * (tile.curCol - 1)
    }px ${-(boardSizeHeight / rowsCount) * (tile.curRow - 1)}px;
    "></div>
    `;

    return tile;
  });

  gameboard.innerHTML = displayedTiles.join("");
}

function tileSwap(firstTile, secondTile) {
  let tempCoords = [firstTile.curRow, firstTile.curCol];

  firstTile.curRow = secondTile.curRow;
  firstTile.curCol = secondTile.curCol;
  secondTile.curRow = tempCoords[0];
  secondTile.curCol = tempCoords[1];

  firstTile.placeTile();
  secondTile.placeTile();
}

function addDraggingListeners() {
  let draggingTileIndex;
  let dragoverTileIndex;

  gameboard.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("draggable"))
      draggingTileIndex = e.target.dataset.id;
  });

  gameboard.addEventListener("dragover", (e) => {
    if (e.target.classList.contains("slider-tile")) {
      dragoverTileIndex = e.target.dataset.id;
    } else {
      dragoverTileIndex = draggingTileIndex;
    }
  });

  gameboard.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("draggable")) {
      tileSwap(tilesArray[dragoverTileIndex], tilesArray[draggingTileIndex]);

      setDragableTiles();
    }
  });
}

function findPossibleMoves() {
  const possibleMoves = [
    [-1, 0],
    [0, +1],
    [+1, 0],
    [0, -1],
  ];
  const sliderId = document.querySelector(".slider-tile").dataset.id;
  const sliderCoords = [
    tilesArray[sliderId].curRow,
    tilesArray[sliderId].curCol,
  ];

  let draggableTilesId = tilesArray.reduce((acc, tile) => {
    for (i = 0; i < possibleMoves.length; i++) {
      if (
        tile.curRow === sliderCoords[0] + possibleMoves[i][0] &&
        tile.curCol === sliderCoords[1] + possibleMoves[i][1]
      )
        acc.push(tile.id);
    }
    return acc;
  }, []);
  return draggableTilesId;
}

function setDragableTiles() {
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.classList.remove("draggable");
  });

  const possibleMoves = findPossibleMoves();
  possibleMoves.forEach((id) => {
    let tile = document.querySelector(`[data-id="${id}"]`);
    tile.classList.add("draggable");
  });
}

function randomShuffle() {
  for (k = 0; k < rowsCount * colsCount * rowsCount * colsCount; k++) {
    const possibleMoves = findPossibleMoves();
    const randomMoveIndex =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    console.log("i is " + k);
    console.log(possibleMoves);
    console.log(randomMoveIndex);
    tileSwap(tilesArray[randomMoveIndex], tilesArray[0]);
  }
}

// Running the code

let id = 0;
for (i = 0; i < rowsCount; i++) {
  for (j = 0; j < colsCount; j++) {
    tilesArray.push(new Tile(i + 1, j + 1, id));
    id++;
  }
}

addTilesToDOM();

document.querySelector(`[data-id="0"]`).classList.add("slider-tile");

addDraggingListeners();

randomShuffle(rowsCount, colsCount);

setDragableTiles();
