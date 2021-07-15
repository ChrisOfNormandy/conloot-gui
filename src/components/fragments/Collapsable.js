import React from 'react';

import './styles/collapsable.css';

import collapseController from '../../app/common/collapseController';

function GetContent(props) {
    return props.content();
}

function _(props) {
    const id = props.id;
    const content = props.content;
    let container = document.getElementById(id);

    return (
        <div
            className='collapsable-container-wrapper'
            onLoad={
                () => {
                    let con = document.getElementById(id);
                    con.style.maxHeight = con.scrollHeight + 'px';
                }
            }
        >
            <div 
                className='collapsable-container-group container-group'
                id={id}
            >
                <GetContent content={content} />
            </div>
            <div
                className='collapsable-container-group-trigger'
                onClick={
                    () => {
                        collapseController(container)
                    }
                }
            />
        </div>
    )
}

export default _;