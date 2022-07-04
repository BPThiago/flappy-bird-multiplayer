const MultiElements = {
    flappyBird: {
        spritesY: [ 
            0, 26, 52, 26
        ],
        spritesX: [0, 45],
        spriteY: 0,
        x: 60,
        width: 34,
        height: 24,
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
    }
}

export default MultiElements;