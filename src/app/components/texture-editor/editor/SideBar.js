/* eslint-disable react/prop-types */
import React from 'react';

import Floater from '../../../fragments/Floater';
import ColorSettings from './side-bar/ColorSettings';
import LayerSettings from './side-bar/LayerSettings';

import './styles/debug.css';

export default class SideBar extends React.Component {
    content() {
        const list = [
            {
                key: 'Colors',
                value: (
                    <ColorSettings
                        updateColor={this.updateColor}
                        brush={this.state.brush}
                    />
                )
            },
            {
                key: 'Layers',
                value: (
                    <LayerSettings
                        layers={this.state.layers}
                    />
                )
            },
            {
                key: 'Debug',
                value: (
                    <div
                        className='debug'
                        id='debug'
                    />
                )
            }
        ];

        return (
            <ul
                className='floater-group-list'
            >
                {list.map((item) => (
                    <li
                        key={item.key}
                        className='floater-group'
                    >
                        <div
                            className='floater-group-title'
                        >
                            {item.key}
                        </div>
                        {item.value}
                    </li>
                ))}
            </ul>
        );
    }

    componentDidMount() {
        let state = this.state;

        state.container = document.getElementById('side_bar_container');
        state.origin = state.container.parentElement.getBoundingClientRect();

        state.container.style.left = `${state.origin.width - state.container.getBoundingClientRect().width}px`;

        this.setState(state);
    }

    render() {
        return (
            <Floater
                id='side_bar_container'
                content={this.content}
            />
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            editor: props.editor,
            brush: props.editor.brush,
            layers: props.editor.layers,
            /**
             * @type {HTMLElement}
            */
            container: null,
            /**
             * @type {DOMRect}
             */
            origin: null,
            moving: null,
        };

        this.updateColor = props.updateColor;
    }
}