import React from 'react';

import './styles/context-menu.css';

export default class ContextMenu extends React.Component {

    componentDidMount() {
        const menu = document.getElementById('context_menu');
        if (menu === null)
            return;

        menu.style.top = this.state.position.y + 'px';
        menu.style.left = this.state.position.x + 'px';
    }

    render() {
        return this.state.menuItems.length > 0
            ? (
                <ul
                    id='context_menu'
                    className='context-menu'
                >
                    {this.state.menuItems.map((v, i) => (
                        <li
                            key={i}
                            className='context-menu-item'
                            onClick={
                                () => {
                                    v.action();
                                    this.setState(this.state);
                                }
                            }
                        >
                            {v.markup}
                        </li>
                    ))}
                </ul>
            )
            : null;
    }

    constructor(props) {
        super(props);

        // eslint-disable-next-line react/prop-types
        console.log('New context menu.', props.menuItems.length);

        this.state = {
            // eslint-disable-next-line react/prop-types
            position: props.position,
            // eslint-disable-next-line react/prop-types
            menuItems: props.menuItems || []
        };
    }
}