
class ComputerPlayer {

  static getValidMoves(grid) {
    // Your code here
    let validMoves = [];

    grid.forEach((line, row) => {
      line.forEach((spot, col) => {
        if (spot === ' ') {
          let move = { row: row, col: col};
          validMoves.push(move);
        }
      })
    })
    return validMoves;
  }

  static randomMove(grid) {
    // Your code here
    let validMoves = ComputerPlayer.getValidMoves(grid);

    let randomIndex = Math.floor(Math.random() * (validMoves.length));

    return validMoves[randomIndex];
  }

  static getWinningMoves(grid, symbol) {
    // Your code here
    // get potential winning lines
    let masterGrid = ComputerPlayer._getAllLines(grid);
    let winningMoves = [];

    // cycle through all the potential lines
    for (let i = 0; i < masterGrid.length; i++) {
      let currentGrid = masterGrid[i];

      for (let j = 0; j < currentGrid.length; j++) {
        let line = currentGrid[j];

        // get the potential moves for each line
        let moves = line.filter(spot => spot !== symbol);

        //check if there's a potential win
        if (moves.length === 1 && moves[0] === ' ') {
          // console.log(moves)
          // console.log(line)
          let row;
            let col;

              // determine the exact location of winning move (row and col)
              if (i === 0) {
                row = j;
                col = line.indexOf(' ');
              } else if (i === 1) {
                col = j;
                row = line.indexOf(' ');
              } else if (i === 2) {
                col = line.indexOf(' ');
                row = (j === 0) ? col : (2 - col);
              }
            //add winning moves to array
            let winningMove = {row: row, col: col};
            winningMoves.push(winningMove);
          }
      }
    }
    return winningMoves;
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



  static getSmartMove(grid, symbol) {
    // Your code here
    // look for winning move
    let winningMoves = ComputerPlayer.getWinningMoves(grid, symbol);

    if (winningMoves.length > 0) {
      //pick a random move to win
      let randomIndex = Math.floor(Math.random() * (winningMoves.length));
      // console.log('winningmove - ' + winningMoves[randomIndex].row + ',' + winningMoves[randomIndex].col);
      return winningMoves[randomIndex];
    }

    // block potential wins
    let enemyChar = (symbol === 'X') ? 'O' : 'X';
    let losingMoves = ComputerPlayer.getWinningMoves(grid, enemyChar);
    if (losingMoves.length > 0) {
      //pick a random move to block
      let randomIndex = Math.floor(Math.random() * (losingMoves.length));

      return losingMoves[randomIndex];
    }

    // let openLosing = losingMoves.filter(location => {
    //   return grid[location.row][location.col] === ' ';
    // })

    // if (openLosing.length > 0) {
    //   //pick a random move to block
    //   let randomIndex = Math.floor(Math.random() * (openLosing.length));
    //   // console.log('block - ' + openLosing[randomIndex].row + ',' + openLosing[randomIndex].col);
    //   return openLosing[randomIndex];
    // }

    //chose "Best" move
    let bestMove = ComputerPlayer.getBestMove(grid, symbol);
    if (bestMove) {
      // console.log('smart - ' + bestMove.row + ',' + bestMove.col);
      return bestMove;
    }

    //otherwise, pick a random move (not very smart, but oh well.)
    // console.log('random');
    return ComputerPlayer.randomMove(grid);

  }


  static getBestMove(grid, symbol) {
    let sides = [
      { row: 0, col: 1},
      { row: 1, col: 2},
      { row: 2, col: 1},
      { row: 1, col: 0}
    ];

    let corners = [
      { row: 0, col: 0},
      { row: 0, col: 2},
      { row: 2, col: 0},
      { row: 2, col: 2}
    ];

    let middle = {row: 1, col: 1};

    let openCorners = corners.filter(spot => grid[spot.row][spot.col] === ' ');
    let openSides = sides.filter(spot => grid[spot.row][spot.col] === ' ');

    //Define round number
    let round = 0;

    grid.forEach(line => {
      line.forEach(spot => {
        if (spot !== ' ') {
          round++;
        }
      })
    });

    // START FIRST: Rounds 0, 2, 4
    if (round === 0) {
      let randomIndex = Math.floor(Math.random() * (openCorners.length));
      return openCorners[randomIndex];
    }

    if (round === 2) {
      //find previous move and select location accross
      let row;
      let col;
      let acrossMove;

      corners.forEach(spot => {
        if (grid[spot.row][spot.col] === 'X') {
          row = spot.row === 0 ? 2 : 0;
          col = spot.col === 0 ? 2 : 0;
          acrossMove = { row: row, col: col};
        }
      })

      return acrossMove;
    }

    if (round === 4) {
      //find corner with empty sides
      let filtered = corners.filter(rowcol => {
        return grid[rowcol.row][rowcol.col] === symbol;
      })

      let corner1 = filtered[0];
      let corner3 = filtered[1];
      let side1;
      let corner2;
      let side2;

      if (corner1.row === 0 && corner1.col === 0) {
        side1 = {row: 0, col: 1};
        corner2 = {row: 0, col: 2};
        side2 = {row: 1, col: 2};
      } else if (corner1.row === 0 && corner1.col === 2) {
        side1 = {row: 1, col: 2};
        corner2 = {row: 2, col: 2};
        side2 = {row: 2, col: 1};
      } else if (corner1.row === 2 && corner1.col === 2) {
        side1 = {row: 2, col: 1};
        corner2 = {row: 2, col: 0};
        side2 = {row: 1, col: 0};
      } else if (corner1.row === 2 && corner1.col === 0) {
        side1 = {row: 1, col: 0};
        corner2 = {row: 0, col: 0};
        side2 = {row: 0, col: 1};
      }

      let char1 = grid[side1.row][side1.col];
      let char2 = grid[corner2.row][corner2.col];
      let char3 = grid[side2.row][side2.col];

      if (char1 === ' ' && char2 === ' ' && char3 === ' ') {
        return corner2;
      }

      let lastCorner = corners.filter(corner => {
        return corner !== corner1 && corner !== corner2 && corner !== corner3;
      });

      let corner4 = lastCorner[0];

      return corner4;
    }

    // START SECOND: Rounds 1 & 3
    if (round === 1 && grid[middle.row][middle.col] === ' '){
      return middle;
    } else if (round === 1) {
      let randomIndex = Math.floor(Math.random() * (openCorners.length));
      return openCorners[randomIndex];
    }

    if (round === 3 && openSides.length === 4) {
      //if middle taken by opponent, pick corner
      if(grid[middle.row][middle.col] !== symbol) {
        let randomIndex = Math.floor(Math.random() * (openCorners.length));
        return openCorners[randomIndex];
      }

      //find previous corner move
      let filtered = corners.filter(rowcol => {
        return grid[rowcol.row][rowcol.col] === symbol;
      })

      //if none, pick any side
      if (filtered.length === 0) {
        let randomIndex = Math.floor(Math.random() * (openSides.length));
        return openSides[randomIndex];
      }

      //otherwise pick side next to already placed move
      let corner = filtered[0];
      let side1;
      let side2;

      if (corner.row === 0 && corner.col === 0) {
        side1 = {row: 0, col: 1};
        side2 = {row: 1, col: 0};
      } else if (corner.row === 0 && corner.col === 2) {
        side1 = {row: 1, col: 2};
        side2 = {row: 0, col: 1};
      } else if (corner.row === 2 && corner.col === 2) {
        side1 = {row: 2, col: 1};
        side2 = {row: 1, col: 2};
      } else if (corner.row === 2 && corner.col === 0) {
        side1 = {row: 1, col: 0};
        side2 = {row: 2, col: 1};
      }

      let char = grid[side1.row][side1.col];

      if (char === ' ') {
        return side1;
      } else {
        return side2;
      }

    } else if (round === 3) {

      let enemyChar = (symbol === 'X') ? 'O' : 'X';

      if (openCorners.length === 4) {
        //find best move (place move between 2 sides)
        //find first opponent move
        let takenSides = sides.filter(rowcol => {
          return grid[rowcol.row][rowcol.col] === enemyChar;
        });

        let side1 = takenSides[0];
        let side2;
        let Corner;

        if (side1.row === 0 && side1.col === 1) {
          side2 = {row: 1, col: 2};
          Corner = {row: 2, col: 2};
        } else if (side1.row === 1 && side1.col === 2) {
          side2 = {row: 2, col: 1};
          Corner = {row: 2, col: 0};
        } else if (side1.row === 2 && side1.col === 1) {
          side2 = {row: 1, col: 0};
          Corner = {row: 0, col: 0};
        } else if (side1.row === 1 && side1.col === 0) {
          side2 = {row: 0, col: 1};
          Corner = {row: 0, col: 2};
        }

        let char = grid[side2.row][side2.col];

        if (char === ' ') {
          let goodCorners = openCorners.filter(location => {
            return location.row !== Corner.row && location.col !== Corner.col;
          });

          let randomIndex = Math.floor(Math.random() * (goodCorners.length));
          return goodCorners[randomIndex];
        }

        return Corner;


      }

      //find empty corner (clear line)
      //find corner with empty sides

      let takenCorners = corners.filter(rowcol => {
        return grid[rowcol.row][rowcol.col] === enemyChar;
      })

      let corner1 = takenCorners[0];
      let side1;
      let corner2;
      let side2;
      let corner3;
      let corner4;

      if (corner1.row === 0 && corner1.col === 0) {
        side1 = {row: 0, col: 1};
        corner2 = {row: 0, col: 2};
        side2 = {row: 1, col: 2};
        corner3 = {row: 2, col: 2};
        corner4 = {row: 2, col: 0};
      } else if (corner1.row === 0 && corner1.col === 2) {
        side1 = {row: 1, col: 2};
        corner2 = {row: 2, col: 2};
        side2 = {row: 2, col: 1};
        corner3 = {row: 2, col: 0};
        corner4 = {row: 0, col: 0};
      } else if (corner1.row === 2 && corner1.col === 2) {
        side1 = {row: 2, col: 1};
        corner2 = {row: 2, col: 0};
        side2 = {row: 1, col: 0};
        corner3 = {row: 0, col: 0};
        corner4 = {row: 0, col: 2};
      } else if (corner1.row === 2 && corner1.col === 0) {
        side1 = {row: 1, col: 0};
        corner2 = {row: 0, col: 0};
        side2 = {row: 0, col: 1};
        corner3 = {row: 0, col: 2};
        corner4 = {row: 2, col: 2};
      }

      let char1 = grid[side1.row][side1.col];
      let char2 = grid[corner2.row][corner2.col];
      let char3 = grid[side2.row][side2.col];

      // chose opposite side
      if (char1 === ' ' && char2 === ' ' && char3 !== ' ') {
        return corner2;
      }

      return corner4;
    }

  }

};

module.exports = ComputerPlayer;
