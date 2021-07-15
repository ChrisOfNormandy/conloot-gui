import React from 'react';

import './styles/floater.css';

function GetContent(props) {
    return props.content();
}

/**
 * 
 * @param {MouseEvent} event 
 * @param {{x: number, y: number} | null} moving 
 * @param {HTMLElement} container 
 * @returns 
 */
function move (event, moving, container) {
    if (moving === null)
        return;

    let x = event.clientX - moving.x;
    let y = event.clientY - moving.y;
    let bounds = container.getBoundingClientRect();
    let parentBounds = container.parentElement.getBoundingClientRect();

    if (x > parentBounds.left && x + bounds.width < parentBounds.right)
        container.style.left = `${x}px`;
    if (y > parentBounds.top && y + bounds.height < parentBounds.bottom)
        container.style.top = `${y}px`;
}

function _(props) {
    const id = props.id;
    const content = props.content;
    let moving = null;
    let container = document.getElementById(id);

    return (
        <div
            className='floater-container'
            id={id}
            onMouseDown={(event) => {
                let bounds = container.getBoundingClientRect();

                let mx = event.clientX - bounds.x;
                let my = event.clientY - bounds.y;

                if (my > 16)
                    return;

                moving = { x: mx, y: my };
            }}
            onMouseUp={() => {
                moving = null;
            }}
            onMouseMove={(event) => move(event, moving, container)}
        >
            <GetContent content={content} />
        </div>
    )
}

export default _;