const Screen = require("./screen");

class Cursor {

  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.row = 0;
    this.col = 0;

    this.gridColor = 'black';
    this.cursorColor = 'yellow';

    this.setBackgroundColor();
  }

  resetBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.gridColor);
  }

  setBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.cursorColor);
  }

  up() {
    this.resetBackgroundColor();
    // Move cursor up
    if (this.row > 0) {
      this.row += -1;
    }
    this.setBackgroundColor();
  }

  down() {
    this.resetBackgroundColor();
    // Move cursor down
    if (this.row < 2) {
      this.row += 1;
    }
    this.setBackgroundColor();
  }

  left() {
    this.resetBackgroundColor();
    // Move cursor left
    if (this.col > 0) {
      this.col += -1;
    }
    this.setBackgroundColor();
  }

  right() {
    this.resetBackgroundColor();
    // Move cursor right
    if (this.col < 2) {
      this.col += 1;
    }
    this.setBackgroundColor();
  }

}


module.exports = Cursor;
