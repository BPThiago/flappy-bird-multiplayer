const canvas = typeof(document) != 'undefined' ? document.querySelector('#game-canvas') : {width: 320, height: 480};

const uniqueElements = {
    initialLogo: {
        spriteX: 412,
        spriteY: 455,
        width: 200,
        height: 53,
        x: canvas.width / 2 - 200 / 2,
        y: 50,
    },

    singleMode: {
        spriteX: 394,
        spriteY: 614,
        width: 89,
        height: 31,
        x: canvas.width / 4 - 89 / 2,
        y: 250,
    },

    multiMode: {
        spriteX: 533,
        spriteY: 614,
        width: 98,
        height: 31,
        x: canvas.width * 3 / 4 - 98 / 2,
        y: 250,
    },

    madeBy: {
        spriteX: 437,
        spriteY: 683,
        width: 136,
        height: 12,
        x: canvas.width / 2 - 136 / 2,
        y: 410,
    },
    getReady: {
        spriteX: 134,
        spriteY: 0,
        width: 174,
        height: 152,
        x: canvas.width / 2 - 174 / 2,
        y: 50, 
    },
    scoreBoard: {
        score: 0,
    },
    gameOverSymbol: {
        sprites: [{
            spriteX: 153,
            spriteY: 153,
            width: 188,
            height: 38,
            x: canvas.width / 2 - 188 / 2
            },
        
            {
              spriteX: 175,
              spriteY: 379,
              width: 146,
              height: 46,
              x: canvas.width / 2 - 146 / 2
            }
          ],
          y: 45,
          toggleIndex: 0,
    },
    gameOverTable: {
        spriteX: 134,
        spriteY: 197,
        width: 226,
        height: 116,
        x: canvas.width / 2 - 226 / 2,
        y: 94,
    },
    gameOvertoMenu: {
        spriteX: 139,
        spriteY: 326,
        width: 82,
        height: 28,
        x: canvas.width / 4 - 82 / 2,
        y: 223,
    },
    gameOvertoStart: {
        spriteX: 272,
        spriteY: 326,
        width: 82,
        height: 28,
        x: canvas.width * 3 / 4 - 82 / 2,
        y: 223,
    },
    medal: {
        sprites: {
            gold: {spriteX: 0, spriteY: 124},
            silver: {spriteX: 48, spriteY: 78},
            bronze: {spriteX: 48, spriteY: 124},
            default: {spriteX: 0, spriteY: 78},
        },
        spriteX: 0,
        spriteY: 78,
        width: 44,
        height: 44,
        x: canvas.width / 4 - 8,
        y: 138,
    },
    finalScore: {
        bestScore: 0,
    },
    ground: {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
    },
    background: {
        spriteX: 390,
        spriteY: 0,
        width: 275,
        height: 204,
        x: 0,
        y: canvas.height - 204,
    },
    lobbyDetails: {
        minPlayers: 2,
        spriteX: 282,
        spriteY: 647,
        width: 28,
        height: 28,
        x: 10,
        y: 20,
    },
    finalCountdown: {
        numbers: {
            0: {spriteX: 383, width: 24},
            1: {spriteX: 411, width: 16},
            2: {spriteX: 431, width: 24},
            3: {spriteX: 459, width: 24},
            4: {spriteX: 487, width: 24},
            5: {spriteX: 515, width: 24},
            6: {spriteX: 543, width: 24},
            7: {spriteX: 571, width: 24},
            8: {spriteX: 599, width: 24},
            9: {spriteX: 627, width: 24},
          },
        spriteX: 383,
        spriteY: 248,
        width: 24,
        height: 36,
        count: 5,
    }
}

export default uniqueElements;