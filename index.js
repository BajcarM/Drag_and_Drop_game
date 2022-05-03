const gameboard = document.querySelector(".gameboard");
// const tiles = document.querySelectorAll(".tile");

let tilesArray = [];

let rowsCount = 6;
let colsCount = (rowsCount * 4) / 3;
let boardSizeHeight = 600;
let boardSizeWidth = (boardSizeHeight * 4) / 3;

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

function generateTiles() {
  tilesArray = [];
  let id = 0;
  for (i = 0; i < rowsCount; i++) {
    for (j = 0; j < colsCount; j++) {
      tilesArray.push(new Tile(i + 1, j + 1, id));
      id++;
    }
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

  document.querySelector(`[data-id="0"]`).classList.add("slider-tile");

  document.querySelector(".btn-shuffle").addEventListener("click", (e) => {
    randomShuffle();
  });
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

function addTouchListener() {
  gameboard.addEventListener("touchend", (e) => {
    if (e.target.classList.contains("draggable")) {
      tileSwap(tilesArray[0], tilesArray[e.target.dataset.id]);

      setDragableTiles();
    }
  });
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
  const tilesCountSqr = rowsCount * colsCount * rowsCount * colsCount;
  for (let k = 0; k < tilesCountSqr; k++) {
    setTimeout(() => {
      const possibleMoves = findPossibleMoves();
      const randomMoveIndex =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      tileSwap(tilesArray[randomMoveIndex], tilesArray[0]);
      setDragableTiles();
    }, k * (3000 / tilesCountSqr));
  }
}

function slider() {
  const slider = document.querySelector(".slider-size");
  const sliderValue = document.querySelector(".value");
  const valueContainer = document.querySelector(".value-container");

  sliderValue.textContent = `${rowsCount}×${colsCount}`;

  const valueContainerWidth = valueContainer.getBoundingClientRect().width;
  const sliderValueWidth = sliderValue.getBoundingClientRect().width;
  const valueOffsetX = (valueContainerWidth - sliderValueWidth) / 2;
  sliderValue.style.left = `${valueOffsetX}px`;

  slider.addEventListener("input", (e) => {
    rowsCount = e.target.value * 3;
    colsCount = (rowsCount * 4) / 3;

    sliderValue.textContent = `${rowsCount}×${colsCount}`;
    sliderValue.style.left = `${
      (e.target.value - 1) * (valueContainerWidth / 2) - sliderValueWidth / 2
    }px`;

    generateGameboard();
  });
}

function viewPortCheck() {
  const maxWidth500 = window.matchMedia("(max-width: 500px)");
  const minWidth500 = window.matchMedia("(min-width: 500px)");
  const maxHeight500 = window.matchMedia("(max-height: 500px)");

  function changeSize() {
    if (maxWidth500.matches) {
      boardSizeHeight = 270;
      boardSizeWidth = (boardSizeHeight * 4) / 3;
      return;
    }
    if (minWidth500.matches && maxHeight500.matches) {
      boardSizeHeight = 270;
      boardSizeWidth = (boardSizeHeight * 4) / 3;
      return;
    }
    boardSizeHeight = 600;
    boardSizeWidth = (boardSizeHeight * 4) / 3;
  }
  changeSize();
}

// Run the functions

viewPortCheck();

function generateGameboard() {
  generateTiles();
  addTilesToDOM();
  setDragableTiles();
}

generateGameboard();

addDraggingListeners();
addTouchListener();

slider();
