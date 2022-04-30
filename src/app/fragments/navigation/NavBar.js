import React from 'react';

import './styles/nav-bar.css';

export default class NavBar extends React.Component {
    render() {
        return (
            <ul className='nav-bar'>
                {this.state.buttons.map((btn, i) => (
                    <li
                        className='nav-bar-button'
                        id={btn.id + '_btn'}
                        key={i}
                        onClick={
                            (e) => {
                                btn.action(e);
                            }
                        }
                    >
                        {btn.value}
                    </li>
                ))}
            </ul>
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            // eslint-disable-next-line react/prop-types
            buttons: props.buttons || []
        };
    }
}