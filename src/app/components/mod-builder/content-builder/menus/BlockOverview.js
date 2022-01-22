import React from 'react';

export default class BlockPreview extends React.Component {
    render() {
        return (
            <div className='block-preview-container'>
                <div
                    className='block-preview'
                    id='block_preview'
                >
                    {this.state.sides.map((side, i) => (<div className={`block-side bS-${i}`} key={i} />))}
                </div>
            </div>
        )
    }

    constructor(props) {
        super(props);

        this.state = {
            sides: []
        };

        for (let i = 0; i < 6; i++) {
            this.state.sides[i] = { face: i, texture: null };
        }
    }
}