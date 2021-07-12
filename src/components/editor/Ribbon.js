import React from 'react';

import Menu from '../Menu';

import './css/ribbon.css';

export default class Ribbon extends React.Component {

    editor;

    setResolution(event) {
        event.preventDefault();
        let res = Number(document.getElementById('resolution_input').value)
        if (isNaN(res))
            return;

        if (res % 16 === 0 && res > 0 && res <= 128)
            this.editor = this.editor.create(this.editor.app, res);
    }

    content = [
        {
            key: "File",
            id: 'file_menu',
            value: (<Menu
                content={[
                    (<div
                        className='menu-button'
                        onClick={
                            () => this.editor.compose()
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
                                    this.editor.debug = event.target.checked;
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
                            () => this.editor.clear()
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
                                    this.editor.showGrid = !this.editor.showGrid;
                                    this.editor.refresh = true;
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
    ];

    componentDidMount = () => {
        let ribbonContent = [];
        this.content.forEach(item => ribbonContent.push(document.getElementById(item.id)));

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
                {this.content.map(menu => (
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

        this.editor = props.editor;

        this.setResolution = this.setResolution.bind(this);
    }
}