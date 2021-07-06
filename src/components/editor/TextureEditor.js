import React from 'react';
import * as PIXI from 'pixi.js';

import { editor } from '../../app/texture-editor/editor';

import { Ribbon } from './Ribbon';
import { Brushes } from './Brushes';
import { SideBar } from './SideBar';

import mouse from '../../app/texture-editor/common/Mouse';

import './css/texture-editor.css';

let mouseMove_timeout = null;

class TextureEditor extends React.Component {
    state = {
        app: null,
        canvas: null,
        doBoundUpdate: true,
        editor
    }

    getCanvas = () => {
        let parent = document.getElementById('texture_editor_wrapper');

        let scale = parent.getBoundingClientRect().height < parent.getBoundingClientRect().width
            ? parent.getBoundingClientRect().height * 0.9
            : parent.getBoundingClientRect().width * 0.9;

        let state = this.state;

        state.app = new PIXI.Application({
            width: scale,
            height: scale
        });

        state.editor = editor.create(state.app, 16);

        state.app.view.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); }
        state.app.view.id = "editor";

        state.canvas = state.editor.startup();

        parent.appendChild(state.canvas);

        this.setState(state);
    }

    componentDidMount = () => {
        this.getCanvas();
        this.state.editor.updateBounds();

        this.state.canvas.addEventListener('mousemove', (event) => {
            mouse.position.old = {
                x: Math.floor(mouse.position.x),
                y: Math.floor(mouse.position.y)
            };

            mouse.position.x = Math.floor(event.clientX - this.state.editor.bounds.left);
            mouse.position.y = Math.floor(event.clientY - this.state.editor.bounds.top);

            mouse.moving = true;

            if (mouseMove_timeout)
                clearTimeout(mouseMove_timeout);

            mouseMove_timeout = setTimeout(() => {
                mouse.position.old = {
                    x: Math.floor(mouse.position.x),
                    y: Math.floor(mouse.position.y)
                };
                mouse.moving = false;
            }, 30);
        });

        this.state.canvas.addEventListener('mousedown', (event) => {
            mouse.button.state = true;
            mouse.button.id = event.button;
        });

        this.state.canvas.addEventListener('mouseup', () => {
            mouse.button.state = false;
            mouse.button.id = null;
        });

        this.state.canvas.addEventListener('mouseleave', () => mouse.inBounds = false);

        this.state.canvas.addEventListener('mouseenter', () => mouse.inBounds = true);

        this.state.canvas.addEventListener('click', () => mouse.clicked = true);

        window.addEventListener('resize', () => {
            this.state.editor.updateBounds();
        });
    }

    fetchBrush() {
        return this.state.editor.brush;
    }

    updateColor(event) {
        let state = this.state;
        if (event.target.value > 255)
            event.target.value = 255;

        let m = event.target.name.match(/rgb_([rgba])/)[1];
        state.editor.brush.fill[m] = event.target.value === '' ? 0 : event.target.value;
        state.editor.getCurrentColor();
        this.setState(state);
    }

    render = () => {
        return (
            <div
                className='editor-container'
            >
                <Brushes />

                <div
                    className='texture-editor-container'
                    id='texture_editor_container'
                >
                    <Ribbon
                        editor={this.state.editor}
                    />

                    <div
                        className='texture-editor-wrapper'
                        id='texture_editor_wrapper'
                    />

                    <div
                        className='texture-editor-controls'
                    >
                        <label
                            htmlFor='texture-name-input'
                        >
                            File name:
                        </label>
                        <input
                            type='text'
                            name='texture-name-input'
                            id='image_name'
                            defaultValue='texture'
                            onKeyPress={
                                (event) => {
                                    if (!event.key.match(/[\w\d.()]/))
                                        event.preventDefault();
                                }
                            }
                        />
                    </div>
                </div>

                <SideBar
                    updateColor={this.updateColor}
                    fetchBrush={this.fetchBrush}
                />
            </div>
        )
    }

    constructor() {
        super();

        this.updateColor = this.updateColor.bind(this);
        this.fetchBrush = this.fetchBrush.bind(this);
    }
}

export { TextureEditor }