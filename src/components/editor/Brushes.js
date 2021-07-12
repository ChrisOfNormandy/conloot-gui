import React from "react";

import './css/brushes.css';

import pencil from '../../assets/pencil.svg';
import paintbrush from '../../assets/paintbrush.svg';
import eraser from '../../assets/eraser.svg';

export default class Brushes extends React.Component {

    brushes = [
        {
            key: 'pencil',
            icon: pencil
        },
        {
            key: 'paint',
            icon: paintbrush
        },
        {
            key: 'eraser',
            icon: eraser
        }
    ]

    brush;

    render = () => {
        return (
            <div
                className='brushes-container'
            >
                {this.brushes.map(brush => (
                    <img
                        key={brush.key}
                        src={brush.icon}
                        className='brush-icon'
                        id={`${brush.key}_brush`}
                        alt={brush.key}
                        onClick={
                            () => this.brush.setBrush(brush.key)
                        }
                    />
                ))}
            </div>
        )
    }

    constructor(props) {
        super(props);

        this.brush = props.brush;
    }
}