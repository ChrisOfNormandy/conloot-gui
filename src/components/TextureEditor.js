import React from 'react';
import * as PIXI from 'pixi.js';

import * as editor from '../app/texture-editor/editor';
import mouse from '../app/texture-editor/common/Mouse';

import '../styles/texture-editor.css';

let mouseMove_timeout = null;

class TextureEditor extends React.Component {
    state = {
        app: null,
        canvas: null,
        doBoundUpdate: true,
        /**
         * @type {editor.Editor}
         */
        editor: null
    }    

    getCanvas = () => {
        let parent = document.getElementById('texture_editor_wrapper');

        let scale = parent.getBoundingClientRect().width * 0.5;

        let state = this.state;

        state.app = new PIXI.Application({
            width: scale,
            height: scale
        });

        state.editor = new editor.Editor(state.app);

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

    updateColor(event) {
        let state = this.state;
        if (event.target.value > 255)
            event.target.value = 255;

        let m = event.target.name.match(/rgb_([rgba])/)[1];
        state.editor.currentColor[m] = event.target.value === '' ? 0 : event.target.value;

        this.setState(state);
    }

    render = () => {
        let list = ['r', 'g', 'b', 'a'];

        return (
            <div>
                <div className='texture-editor-container' id='texture_editor_container'>
                    <div className='texture-editor-wrapper' id='texture_editor_wrapper'></div>
                    <div className='color-picker-container'>
                        {list.map(v => (
                            <div key={`rgb_${v}_div`} className='rgb-input-container'>
                                <label htmlFor={`rgb_${v}`} className='rgb-input-label'>{v}</label>
                                <input key={v} name={`rgb_${v}`} type='text' className='rgb-input-field' placeholder='0' onChange={this.updateColor} onKeyPress={(event) => {
                                    if (!event.key.match(/[0-9]/))
                                        event.preventDefault();
                                }} defaultValue={v === 'a' ? 255 : 0} />
                            </div>
                        ))}
                    </div>
                    <div className='texture-editor-controls'>
                        <button onClick={() => {
                            let state = this.state;
                            state.editor.showGrid = !state.editor.showGrid;
                            state.editor.refresh = true;
                            this.setState(state);
                        }}>Toggle Grid</button>
                        <button onClick={() => this.state.editor.clear()}>Clear</button>
                    </div>

                    <button onClick={() => this.state.editor.compose()}>Download</button>
                </div>
                <label id='debug_check_label' htmlFor='debug-check'>Debug</label>
                <input name='debug-check' type='checkbox' onChange={(event) => {
                    let state = this.state;
                    state.editor.debug = event.target.checked;
                    this.setState(state);
                }}></input>
            </div>
        )
    }

    constructor() {
        super();

        this.updateColor = this.updateColor.bind(this);
    }
}

export { TextureEditor }