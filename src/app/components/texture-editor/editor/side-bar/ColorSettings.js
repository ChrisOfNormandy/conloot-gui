import React from 'react';

import Collapsable from '../../../../fragments/collabsable/Collapsable';

import * as colorize from '../../helpers/colorize';

import '../styles/side-bar/colors.css';

export default class ColorSettings extends React.Component {
    updatePreview() {
        let rgba = this.state.brush.getColor();
        this.previewElem.style.backgroundColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a / 255})`;
    }

    updateRgb() {
        let color = this.state.brush.getColor();

        ['r', 'g', 'b', 'a'].forEach((k) => {
            document.getElementById(`rgb_${k}`).value = color[k];
            document.getElementById(`rgb_${k}_slider`).value = color[k];
        });
    }

    updateHex() {
        let hex = colorize.rgbToHexString(document.getElementById('rgb_r').value, document.getElementById('rgb_g').value, document.getElementById('rgb_b').value, document.getElementById('rgb_a').value);
        document.getElementById('hex').value = hex;
    }

    fetchDisplayColor() {
        return {
            r: document.getElementById('rgb_r').value,
            g: document.getElementById('rgb_g').value,
            b: document.getElementById('rgb_b').value,
            a: document.getElementById('rgb_a').value
        };
    }

    refresh() {
        this.previewElem = document.getElementById('color_picker_preview');
        this.container = document.getElementById('color_picker_controls_container');
    }

    update() {
        this.updateRgb();
        this.updatePreview();
        this.updateHex();
    }

    componentDidMount() {
        this.refresh();

        this.updatePreview();
    }

    rgbControls() {
        return (
            <div
                className='rgb-container-wrapper'
            >
                {['r', 'g', 'b', 'a'].map((v) => (
                    <div
                        key={`rgb_${v}_div`}
                        className='rgb-input-container'
                    >
                        <div
                            htmlFor={`rgb_${v}`}
                            className='rgb-input-label'
                        >
                            {v.toUpperCase()}
                        </div>

                        <input
                            key={`${v}_slider`}
                            name={`rgb_${v}_slider`}
                            id={`rgb_${v}_slider`}
                            type='range'
                            min='0'
                            max='255'
                            className='rgb-input-slider'
                            onChange={
                                (event) => {
                                    document.getElementById(`rgb_${v}`).value = event.target.value;
                                    this.updateColor(this.fetchDisplayColor());
                                    this.updatePreview();
                                    this.updateHex();
                                }
                            }
                            defaultValue={v === 'a'
                                ? 255
                                : 0}
                        />

                        <input
                            key={v}
                            name={`rgb_${v}`}
                            id={`rgb_${v}`}
                            type='text'
                            className='rgb-input-field'
                            placeholder='0'
                            onChange={
                                () => {
                                    this.updateColor(this.fetchDisplayColor());
                                    this.updatePreview();
                                    this.updateHex();
                                }
                            }
                            onKeyPress={
                                (event) => {
                                    if (!event.key.match(/[0-9]/))
                                        event.preventDefault();
                                }
                            }
                            defaultValue={v === 'a'
                                ? 255
                                : ''}
                        />
                    </div>
                ))}

                <input
                    name='hex'
                    id='hex'
                    type='text'
                    className='hex-input-field'
                    placeholder='000000ff'
                    onChange={
                        (event) => {
                            let rgba = colorize.hexToRgb(event.target.value);

                            for (let k in rgba)
                                document.getElementById(`rgb_${k}`).value = rgba[k];

                            this.updateColor(this.fetchDisplayColor());
                            this.updatePreview();
                        }
                    }
                    onKeyPress={
                        (event) => {
                            if (!event.key.match(/[0-9A-Fa-f]/) || event.target.value.length >= 8)
                                event.preventDefault();
                        }
                    }
                    defaultValue='000000ff'
                />
            </div>
        );
    }

    render() {
        return (
            <div
                className='floater-group'
            >
                <div
                    className='container-group'
                    id='color_picker_preview_container'
                >
                    <div
                        className='color-picker-preview'
                        id='color_picker_preview'
                    />
                    <div
                        className='brush-size-preview'
                        id='brush_size_preview'
                    />
                    <input
                        className='brush-size-input'
                        id='brush_size_input'
                        type='text'
                        defaultValue={1}
                        onChange={
                            (event) => {
                                this.state.brush.setSize(Number(event.target.value));
                            }
                        }
                        onKeyPress={
                            (event) => {
                                if (event.key.match(/[0-9]/) === null)
                                    event.preventDefault();
                            }
                        }
                    />
                </div>

                <Collapsable
                    id='color_picker_container'
                    content={this.rgbControls}
                />
            </div>
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            // eslint-disable-next-line react/prop-types
            brush: props.brush
        };

        this.state.brush.preview = this;

        this.updateColor;

        this.previewElem = null;
        this.container = null;


        // eslint-disable-next-line react/prop-types
        this.updateColor = props.updateColor.bind(this);

        this.fetchDisplayColor = this.fetchDisplayColor.bind(this);
    }
}