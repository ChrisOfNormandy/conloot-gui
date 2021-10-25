import React from "react";

import './popup.css';

export default class PopUp extends React.Component {

    render() {
        return (
            <div
                className='popup-container'
            >
                <div className='popup-header'>
                    <div className='popup-header-title'>
                        {this.state.title}
                    </div>

                    <i
                        className='icon bi-collection popup-btn'
                        title='Collapse'
                        onClick={this.state.minimizeEvent}
                    />

                    <i
                        className='icon bi-x-lg popup-btn'
                        title='Close'
                        onClick={this.state.closeEvent}
                    />
                </div>

                <div className='popup-body'>
                    {this.state.body}
                </div>
            </div>
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            closeEvent: props.closeEvent,
            minimizeEvent: props.minimizeEvent,
            title: props.title || null,
            body: props.body || null
        }
    }
}