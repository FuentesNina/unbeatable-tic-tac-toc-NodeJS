const Screen = require("./screen");
const Cursor = require("./cursor");
const ComputerPlayer = require("./computer-player");

class TTT {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']]

    this.cursor = new Cursor(3, 3);

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);

    let random = Math.floor(Math.random() * (2));

    if (random === 0) {
      //computer move
      let cpuChar = 'X';
      let cpu = ComputerPlayer.getSmartMove(Screen.grid, cpuChar);

      Screen.setGrid(cpu.row, cpu.col, cpuChar);
    }

    this.cursor.setBackgroundColor();

    Screen.addCommand('up', 'move cursor up', this.cursor.up.bind(this.cursor));
    Screen.addCommand('down', 'move cursor down', this.cursor.down.bind(this.cursor));
    Screen.addCommand('right', 'move cursor right', this.cursor.right.bind(this.cursor));
    Screen.addCommand('left', 'move cursor left', this.cursor.left.bind(this.cursor));
    // Screen.addCommand('return', 'place your move', this.placeMove.bind(this));
    Screen.addCommand('return', 'place your move', this.placeMoveAI.bind(this));

    Screen.render();
  }

  placeMove() {
    let row = this.cursor.row;
    let col = this.cursor.col;
    let char = this.playerTurn;

    Screen.setGrid(row, col, char);
    Screen.render();

    this.playerTurn = this.playerTurn === 'O' ? 'X' : 'O';

    let winner = TTT.checkWin(Screen.grid);

    if (winner) {
      TTT.endGame(winner);
    }

  }

  placeMoveAI() {
    let row = this.cursor.row;
    let col = this.cursor.col;
    let char = this.playerTurn;

    let currentChar = Screen.grid[row][col];

    if (currentChar === ' ') {
      Screen.setGrid(row, col, char);
      Screen.render();

      //check win
      let winner = TTT.checkWin(Screen.grid);

      if (winner) {
        TTT.endGame(winner);
      }

      // //remove cursor
      this.cursor.resetBackgroundColor();

      //computer move
      // let cpuChar = char === 'O' ? 'X' : 'O';
      let cpuChar = 'X';
      let cpu = ComputerPlayer.getSmartMove(Screen.grid, cpuChar);
      setTimeout(() => {
        Screen.setGrid(cpu.row, cpu.col, cpuChar),

        //check win
        winner = TTT.checkWin(Screen.grid);

        if (winner) {
          TTT.endGame(winner);
        }

        // //add cursor
        this.cursor.setBackgroundColor();

        //player move
      }, 500);
    }

  }

  static checkWin(grid) {
    //create master grids
    let masterGrid = TTT._getAllLines(grid);

    //check the wins for all of the winning options
    for (let option = 0; option < masterGrid.length; option++) {
      let i = 0;

      while (i < masterGrid[option].length) {
        if (masterGrid[option][i].indexOf(' ') === -1) {
          let Xwins = masterGrid[option][i].filter(spot => spot !== 'X');
          let Owins = masterGrid[option][i].filter(spot => spot !== 'O');

          if (Xwins.length === 0) {
            return 'X';
          } else if (Owins.length === 0) {
            return 'O';
          }
        }
        i++;
      }
    }

    //check for a tie
    let emptyGrid = [];

    grid.forEach(line => {
      let emptyline = line.filter(spot => spot === ' ');
      emptyGrid.push(emptyline);
    })

    let tie = emptyGrid.filter(line => line.length !== 0)

    if (tie.length === 0) {
      return 'T';
    }

    //return false if no win or tie;
    return false;
  }

  static _getAllLines(grid) {
    let masterGrid = [grid];

    let verticalGrid = [];
      for (let i = 0; i < grid[0].length; i++) {
        let column = [];
        for (let j = 0; j < grid.length; j++) {
          column.push(grid[j][i]);
        }
        verticalGrid.push(column);
      }

    masterGrid.push(verticalGrid);

    let diagGrid = [];

      let diag1 = [];
      for (let i = 0; i < grid.length ; i++) {
        diag1.push(grid[i][i]);
      }
      diagGrid.push(diag1);
      let diag2 = [];
      let j = 0;
      for (let i = grid.length - 1; i >= 0 ; i--) {
        diag2.push(grid[i][j]);
        j++;
      }
      diagGrid.push(diag2);

    masterGrid.push(diagGrid);

    return masterGrid;
  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = TTT;
