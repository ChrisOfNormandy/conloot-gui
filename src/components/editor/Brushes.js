import React from "react";

import './styles/brushes.css';

import Floater from "../fragments/Floater";

import pencil from '../../assets/pencil.svg';
import paintbrush from '../../assets/paintbrush.svg';
import eraser from '../../assets/eraser.svg';

const brushes = [
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
    },
    {
        key: 'fill',
        icon: pencil
    },
    {
        key: 'color-picker',
        icon: pencil
    }
];

export default class Brushes extends React.Component {

    state = {
        editor: null,
        brush: null
    };

    content = () => {
        return (
            <div
                className='brushes-container'
            >
                {brushes.map(brush => (
                    <img
                        key={brush.key}
                        src={brush.icon}
                        className={`brush-icon${this.state.brush.getStyle() === brush.key ? ' brush-selected' : ''}`}
                        id={`${brush.key}_brush`}
                        alt={brush.key}
                        onClick={
                            () => {
                                let style = this.state.brush.getStyle();
                                document.getElementById(`${style}_brush`).classList.remove('brush-selected');
                                this.state.brush.setStyle(brush.key);
                                document.getElementById(`${brush.key}_brush`).classList.add('brush-selected');
                            }
                        }
                    />
                ))}
            </div>
        )
    }

    render = () => {
        return (
            <Floater
                id='brushes_container'
                content={this.content}
            />
        )
    }

    constructor(props) {
        super(props);

        this.state.editor = props.editor;
        this.state.brush = props.editor.brush;
    }
}