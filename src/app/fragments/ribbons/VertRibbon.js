/* eslint-disable react/prop-types */
import React from 'react';
import Dropdown from '../menus/Dropdown';

import './styles/vert-ribbon.css';

export default function VertRibbon({ content }) {
    return (
        <div
            className='vert-ribbon-container'
        >
            {
                content.map((item, i) => (
                    <div
                        key={i}
                        className='vert-ribbon-item'
                    >
                        <div
                            className='vert-ribbon-btn'
                            title={item.title}
                            onClick={
                                () => {
                                    document.getElementById(`${item.id}_opt_${i}_dropdown`).classList.toggle('hidden');
                                }
                            }
                            onContextMenu={
                                (e) => {
                                    e.preventDefault();

                                    document.getElementById(`${item.id}_opt_${i}_ctx_dropdown`).classList.toggle('hidden');
                                }
                            }
                        >
                            {
                                item.icon
                                    ? (
                                        <i
                                            className={`icon bi bi-${item.icon} vert-ribbon-icon`}
                                        />
                                    )
                                    : (
                                        <div
                                            className='vert-ribbon-text'
                                        >
                                            {item.text}
                                        </div>
                                    )
                            }
                        </div>

                        {
                            item.menuContent && item.menuContent.length
                                ? (
                                    <div
                                        id={`${item.id}_opt_${i}_dropdown`}
                                        className='vert-ribbon-dropdown-wrapper hidden'
                                    >
                                        <Dropdown
                                            content={item.menuContent}
                                            closeFunction={
                                                () => {
                                                    document.getElementById(`${item.id}_opt_${i}_dropdown`).classList.add('hidden');
                                                }
                                            }
                                        />
                                    </div>
                                )
                                : null
                        }

                        {
                            item.contextMenuContent && item.contextMenuContent.length
                                ? (
                                    <div
                                        id={`${item.id}_opt_${i}_ctx_dropdown`}
                                        className='vert-ribbon-dropdown-wrapper hidden'
                                    >
                                        <Dropdown
                                            content={item.contextMenuContent}
                                            closeFunction={
                                                () => {
                                                    document.getElementById(`${item.id}_opt_${i}_ctx_dropdown`).classList.add('hidden');
                                                }
                                            }
                                        />
                                    </div>
                                )
                                : null
                        }
                    </div>
                ))
            }
        </div>
    );
}