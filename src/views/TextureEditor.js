import React from 'react';
import Ribbon from '../app/components/texture-editor/editor/Ribbon';
import Brushes from '../app/components/texture-editor/editor/Brushes';
import SideBar from '../app/components/texture-editor/editor/SideBar';
import Mouse from '../app/components/texture-editor/common/Mouse';

import { Application } from 'pixi.js';
import Editor from '../app/components/texture-editor/editor';

import './styles/texture-editor.css';

let MouseMove_timeout = null;

export default class TextureEditor extends React.Component {
    setup() {
        let parent = document.getElementById('texture_editor_wrapper');
        let parentBounds = parent.getBoundingClientRect();

        let state = this.state;

        state.app = new Application({
            width: parentBounds.width,
            height: parentBounds.height,
            backgroundAlpha: 1
        });

        state.editor = new Editor(state.app);

        state.app.view.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); };
        state.app.view.id = 'editor';

        state.canvas = state.editor.startup();

        parent.appendChild(state.canvas);

        state.editor.bounds.update();

        document.addEventListener('Mousemove', (event) => {
            Mouse.position.document.x = event.clientX;
            Mouse.position.document.y = event.clientY;

            Mouse.position.old = {
                x: Math.floor(Mouse.position.x),
                y: Math.floor(Mouse.position.y)
            };

            Mouse.position.x = Math.floor(event.clientX - this.state.editor.bounds.value.left);
            Mouse.position.y = Math.floor(event.clientY - this.state.editor.bounds.value.top);

            Mouse.moving = true;

            if (MouseMove_timeout)
                clearTimeout(MouseMove_timeout);

            MouseMove_timeout = setTimeout(() => {
                Mouse.position.old = {
                    x: Math.floor(Mouse.position.x),
                    y: Math.floor(Mouse.position.y)
                };
                Mouse.moving = false;
            }, 30);
        });

        state.canvas.addEventListener('Mousedown', (event) => {
            Mouse.button.state = true;
            Mouse.button.id = event.button;
        });

        state.canvas.addEventListener('Mouseup', () => {
            Mouse.button.state = false;
            Mouse.button.id = null;
        });

        state.canvas.addEventListener('Mouseleave', () => Mouse.inBounds = false);

        state.canvas.addEventListener('Mouseenter', () => Mouse.inBounds = true);

        state.canvas.addEventListener('click', () => Mouse.clicked = true);

        window.addEventListener('resize', () => this.state.editor.bounds.update());

        this.setState(state);
    }

    componentDidMount() {
        this.setup();
    }

    fetchBrush() {
        return this.state.editor.brush;
    }

    updateColor(clr) {
        let state = this.state;

        let color = state.editor.brush.getColor();

        for (let k in clr)
            color[k] = clr[k] === ''
                ? 0
                : Number(clr[k]);

        state.editor.brush.setColor(color);

        this.setState(state);
    }

    render() {
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
        );
    }

    constructor() {
        super();

        this.state = {
            app: null,
            /**
             * @type {HTMLElement}
             */
            canvas: null,
            doBoundUpdate: true,
            /**
             * @type {Editor}
             */
            editor: null
        };

        this.updateColor = this.updateColor.bind(this);
        this.fetchBrush = this.fetchBrush.bind(this);
    }
}