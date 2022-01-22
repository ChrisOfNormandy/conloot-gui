/* eslint-disable react/prop-types */
import React from 'react';
import Floater from '../../../fragments/Floater';

import pencil from './assets/pencil.svg';
import paintbrush from './assets/paintbrush.svg';
import eraser from './assets/eraser.svg';

import './styles/brushes.css';

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
    content() {
        return (
            <div
                className='brushes-container'
            >
                {
                    brushes.map((brush) => (
                        <img
                            key={brush.key}
                            src={brush.icon}
                            className={`brush-icon${this.editor.brush.getStyle() === brush.key
                                ? ' brush-selected'
                                : ''}`}
                            id={`${brush.key}_brush`}
                            alt={brush.key}
                            onClick={
                                () => {
                                    let style = this.editor.brush.getStyle();
                                    document.getElementById(`${style}_brush`).classList.remove('brush-selected');
                                    this.editor.brush.setStyle(brush.key);
                                    document.getElementById(`${brush.key}_brush`).classList.add('brush-selected');
                                }
                            }
                        />
                    ))
                }
            </div>
        );
    }

    render() {
        return (
            <Floater
                id='brushes_container'
                content={this.content}
            />
        );
    }

    constructor(props) {
        super(props);

        this.editor = props.editor;

        this.content = this.content.bind(this);
    }
}