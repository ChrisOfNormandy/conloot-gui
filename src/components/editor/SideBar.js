import React from "react";

import './css/sidebar.css';

class SideBar extends React.Component {

    updateColor;
    fetchBrush;

    previewElem = null;

    updatePreview = () => {
        let rgba = this.fetchBrush().fill;
        this.previewElem.style.backgroundColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a / 255})`;
    }

    render = () => {
        return (
            <div
                className='side-bar-container'
            >
                <div
                    className='color-picker-container'
                >
                    <div
                        className='container-group'
                        id='color_picker_preview_container'
                    >
                        <div
                            className='color-picker-preview'
                            id='color_picker_preview'
                        />
                    </div>

                    <div
                        className='collapsable-container-group container-group'
                        id='color_picker_controls_container'
                    >
                        {['r', 'g', 'b', 'a'].map(v => (
                            <div
                                key={`rgb_${v}_div`}
                                className='rgb-input-container'
                            >
                                <label
                                    htmlFor={`rgb_${v}`}
                                    className='rgb-input-label'
                                >
                                    {v}
                                </label>
                                <input
                                    key={v}
                                    name={`rgb_${v}`}
                                    id={`rgb_${v}`}
                                    type='text'
                                    className='rgb-input-field'
                                    placeholder='0'
                                    onChange={
                                        (event) => {
                                            this.updateColor(event);
                                            this.updatePreview();
                                        }
                                    }
                                    onKeyPress={
                                        (event) => {
                                            if (!event.key.match(/[0-9]/))
                                                event.preventDefault();
                                        }
                                    }
                                    defaultValue={v === 'a' ? 255 : ''}
                                />

                                <input
                                    key={`${v}_slider`}
                                    name={`rgb_${v}_slider`}
                                    type='range'
                                    min='0'
                                    max='255'
                                    className='rgb-input-slider'
                                    onChange={
                                        (event) => {
                                            document.getElementById(`rgb_${v}`).value = event.target.value;
                                            this.updateColor(event);
                                            this.updatePreview();
                                        }
                                    }
                                    defaultValue={v === 'a' ? 255 : 0} />
                            </div>
                        ))}
                    </div>
                    <div
                        className='collapsable-container-group-trigger'
                        id='collapse_color_picker'
                        onClick={
                            () => {
                                let controls = document.getElementById('color_picker_controls_container');

                                controls.style.maxHeight = !controls.style.maxHeight ? controls.scrollHeight + 'px' : null;
                            }
                        }
                    />
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.previewElem = document.getElementById('color_picker_preview');
        this.updatePreview();
    }

    constructor(props) {
        super(props);

        this.updateColor = props.updateColor;
        this.fetchBrush = props.fetchBrush;

        this.updatePreview = this.updatePreview.bind(this);
    }
}

export { SideBar }