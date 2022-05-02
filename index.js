const gameboard = document.querySelector(".gameboard");
const tiles = document.querySelectorAll(".tile");

let tilesArray = []

class Tile {
  constructor(row, col) {
    this.startRow = row;
    this.startCol = col;
    this.curRow = row;
    this.curCol = col;
  }

addTileToDOM(row,col){
    
}

  placeTile() {
    tile.style.gridRow = this.curRow;
    tile.style.gridColumn = this.curCol;
  }


}
