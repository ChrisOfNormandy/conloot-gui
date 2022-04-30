/* eslint-disable react/prop-types */
import React from 'react';
import Menu from '../menus/Menu';

import './styles/ribbon.css';

export default class Ribbon extends React.Component {
    componentDidMount() {
        // let ribbonContent = [];

        // this.state.content.forEach((item) => ribbonContent.push(document.getElementById(item.id)));

        // document.addEventListener('click', (event) => {
        //     ribbonContent.forEach((obj) => {
        //         if (!obj.parentElement.contains(event.target))
        //             obj.classList.add('hidden');
        //     });
        // });
    }

    render() {
        return (
            <div
                className='ribbon-container'
            >
                {
                    this.state.content.map((item, i) => (
                        <div
                            key={i}
                            id={item.id}
                            className='ribbon-item'
                            onClick={
                                () => {
                                    document.getElementById(`${item.id}_opt_${i}_menu`).classList.toggle('hidden');
                                }
                            }
                        >
                            <div
                                id={`${item.id}_opt_${i}_text`}
                                className='ribbon-item-text'
                            >
                                {item.text}
                            </div>

                            {
                                item.menuContent.length
                                    ? (
                                        <div
                                            id={`${item.id}_opt_${i}_menu`}
                                            className='ribbon-menu-wrapper hidden'
                                        >
                                            <Menu
                                                content={item.menuContent}
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

    constructor(props) {
        super(props);

        this.state = {
            /**
             * @type {{id: string, text: string, menuContent: JSX.Element}[]}
             */
            content: props.content
        };
    }
}