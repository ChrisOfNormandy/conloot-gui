/* eslint-disable react/prop-types */
import React from 'react';

import './styles/dropdown.css';

/**
 *
 * @param {*} param0
 * @returns
 */
export default function Dropdown({ content, closeFunction }) {
    return (
        <div
            className='dropdown-container'
        >
            <ul
                className='dropdown-list'
            >
                {
                    content.map((item, i) => (
                        <li
                            className='dropdown-item'
                            key={i}
                            onClick={
                                () => {
                                    item.onClick();
                                    closeFunction();
                                }
                            }
                            onContextMenu={
                                (e) => {
                                    if (!item.onContextMenu)
                                        return;

                                    e.preventDefault();

                                    item.onContextMenu();
                                    closeFunction();
                                }
                            }
                        >
                            <span
                                className='dropdown-item-text'
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