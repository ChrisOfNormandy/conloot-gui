import React from "react";

import './styles/debug.css';

import Floater from "../fragments/Floater";
import ColorSettings from "./side-bar/ColorSettings";
import LayerSettings from "./side-bar/LayerSettings";

export default class SideBar extends React.Component {

    state = {
        editor: null,
        brush: null,
        layers: null,
        /**
         * @type {HTMLElement}
        */
        container: null,
        /**
         * @type {DOMRect}
         */
        origin: null,
        moving: null,
    }

    updateColor;

    content = () => {
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
        ]

        return (
            <ul
                className='floater-group-list'
            >
                {list.map((item, index) => (
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
        )
    }

    componentDidMount = () => {
        let state = this.state;

        state.container = document.getElementById('side_bar_container');
        state.origin = state.container.parentElement.getBoundingClientRect();

        state.container.style.left = `${state.origin.width - state.container.getBoundingClientRect().width}px`;

        this.setState(state);
    }

    render = () => {
        return (
            <Floater
                id='side_bar_container'
                content={this.content}
            />
        )
    }

    constructor(props) {
        super(props);

        this.state.editor = props.editor;
        this.state.brush = props.editor.brush;
        this.state.layers = props.editor.layers;
        this.updateColor = props.updateColor;
    }
}