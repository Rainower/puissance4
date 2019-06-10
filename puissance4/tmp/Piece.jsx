import React, {Component} from 'react';

export default class Piece extends Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.props.onClick(this.props.columnIndex);
    }

    render(){
        return(
            <td className={this.props.owner} onClick={this.onClick}></td>
        )
    }
}