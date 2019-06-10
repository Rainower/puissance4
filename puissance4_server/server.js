const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
//const Game = require('./game')

class Game{

  constructor(name){
      this.name = name;
      this.plateau = this.createInitialPlateau();
      this.player1 = "player1";
      this.player2 = "player2";
      this.nextPlayer = "player1";
  }

  createInitialPlateau(width = 7, height = 6) {
    var rows = Array(i);
    for (var i = 0; i < height; i++) {
      rows[i] = Array(j);
      for (var j = 0; j < width; j++)
        rows[i][j] = "";
    }
    return rows;
  } 

  move(player, row, col){
    for (var i = 0; i < this.plateau.length; i++) {
      if (this.plateau[i][col] === "")
        row = i;
    }
    const move = {
      rowIndex: row,
      columnIndex: col,
    };

    if (this.plateau[move.rowIndex][move.columnIndex] === "")
      this.plateau[move.rowIndex][move.columnIndex] = player;

    if(player === this.player1)
      this.nextPlayer = this.player2
    else
      this.nextPlayer = this.player1
  }
}

// our localhost port
const port = 4001

const app = express()

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

const game = Array()

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('New client connected')
  
  socket.on('game:start', (game_name) => {
    game[game_name] = new Game(game_name);
    io.sockets.emit('game:started', {
      plateau: game[game_name].plateau, 
      playername: game[game_name].player1,
      nextPlayer: game[game_name].nextPlayer
    });
    console.log(game)
  })

  socket.on('game:join', (game_name) => {
    console.log(game_name)
    console.log(game[game_name])
    io.sockets.emit('game:joined', {
      plateau: game[game_name].plateau, 
      playername: game[game_name].player2,
      nextPlayer: game[game_name].nextPlayer
    })
  })

  socket.on('game:play', (data) => {
    console.log(data.game_name)
    console.log(data.player_name)
    console.log(data.rowIndex)
    console.log(data.columnIndex)


    game[data.game_name].move(data.player_name, data.rowIndex, data.columnIndex);
    io.sockets.emit('game:move', {plateau: game[data.game_name].plateau, nextPlayer: game[data.game_name].nextPlayer});
  });
  
  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))