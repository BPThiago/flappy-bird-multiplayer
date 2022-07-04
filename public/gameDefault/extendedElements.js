const extendedElements = {
    flappyBird: {
        spritesY: [ 
            0, 26, 52, 26
        ],
        spriteX: 0,
        spriteY: 0,
        width: 34,
        height: 24,
        x: 60,
        y: 120,
        speed: 0,
        gravity: 0.2,
        jumpValue: 4.6,
        spriteIndex: 0,
    },
    pipes: {
        under: {
            spriteX: 0,
            spriteY: 169,
        },
        over: {
            spriteX: 52,
            spriteY: 169,
        },
        width: 52,
        height: 400,
        pairs: [],
    }
}

export default extendedElements;