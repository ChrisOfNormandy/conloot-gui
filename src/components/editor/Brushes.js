import React from "react";

import './css/brushes.css';

import pencil from '../../assets/pencil.svg';
import paintbrush from '../../assets/paintbrush.svg';
import eraser from '../../assets/eraser.svg';

class Brushes extends React.Component {

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

    editor;

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
                            () => this.editor.setBrush(brush.key)
                        }
                    />
                ))}
            </div>
        )
    }

    constructor(props) {
        super(props);

        this.editor = props.editor;
    }
}

export { Brushes }