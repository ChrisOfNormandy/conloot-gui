import React from 'react';

export default class BlockPreview extends React.Component {
    render() {
        return (
            <div
                className='block-preview-container'
            >
                <div
                    id='block_preview'
                    className='block-preview'
                >
                    {
                        this.state.sides.map((side, i) =>
                            <div
                                key={i}
                                className={`block-side bS-${i}`}
                            />
                        )
                    }
                </div>
            </div>
        );
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