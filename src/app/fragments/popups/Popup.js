/* eslint-disable react/prop-types */
import React from 'react';

import './styles/popup.css';

/**
 *
 * @param {*} param0
 * @returns
 */
export function Popup({ title, body = null, onMinimize = () => { }, onClose = () => { } }) {
    return (
        <div
            className='popup-container'
        >
            <div
                className='popup-header'
            >
                <div
                    className='popup-header-title'
                >
                    {title}
                </div>

                <div>
                    <i
                        className='icon bi-collection popup-btn'
                        title='Collapse'
                        onClick={onMinimize}
                    />

                    <i
                        className='icon bi-x-lg popup-btn'
                        title='Close'
                        onClick={onClose}
                    />
                </div>
            </div>

            <div className='popup-body'>
                {body}
            </div>
        </div>
    );
}