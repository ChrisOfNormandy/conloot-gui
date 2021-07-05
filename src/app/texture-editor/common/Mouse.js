const mouse = {
    position: {
        x: 0,
        y: 0,
        old: { x: 0, y: 0 }
    },
    button: {
        state: false,
        id: 0,
        origin: { x: null, y: null }
    },
    displacement: () => {
        return {
            x: mouse.position.old.x === null ? 0 : mouse.position.x - mouse.position.old.x,
            y: mouse.position.old.y === null ? 0 : mouse.position.y - mouse.position.old.y
        }
    },
    getPosition: (offset = null) => {
        return offset === null
        ?
        {
            x: mouse.position.x,
            y: mouse.position.y
        }
        :
        {
                x: mouse.position.x - offset.x,
                y: mouse.position.y - offset.y
        }
    },
    inBounds: false,
    moving: false,
    clicked: false
};

module.exports = mouse;