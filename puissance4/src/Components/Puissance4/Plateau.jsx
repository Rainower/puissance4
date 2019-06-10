import React, { Component } from 'react';
import Row from './Row.jsx';
import Piece from './Piece.jsx';

export default class Plateau extends Component{

    gridGenerator(){
        const grid = [];

        for(let i = 0; i < 36; i+=7){
            grid.push(<Row start={i} end={i+6}></Row>);
        }
        return <table>{grid}</table>;
    }

    render(){
        return (
            <div>
                {this.gridGenerator()}
            </div>
        )
    }
}