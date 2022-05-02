const gameboard = document.querySelector(".gameboard");
const tiles = document.querySelectorAll(".tile");

let tilesArray = [];

class Tile {
  constructor(row, col, id) {
    this.id = id;
    this.startRow = row;
    this.startCol = col;
    this.curRow = row;
    this.curCol = col;
  }

  placeTile() {
    // const thisTile = document.querySelector(`[data-id="${this.id}"]`);
    // thisTile.style.gridRow = this.curRow;
    // thisTile.style.gridColumn = this.curCol;

    document.querySelector(
      `[data-id="${this.id}"]`
    ).style.gridArea = `${this.curRow}/${this.curCol}/${this.curRow}/${this.curCol}`;
  }
}

function addTilesToDOM() {
  let displayedTiles = tilesArray.map((tile) => {
    tile = `
    <div class="tile" data-id="${tile.id}" data-startrow="${tile.startRow}" data-startcol="${tile.startCol}" draggable="true"></div>
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

// gameboard.addEventListener()



tilesArray.push(new Tile(1, 1, 1));
tilesArray.push(new Tile(1, 2, 2));

addTilesToDOM();

// tileSwap(tilesArray[1],tilesArray[0])

// tilesArray[0].curRow = 2;
// tilesArray[0].curCol = 2;
// tilesArray[0].placeTile();
