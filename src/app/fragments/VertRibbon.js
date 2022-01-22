import React from 'react';

import './styles/vert-ribbon.css';

export default class VertRibbon extends React.Component {
    render() {
        return (
            <div
                className='vert-ribbon-container'
            >
                <div
                    className='vert-ribbon-list'
                >
                    {this.state.content.map((v, i) => (
                        <div
                            className='vert-ribbon-list-item'
                            key={i}
                            id={v.key}
                        >
                            {v.data}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            // eslint-disable-next-line react/prop-types
            content: props.content || []
        };
    }
}