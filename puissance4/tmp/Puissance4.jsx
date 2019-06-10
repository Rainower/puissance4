import React, {Component} from 'react';
import Row from './Row.jsx';

function createInitialPlateau(width, height) {
    var rows = Array(i);
    for (var i = 0; i < height; i++) {
      rows[i] = Array(j);
      for (var j = 0; j < width; j++)
        rows[i][j] = "";
    }
    return rows;
  }
  
  function calcNewPlateau(plateau, player, move) {
    if (plateau[move.rowIndex][move.columnIndex] === "")
      plateau[move.rowIndex][move.columnIndex] = player;
    return plateau;
  }
  
  function calcNewPlayer(player) {
    if (player === "joueur1")
      return "joueur2";
    else
      return "joueur1";
  }
  
  function calcNewWinner(plateau, player, move) {
    var rows = plateau.length;
    var cols = plateau[0].length;
  
    var row = move.rowIndex;
    var col = move.columnIndex;
    var count, shift;
    var i;
  
    function newCount(i, j) {
      if (plateau[i][j] === player)
        return count + 1;
      else
        return 0;
    }
  
    // Horizontal
    count = 0;
    for (i = 0; i < cols; i++) {
      count = newCount(row, i);
      if (count >= 4) return player;
    }
  
    // Vertical
    count = 0;
    for (i = 0; i < rows; i++) {
      count = newCount(i, col);
      if (count >= 4) return player;
    }
  
    // Diagonal
    count = 0;
    shift = row - col;
    for (i = Math.max(shift, 0); i < Math.min(rows, cols + shift); i++) {
      count = newCount(i, i - shift);
      if (count >= 4) return player;
    }
  
    // Anti-diagonal
    count = 0;
    shift = row + col;
    for (i = Math.max(shift - cols + 1, 0); i < Math.min(rows, shift + 1); i++) {
      count = newCount(i, shift - i);
      if (count >= 4) return player;
    }
  
    return "";
  }
  
  function calcMove(plateau, player, row, col) {
    for (var i = 0; i < plateau.length; i++) {
      if (plateau[i][col] === "")
        row = i;
    }
    return {
      rowIndex: row,
      columnIndex: col,
    };
}

class Puissance4 extends Component{

    constructor(props){
        super(props);
        this.state = {
            socket: socketIOClient("localhost:4001"),
            plateau: createInitialPlateau(this.props.width, this.props.height),
            player: "joueur1",
            winner: ""
        }
        this.play = this.play.bind(this);
    }

    play(rowIndex, columnIndex){
        var player = this.state.player;
        var plateau;
    
        if (this.state.winner) {
          plateau = createInitialPlateau(this.props.width, this.props.height);
        } else {
          plateau = this.state.plateau;
        }
    
        var move = calcMove(plateau, player, rowIndex, columnIndex);
        var newPlateau = calcNewPlateau(plateau, player, move);
        var newWinner = calcNewWinner(newPlateau, player, move);
        var newPlayer = calcNewPlayer(player);
    
        if (newWinner)
          setTimeout(function() { alert(newWinner) }, 0);
    
        this.setState({
          plateau: newPlateau,
          player: newPlayer,
          winner: newWinner,
        });
    };

    render(){
        let rowsComponents = this.state.plateau.map(function(pieces, i) {
            return <Row
                onClick={this.play}
                rowIndex={i}
                pieces={pieces} />
        }, this);

        return (
            <div>
                <p className={this.state.winner || this.state.player}>
                    {this.state.winner
                        ? ("Gagnant : " + this.state.winner)
                        : ("A " + this.state.player + " de jouer")
                    }
                </p>
                <table>{rowsComponents}</table>
            </div>
        );
    }
}

export default Puissance4;