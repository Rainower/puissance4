import React, {Component} from 'react';
import Piece from '../Piece/Piece.jsx';

export default class Row extends Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(columnIndex){
        this.props.onClick(this.props.rowIndex, columnIndex);
    }

    render(){
        var piecesComponents = this.props.pieces.map(function(pieceOwner, columnIndex) {
            return <Piece
              onClick={this.onClick}
              key={columnIndex}
              owner={pieceOwner}
              columnIndex={columnIndex} />
        }, this);
        return (
            <tr>{piecesComponents}</tr>
        );
    }
}