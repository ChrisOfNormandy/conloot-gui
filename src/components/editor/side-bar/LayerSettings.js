import React from 'react';

import Collapsable from '../../fragments/Collapsable';

import eye_open from '../../../assets/eye-open.svg';
import minus from '../../../assets/minus.svg';

import '../css/side-bar/layers.css';

export default class LayerSettings extends React.Component {
    state = {
        layers: null
    }

    container = null;

    updateActiveLayer = (layer) => {
        let state = this.state;

        state.layers.active = layer;

        let i = state.layers.cache.length - 1;
        while (i >= 0) {
            if (i !== layer)
                document.getElementById(`layer_${i}`).classList.remove('layer-item-selected');
            else
                document.getElementById(`layer_${i}`).classList.add('layer-item-selected');
            i--;
        }

        this.setState(state);
    }

    updateLayerViewable = (index) => {
        let state = this.state;

        state.layers.get(index).toggle();

        document.getElementById(`layer_${index}_viewable`).classList.toggle('layer-item-viewable');

        this.setState(state);
    }

    layerMovementButtons = (index, max) => {
        return (
            <div
                className='layer-item-movement-group'
            >
                <div
                    id='layer_item_move_up'
                    className={`layer-item-movement-button${index === 0 ? ' hidden' : ''}`}
                    onClick={
                        () => {
                            let state = this.state;
                            state.layers.move(index, index - 1);
                            this.setState(state);
                            this.updateActiveLayer(index - 1);
                        }
                    }
                >
                    /\
                </div>
                <div
                    id='layer_item_move_down'
                    className={`layer-item-movement-button${index === max ? ' hidden' : ''}`}
                    onClick={
                        () => {
                            let state = this.state;
                            state.layers.move(index, index + 1);
                            this.setState(state);
                            this.updateActiveLayer(index + 1);
                        }
                    }
                >
                    \/
                </div>
            </div>
        )
    }

    refresh = () => {
        this.container = document.getElementById('layers_controls_container');
    }

    componentDidMount() {
        this.refresh();

        this.updateActiveLayer(0);
    }

    layerControls = () => {
        return (
            <div>
                {
                    this.state.layers.cache.map((layer, index) => (
                        <div
                            key={index}
                            className={`layer-item${index === this.state.layers.active ? ' layer-item-selected' : ''}`}
                            id={`layer_${index}`}
                            onClick={
                                (event) => {
                                    if (event.target.childNodes > 0)
                                        this.updateActiveLayer(index);
                                }
                            }
                        >
                            {this.layerMovementButtons(index, this.state.layers.cache.length - 1)}
                            <input
                                type='text'
                                className='layer-item-title'
                                placeholder={`Layer ${index + 1}`}
                                value={layer.name}
                                onChange={
                                    (event) => {
                                        let state = this.state;
                                        state.layers.get(index).name = event.target.value;
                                        this.setState(state);
                                    }
                                }
                            />
                            <img
                                src={eye_open}
                                alt='Hide'
                                className='layer-item-button'
                                id={`layer_${index}_viewable`}
                                onClick={
                                    () => {
                                        this.updateLayerViewable(index);
                                    }
                                }
                            />
                            <img
                                src={minus}
                                alt='Remove'
                                className='layer-item-button'
                                onClick={
                                    () => {
                                        let state = this.state;
                                        state.layers = state.layers.remove(index);
                                        this.setState(this.state);
                                    }
                                }
                            />
                        </div>
                    ))
                }
                <div
                    className='layer-add-item'
                    onClick={
                        () => {
                            this.state.layers.add();
                            this.setState(this.state);
                        }
                    }
                >
                    Add Layer
                </div>
            </div>
        )
    }

    render = () => {
        return (
            <div
                className='side-bar-group'
            >
                <Collapsable
                    id='layer_container'
                    content={this.layerControls}
                />
            </div>
        )
    }

    constructor(props) {
        super(props);

        this.state.layers = props.layers;

        this.updateActiveLayer = this.updateActiveLayer.bind(this);
        this.updateLayerViewable = this.updateLayerViewable.bind(this);
        this.layerMovementButtons = this.layerMovementButtons.bind(this);
    }
}