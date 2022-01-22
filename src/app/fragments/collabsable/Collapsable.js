/* eslint-disable react/prop-types */
import React from 'react';

import './styles/collapsable.css';

function GetContent(props) {
    return props.content();
}

function controller(controls) {
    if (controls === null)
        return console.error('Collapsable div was null.');
    controls.style.maxHeight = !controls.style.maxHeight
        ? controls.scrollHeight + 'px'
        : null;
}

/**
 *
 * @param {{id: string, content: JSX.Element}} param0
 * @returns
 */
export default function Collapsable({ id, content }) {
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
                        controller(container);
                    }
                }
            />
        </div>
    );
}