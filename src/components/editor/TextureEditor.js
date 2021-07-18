import React from 'react';
import * as PIXI from 'pixi.js';

import { editor } from '../../app/texture-editor/editor';

import Ribbon from './Ribbon';
import Brushes from './Brushes';
import SideBar from './SideBar';

import mouse from '../../app/texture-editor/common/Mouse';

import './styles/texture-editor.css';

let mouseMove_timeout = null;

export default class TextureEditor extends React.Component {
    state = {
        app: null,
        /**
         * @type {HTMLElement}
         */
        canvas: null,
        doBoundUpdate: true,
        editor
    }

    getCanvas = () => {
        let parent = document.getElementById('texture_editor_wrapper');
        let parentBounds = parent.getBoundingClientRect();

        let state = this.state;

        state.app = new PIXI.Application({
            width: parentBounds.width,
            height: parentBounds.height,
            backgroundAlpha: 1
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
        this.state.editor.bounds.update();

        document.addEventListener('mousemove', (event) => {
            mouse.position.document.x = event.clientX;
            mouse.position.document.y = event.clientY;

            mouse.position.old = {
                x: Math.floor(mouse.position.x),
                y: Math.floor(mouse.position.y)
            };

            mouse.position.x = Math.floor(event.clientX - this.state.editor.bounds.value.left);
            mouse.position.y = Math.floor(event.clientY - this.state.editor.bounds.value.top);

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

        window.addEventListener('resize', () => this.state.editor.bounds.update());
    }

    fetchBrush() {
        return this.state.editor.brush;
    }

    updateColor(clr) {
        let state = this.state;

        let color = state.editor.brush.getColor();

        for (let k in clr)
            color[k] = clr[k] === '' ? 0 : Number(clr[k]);

        state.editor.brush.setColor(color);
        
        this.setState(state);
    }

    render = () => {
        return (
            <div
                className='editor-container'
            >
                <Ribbon
                    editor={this.state.editor}
                />
                
                <div
                    className='texture-editor-container'
                    id='texture_editor_container'
                >
                    <Brushes
                        editor={this.state.editor}
                    />

                    <SideBar
                        editor={this.state.editor}
                        updateColor={this.updateColor}
                    />

                    <div
                        className='texture-editor-wrapper'
                        id='texture_editor_wrapper'
                        onWheel={
                            (event) => this.state.editor.zoom(event.deltaY > 0)
                        }
                    />
                </div>

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
        )
    }

    constructor() {
        super();

        this.updateColor = this.updateColor.bind(this);
        this.fetchBrush = this.fetchBrush.bind(this);
    }
}