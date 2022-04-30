/* eslint-disable react/prop-types */
import React from 'react';

import './styles/menu.css';

/**
 *
 * @param {*} param0
 * @returns
 */
export default function Menu({ content }) {
    return (
        <div
            className='menu-container'
        >
            <ul
                className='menu-list'
            >
                {
                    content.map((item, i) => (
                        <li
                            className='menu-item'
                            key={i}
                            onClick={item.onClick}
                        >
                            <span
                                className='menu-item-text'
                            >
                                {item.text}
                            </span>

                            {item.body || null}
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}