export class Mouse {
    /**
     *
     * @returns
     */
    displacement() {
        return {
            x: this.position.old.x === null
                ? 0
                : this.position.x - this.position.old.x,
            y: this.position.old.y === null
                ? 0
                : this.position.y - this.position.old.y
        };
    }

    /**
     *
     * @param {*} offset
     * @returns
     */
    getPosition(offset = null) {
        return offset === null
            ?
            {
                x: this.position.x,
                y: this.position.y
            }
            :
            {
                x: this.position.x - offset.x,
                y: this.position.y - offset.y
            };
    }

    constructor() {
        this.position = {
            x: 0,
            y: 0,
            old: { x: 0, y: 0 },
            document: {
                x: 0, y: 0
            }
        };

        this.button = {
            state: false,
            id: 0,
            origin: { x: null, y: null }
        };

        this.inBounds = false;
        this.moving = false;
        this.clicked = false;
    }
}

const mouse = new Mouse();

export default mouse;