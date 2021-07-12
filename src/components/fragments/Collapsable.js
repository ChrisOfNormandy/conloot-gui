import React from 'react';

import collapseController from '../../app/common/collapseController';

export default class Collapsable extends React.Component {

    state = {
        content: null,
        id: 'collapsable_container'
    };

    container;

    componentDidMount() {
        this.container = document.getElementById(this.state.id);
    }

    render = () => {
        return (
            <div
                className='collapsable-container-wrapper'
                onLoad={
                    () => {
                        let con = document.getElementById(this.state.id);
                        con.style.maxHeight = con.scrollHeight + 'px';
                    }
                }
            >
                <div 
                    className='collapsable-container-group container-group'
                    id={this.state.id}
                >
                    <this.state.content />
                </div>
                <div
                    className='collapsable-container-group-trigger'
                    onClick={
                        () => {
                            collapseController(this.container)
                        }
                    }
                />
            </div>
        )
    }

    constructor(props) {
        super(props);
        
        this.state.id = props.id;
        this.state.content = props.content;
    }
}