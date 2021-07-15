import React from 'react';

import Menu from '../Menu';

import './styles/ribbon.css';

export default class Ribbon extends React.Component {

    state = {
        editor: null,
        content: [
        {
            key: "File",
            id: 'file_menu',
            value: (<Menu
                content={[
                    (<div
                        className='menu-button'
                        onClick={
                            () => this.state.editor.compose()
                        }
                    >
                        Download
                    </div>),
                    // (<div
                    //     className='menu-break'
                    // />),
                    // (<form
                    //     className='menu-button'
                    // >
                    //     <input
                    //         type='text'
                    //         id='resolution_input'
                    //         name='resolution'
                    //         defaultValue='16'
                    //     />
                    //     <input
                    //         type='submit'
                    //         value='Create'
                    //         onClick={this.setResolution}
                    //     />
                    // </form>),
                    (<div
                        className='menu-break'
                    />),
                    (<div
                        className='menu-button'
                    >
                        <label
                            id='debug_check_label'
                            htmlFor='debug-check'
                        >
                            Debug
                        </label>
                        <input
                            name='debug-check'
                            type='checkbox'
                            onChange={
                                (event) => {
                                    let state = this.state;
                                    state.editor.debug = event.target.checked;
                                    this.setState(state);
                                }
                            }
                        />
                    </div>)
                ]}
                id='file_menu'
                hidden={true}
            />)
        },
        {
            key: "Edit",
            id: 'edit_menu',
            value: (<Menu
                content={[
                    (<div
                        className='menu-button'
                        onClick={
                            () => this.state.editor.clear()
                        }
                    >
                        Clear
                    </div>)
                ]}
                id='edit_menu'
                hidden={true}
            />)
        },
        {
            key: "View",
            id: 'view_menu',
            value: (
                <Menu
                    content={[
                        (<div
                            className='menu-button'
                            onClick={
                                () => {
                                    this.state.editor.toggleGrid();
                                }
                            }
                        >
                            Toggle Grid
                        </div>)
                    ]}
                    id='view_menu'
                    hidden={true}
                />
            )
        }
    ]
}

setResolution(event) {
    event.preventDefault();
    let res = Number(document.getElementById('resolution_input').value)
    if (isNaN(res))
        return;

    let state = this.state;

    if (res % 16 === 0 && res > 0 && res <= 128)
        state.editor = state.editor.create(this.editor.app, res);

    this.setState(state);
}

    componentDidMount = () => {
        let ribbonContent = [];
        this.state.content.forEach(item => ribbonContent.push(document.getElementById(item.id)));

        document.addEventListener('click', (event) => {
            ribbonContent.forEach(obj => {
                if (!obj.parentElement.contains(event.target))
                    obj.classList.add('hidden');
            });
        });
    }

    render = () => {
        return (
            <div
                className='texture-editor-ribbon'
            >
                {this.state.content.map(menu => (
                    <div
                        key={menu.key}
                        className='ribbon-menu'
                    >
                        <div
                            className='ribbon-menu-button'
                            onClick={
                                () => {
                                    document.getElementById(menu.id).classList.toggle('hidden');
                                }
                            }
                        >
                            {menu.key}
                        </div>
                        {menu.value}
                    </div>
                ))}
            </div>
        )
    }

    constructor(props) {
        super(props);

        this.state.editor = props.editor;

        this.setResolution = this.setResolution.bind(this);
    }
}