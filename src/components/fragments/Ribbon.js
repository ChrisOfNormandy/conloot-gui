import React from 'react';

import './styles/ribbon.css';

export default class Ribbon extends React.Component {
    componentDidMount() {
        let ribbonContent = [];

        this.state.content.forEach(item => ribbonContent.push(document.getElementById(item.id)));

        document.addEventListener('click', (event) => {
            ribbonContent.forEach(obj => {
                if (!obj.parentElement.contains(event.target))
                    obj.classList.add('hidden');
            });
        });
    }

    render() {
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

    /**
     * 
     * @param {{content: {key: string, value: JSX, id: string}[]}} props Value should be JSX or string.
     */
    constructor(props) {
        super(props);

        this.state = {
            content: props.content
        };
    }
}