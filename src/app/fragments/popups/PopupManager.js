/* eslint-disable react/prop-types */
import React from 'react';

import { Popup } from './Popup';

import './styles/popup-manager.css';

export default class PopupManager extends React.Component {

    changeTab(name) {
        let state = this.state;

        state.openGroup = null;

        this.popupGroups.forEach((group) => {
            if (state.openGroup === null && group.name === name) {
                group.open = !group.open;

                if (group.open)
                    state.openGroup = group.name;
            }
            else {
                group.open = false;

                let flag = false;
                group.popups.forEach((popup) => {
                    if (popup.open)
                        flag = true;
                });
                if (!flag)
                    this.popupGroups.delete(group.name);
            }
        });

        this.setState(state);
    }

    render() {
        const groups = Array.from(this.popupGroups.values());

        const getPopups = (group) => Array.from(group.popups.values()).filter((v) => v.open);

        return (
            <div
                className='popup-manager-container'
            >
                <div
                    className='popup-manager-ribbon'
                >
                    <div
                        className='popup-tabs-container'
                    >
                        {
                            groups.map((group, i) => (
                                <div
                                    key={i}
                                    className='popup-tab-wrapper'
                                >
                                    <div
                                        className='popup-tab'
                                        onClick={
                                            () => {
                                                this.changeTab(group.name);
                                            }
                                        }
                                    >
                                        {group.name}
                                    </div>

                                    <div
                                        className='popup-tab-counter'
                                    >
                                        {group.popups.size}
                                    </div>

                                    {
                                        group.open
                                            ? (
                                                <div
                                                    className='popup-tab-group'
                                                >
                                                    <div
                                                        className='popup-collection'
                                                    >
                                                        {
                                                            getPopups(group).map((popup, i) => (
                                                                <Popup
                                                                    key={i}
                                                                    title={popup.title}
                                                                    body={popup.body}
                                                                    onMinimize={popup.onMinimize}
                                                                    onClose={popup.onClose}
                                                                />
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            )
                                            : null
                                    }
                                </div>
                            ))
                        }
                    </div>

                    <div
                        className='popup-manager-ribbon-controls'
                    >
                        <i
                            className='icon bi bi-dash-circle'
                        />

                        <i
                            className='icon bi bi-x-circle'
                        />
                    </div>

                </div>
            </div >
        );
    }

    constructor(props) {
        super(props);

        /**
         * @type {Map<string, *>}
         */
        this.popupGroups = props.map || new Map();

        this.state = {
            openGroup: null
        };

        this.changeTab = this.changeTab.bind(this);
    }
}