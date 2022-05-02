const gameboard = document.querySelector(".gameboard");
const tiles = document.querySelectorAll(".tile");

let tilesArray = [];
let draggingTileIndex;
let dragoverTileIndex;
let rowsCount = 3;
let colsCount = 3;

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
    <div class="tile" data-id="${tile.id}" draggable="false"></div>
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

gameboard.addEventListener("dragstart", (e) => {
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
  tileSwap(tilesArray[dragoverTileIndex], tilesArray[draggingTileIndex]);
});

function setDragableTiles() {
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

  document.querySelectorAll(".tile").forEach((tile) => {
    tile.setAttribute("draggable", "false");
  });

  draggableTilesId.forEach((id) => {
    document
      .querySelector(`[data-id="${id}"]`)
      .setAttribute("draggable", "true");
  });
}

tilesArray.push(new Tile(1, 1, 0));
tilesArray.push(new Tile(1, 2, 1));

addTilesToDOM();

document.querySelector(`[data-id="0"]`).classList.add("slider-tile");

setDragableTiles();
