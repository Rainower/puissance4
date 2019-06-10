import React, { Component, Segment } from 'react';
import socketIOClient from "socket.io-client";
import Plateau from './Plateau.jsx';
import Row from './Row.jsx';
import Piece from './Piece.jsx';

export default class Puissance4 extends Component{
    constructor(props){
        super(props);
        this.state = {
            endpoint: "localhost:4001",
            socket: socketIOClient("localhost:4001"),
            gameStart: false,
            gameName: "testGame",
            playerName: null,
            plateau: Array(),
            nextPlayer: null
        }
        this.startGame = this.startGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.play = this.play.bind(this);
    }

    startGame(){
        const s = this.state.socket;
        s.emit('game:start', this.state.gameName);
        s.on('game:started', (data) => {
            console.log(data)
            console.log(data.plateau)
            this.setState({
                startGame: !this.state.startGame,
                playerName: data.playername,
                plateau: data.plateau,
                nextPlayer: data.nextPlayer
            })
        });
    }

    joinGame(){
        const s = this.state.socket;
        s.emit('game:join', this.state.gameName);
        s.on('game:joined', (data) => {
            console.log(data.plateau)
            this.setState({
                startGame: !this.state.startGame,
                playerName: data.playername,
                plateau: data.plateau,
                nextPlayer: data.nextPlayer
            })
        })
    }

    play(rowIndex, columnIndex){
        if(this.state.nextPlayer === this.state.playerName){
            const s = this.state.socket;
            s.emit('game:play', {game_name: this.state.gameName, player_name: this.state.playerName, rowIndex: rowIndex, columnIndex: columnIndex});
        }
    }

    render(){
        const s = this.state.socket;
        s.on('game:move', (data) => {
            this.setState({
                plateau: data.plateau,
                nextPlayer: data.nextPlayer
            })
        });
        let rowsComponents = this.state.plateau.map(function(pieces, i) {
            return <Row
                onClick={this.play}
                rowIndex={i}
                pieces={pieces} />
        }, this);

        return(
            <div className="puissance4">
                {!this.state.startGame ? 
                    (
                        <div>
                            <button onClick={this.startGame}>Start game</button>
                            <button onClick={this.joinGame}>Join game</button>
                        </div>
                    ) : 
                    (
                        <div>
                            {this.state.nextPlayer === this.state.playerName ? (
                                <p className="user">A toi de jouer !</p>
                            ) : (
                                <p className="user">A ton adversaire !</p>
                            )}
                            <table>{rowsComponents}</table>
                        </div>
                    )
                }
            </div>
        )
    }
}