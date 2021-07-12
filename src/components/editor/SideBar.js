import React from "react";

import './css/sidebar.css';
import './css/debug.css';

import ColorSettings from "./side-bar/ColorSettings";
import LayerSettings from "./side-bar/LayerSettings";

export default class SideBar extends React.Component {

    state = {
        brush: null,
        layers: null
    }

    updateColor;

    group = (title, component) => {
        return (
            <div>
                <div
                    className='side-bar-group-title'
                >
                    {title}
                </div>
                {component}
            </div>
        )
    }

    render = () => {
        return (
            <div
                className='side-bar-container'
            >
                <ul
                    className='side-bar-group-list'
                >
                    <li className='side-bar-group'>
                        {this.group(
                            'COLORS',
                            <ColorSettings
                                updateColor={this.updateColor}
                                brush={this.state.brush}
                            />
                        )}
                    </li>
                    <li className='side-bar-group'>
                        {this.group(
                            'LAYERS',
                            <LayerSettings
                                layers={this.state.layers}
                            />
                        )}
                    </li>
                    <li className='side-bar-group'>
                        <div
                            className='debug'
                            id='debug'
                        />
                    </li>
                </ul>
            </div>
        )
    }

    constructor(props) {
        super(props);

        this.state.brush = props.brush;
        this.state.layers = props.layers;
        this.updateColor = props.updateColor;
    }
}