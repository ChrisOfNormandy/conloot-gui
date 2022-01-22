import React from 'react';

/**
 *
 * @param {*} param0
 * @returns
 */
// eslint-disable-next-line react/prop-types
export default function Menu({ id, content, hidden }) {
    const arr = content;

    return (
        <div
            id={id}
            className={`menu${hidden
                ? ' hidden'
                : ''}`}
        >
            {
                arr.map((item, i) => (
                    <div
                        className='menu-item'
                        key={i}
                    >
                        {item}
                    </div>
                ))
            }
        </div>
    );
}