import {hitSound, jumpSound, fallSound, addScoreSound} from './assets/sounds/gameEffects.js';
import uniqueElements from './gameDefault/uniqueElements.js';
import extendedElements from './gameDefault/extendedElements.js';
import MultiElements from './gameDefault/multiElements.js';

let frames = 0; let players = {}; let pairs = [];
let startCount = false; let multiUsersQtd = {players: 0, observers: 0}; var socket = io();

if (localStorage.getItem('ranking') === null) {
  localStorage.setItem("ranking", JSON.stringify(
    {first: -1, second: -1, third: -1}
  ));
}

socket.on('start count', (willStart, count) => {
  startCount = willStart;
  regressive = count;
})

socket.on('active users', (activeusers) => {
  document.getElementById('user-count').textContent = '|Online: ' + activeusers + '|';
})

socket.on('new player', (qtdUsers) => {
  multiUsersQtd = Object.assign({}, qtdUsers)
  document.getElementById('player-count').textContent = 'Multiplayer: ' + (multiUsersQtd.players + multiUsersQtd.observers) + '|'; 
})

socket.on('on game', (p) => {
  Object.assign(players, p)
  changeScreen(Screens.inGameMulti)
})

socket.on('jump', (id) => {
  players[id].speed = -multiFlappyBird.jumpValue;
})

socket.on('update speed', (pl, pa) => {
  players = Object.assign({}, pl)
  pairs = pa
})

socket.on('lose', (ranking) => {
  gameOverSymbol.toggleIndex = ranking == 1 ? 1 : 0;

  changeScreen(Screens.afterCollisionMulti);

  socket.emit('lose')
})

socket.on('ryu punch', () => {
  hitSound.play();
})


const sprites = new Image();
sprites.src = './assets/images/sprites.png';

const canvas = document.querySelector('#game-canvas')
const context = canvas.getContext('2d');


let flappyBird = {
  ...extendedElements.flappyBird,
  draw() {
    const spriteY = this.spritesY[this.spriteIndex]
    if (frames % 15 == 0) {
      this.spriteIndex = (this.spriteIndex + 1) % this.spritesY.length
    }
    if (this.speed > 6 && this.speed < 6.4) {
      fallSound.play();
      fallSound.volume = 0.2;
    }

    context.drawImage(
      sprites,
      this.spriteX, spriteY,
      this.width, this.height, 
      this.x, this.y, 
      this.width, this.height, 
    )
  },
  jump() {
    jumpSound.play()
    jumpSound.currentTime = 0
    flappyBird.speed = -flappyBird.jumpValue;
  },
  update() {
    if ((flappyBird.y + flappyBird.height) < ground.y) {
      this.speed = this.speed + this.gravity
      flappyBird.y = flappyBird.y + this.speed
    } else {
      hitSound.play();
      changeScreen(Screens.afterCollision);
    }
  }
}

const multiFlappyBird = {
  ...MultiElements.flappyBird,
  draw() {
    const spriteY = this.spritesY[this.spriteIndex]
    if (frames % 15 == 0) {
      this.spriteIndex = (this.spriteIndex + 1) % this.spritesY.length
    }
    for (const playerId in players) {
      context.drawImage(
        sprites,
        this.spritesX[1], spriteY,
        this.width, this.height, 
        this.x,
        players[playerId].y, 
        this.width, this.height, 
      )
    }

    if (players[socket.id]) {
      context.drawImage(
        sprites,
        this.spritesX[0], spriteY,
        this.width, this.height, 
        this.x,
        players[socket.id].y,
        this.width, this.height, 
      )
    }
  },
  jump() {
    socket.emit('jump');
    jumpSound.play()
    jumpSound.currentTime = 0
  },
}

const pipes = {
  ...extendedElements.pipes,

  draw() {
    this.pairs.forEach(pair => {
    const pipeLocation = pair.y;
    
    const pipeSpacing = 110;

    pair.underPipe = {
      x: pair.x,
      y: this.height + pipeLocation + pipeSpacing,
    }

    context.drawImage(
      sprites,
      this.under.spriteX, this.under.spriteY,
      this.width, this.height,
      pair.underPipe.x, pair.underPipe.y,
      this.width, this.height
    )

    pair.overPipe = {
      x: pair.x,
      y: pipeLocation,
    }


    context.drawImage(
      sprites,
      this.over.spriteX, this.over.spriteY,
      this.width, this.height,
      pair.overPipe.x, pair.overPipe.y,
      this.width, this.height      
    )

    });
  },

  update() {
    if (frames % 120 == 0 ) {
      this.pairs.push({
        x: canvas.width,
        y: Math.floor(Math.random() * (-150 + 300) + -300),
      })
    }

    this.pairs.forEach(pair => {
      pair.x = pair.x - 2;

      if (flappyBird.x + flappyBird.width >= pair.x && flappyBird.x <= pair.x + this.width && (flappyBird.y <= pair.overPipe.y + this.height || flappyBird.y + flappyBird.height >= pair.underPipe.y)) {
        hitSound.play();
        changeScreen(Screens.afterCollision);
      }

      if (pair.x + this.width <= 0) {
        this.pairs.shift()
      }
    })
  }
}

const multiPipes = {
  ...MultiElements.pipes,

  draw() {
    pairs.forEach(pair => {
      const pipeLocation = pair.y;

      const pipeSpacing = 110;

      pair.underPipe = {
        x: pair.x,
        y: this.height + pipeLocation + pipeSpacing,
      }

      context.drawImage(
        sprites,
        this.under.spriteX, this.under.spriteY,
        this.width, this.height,
        pair.underPipe.x, pair.underPipe.y,
        this.width, this.height
      );

      pair.overPipe = {
        x: pair.x,
        y: pipeLocation,
      }

      context.drawImage(
        sprites,
        this.over.spriteX, this.over.spriteY,
        this.width, this.height,
        pair.overPipe.x, pair.overPipe.y,
        this.width, this.height
      )
    });
  }
};

const initialLogo = {
  ...uniqueElements.initialLogo,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height 
    )
  }
}

const singleMode = {
  ...uniqueElements.singleMode,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height 
    )
  }
}

const multiMode = {
  ...uniqueElements.multiMode,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height 
    )
  }
}

const madeBy = {
  ...uniqueElements.madeBy,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height 
    )
  }
}

const getReady = {
  ...uniqueElements.getReady,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height, 
    )
  }
}

let scoreBoard = {
  ...uniqueElements.scoreBoard,
  draw() {
    context.font = '25px "Press Start 2P"';
    context.textAlign = 'right'
    context.fillStyle = 'white'
    context.fillText(this.score, canvas.width - 10, 40)
  },
  update() {
    if (pipes.pairs.length>0 && flappyBird.x + flappyBird.width > pipes.pairs[0].x + multiFlappyBird.width) {
      if (pipes.pairs[0] !== this.lastPipe) {
        addScoreSound.volume = 0.8
        addScoreSound.play()
        this.score = this.score + 1
        this.lastPipe = pipes.pairs[0]
      } 
    };
  },
  multiUpdate() {
    if (pairs.length > 0 && multiFlappyBird.x + multiFlappyBird.width === pairs[0].x) {
      addScoreSound.volume = 0.8;
      addScoreSound.play();
      this.score = this.score + 1
    }
  }
};

const gameOverSymbol = {
  ...uniqueElements.gameOverSymbol,

  draw() {
    context.drawImage(
      sprites,
      this.sprites[this.toggleIndex].spriteX, this.sprites[this.toggleIndex].spriteY,  //Início X e Y
      this.sprites[this.toggleIndex].width, this.sprites[this.toggleIndex].height, // Se estica quanto (Tamanho do recorte)
      this.sprites[this.toggleIndex].x, this.y, //Posição inicial
      this.sprites[this.toggleIndex].width, this.sprites[this.toggleIndex].height, 
    )
  }

}

const gameOverTable = {
  ...uniqueElements.gameOverTable,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height, 
    )
  }
}

const gameOvertoMenu = {
  ...uniqueElements.gameOvertoMenu,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height, 
    )
  }
}

const gameOvertoStart = {
  ...uniqueElements.gameOvertoStart,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height, 
    )
  }
}

const medal = {
  ...uniqueElements.medal,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height, 
    )
  }
}


const finalScore = {
  ...uniqueElements.finalScore,
  draw() {
    context.font = '15px "Press Start 2P"';
    context.textAlign = 'right'
    context.fillStyle = 'white'
    context.fillText(scoreBoard.score, canvas.width*3/4 + 12, 143)

    context.font = '15px "Press Start 2P"';
    context.textAlign = 'right'
    context.fillStyle = 'white'
    context.fillText(this.bestScore, canvas.width*3/4 + 12, 184)
  },

  setRanking() {
    let ranking = JSON.parse(localStorage.getItem('ranking'))
    if (scoreBoard.score > ranking.first) {
      ranking.first = scoreBoard.score
      medal.spriteX = medal.sprites.gold.spriteX
      medal.spriteY = medal.sprites.gold.spriteY
    } else if (scoreBoard.score > ranking.second) {
      ranking.second = scoreBoard.score
      medal.spriteX = medal.sprites.silver.spriteX
      medal.spriteY = medal.sprites.silver.spriteY
    } else if (scoreBoard.score > ranking.third) {
      ranking.third = scoreBoard.score
      medal.spriteX = medal.sprites.bronze.spriteX
      medal.spriteY = medal.sprites.bronze.spriteY
    } else {
      medal.spriteX = medal.sprites.default.spriteX
      medal.spriteY = medal.sprites.default.spriteY
    }
    this.bestScore = ranking.first
    localStorage.setItem('ranking', JSON.stringify(ranking))
  }
}

let ground = {
  ...uniqueElements.ground,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      canvas.width, this.height, 
    );
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      canvas.width + this.x, this.y, //Posição inicial
      canvas.width, this.height, 
    );
  },
  update() {
    this.x = (this.x - 1) % canvas.width
  }
}

const background = {
  ...uniqueElements.background,
  draw() {
    context.fillStyle = '#71C5CF';
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      canvas.width, this.height, 
    )
  }
}

const lobbyDetails = {
  ...uniqueElements.lobbyDetails,
  draw() {
    context.font = '25px "Press Start 2P"';
    context.textAlign = 'right'
    context.fillStyle = 'crimson'
    context.fillText(`${multiUsersQtd.observers}/${this.minPlayers}`, canvas.width - 10, 40)

    context.fillStyle = 'green'
    context.fillText(`${multiUsersQtd.players}`, canvas.width - 10, 80)
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      this.x, this.y, //Posição inicial
      this.width, this.height, 
    )
  }
}

let finalCountdown = {
  ...uniqueElements.finalCountdown,
  draw() {
    this.spriteX = this.numbers[this.count].spriteX
    this.width = this.numbers[this.count].width

    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,  //Início X e Y
      this.width, this.height, // Se estica quanto (Tamanho do recorte)
      canvas.width / 2 - this.width / 2, canvas.height /2  - this.height /2, //Posição inicial
      this.width, this.height, 
    )
  }
}



const Screens = {
  chooseMode: {
    startProps() {
      flappyBird = Object.assign(flappyBird, extendedElements.flappyBird);
      pipes.pairs = []
    },

    draw() {
      background.draw();
      ground.draw();
      initialLogo.draw();
      madeBy.draw();
      singleMode.draw();
      multiMode.draw();
      flappyBird.draw();
    },

    update() {
      ground.update();
    },

    areaClick(event) {
      if (calcAreatoClick(event, singleMode.x, singleMode.y, singleMode.width, singleMode.height)){
        changeScreen(Screens.start)
      } else if (calcAreatoClick(event, multiMode.x, multiMode.y, multiMode.width, multiMode.height)){
        changeScreen(Screens.lobbyRoom)
      }
    }
  },

  lobbyRoom: {
    startProps() {
      socket.emit('new player')
    },
    draw() {
      background.draw();
      ground.draw();
      lobbyDetails.draw();
      flappyBird.draw();
      if (startCount) {
        finalCountdown.draw()
      }
    },
    update() {
      ground.update();
    },
    areaClick(event) {
      if (calcAreatoClick(event, lobbyDetails.x, lobbyDetails.y, lobbyDetails.width, lobbyDetails.height)) {
        socket.emit('new player')
        changeScreen(Screens.chooseMode)
      }
    }
  },

  start: {
    startProps() {
      flappyBird = Object.assign(flappyBird, extendedElements.flappyBird);
      pipes.pairs = []
    },

    draw() {
      background.draw();
      ground.draw()
      getReady.draw();
      flappyBird.draw();
    },
    update() {
      ground.update();
    },

    click() {
      changeScreen(Screens.inGame)
    }
  },

  inGame: {
    startProps() {
      scoreBoard = Object.assign(scoreBoard, uniqueElements.scoreBoard);
    },

    draw() {
      background.draw();
      pipes.draw();
      ground.draw();
      scoreBoard.draw();
      flappyBird.draw();
    },
    update() {
      ground.update();
      flappyBird.update();
      scoreBoard.update();
      pipes.update();
    },
    click() {
      flappyBird.jump();
    }
  },

  inGameMulti: {
    startProps() {
      scoreBoard = Object.assign(scoreBoard, uniqueElements.scoreBoard);
      pairs.length = 0;
    },
    draw() {
      background.draw();
      ground.draw();
      multiPipes.draw();
      scoreBoard.draw();
      multiFlappyBird.draw();
    },

    update() {
      ground.update();
      scoreBoard.multiUpdate();
    },

    click() {
      multiFlappyBird.jump();
    }
  },

  afterCollision: {
    startProps() {
      finalScore.setRanking();
      gameOverSymbol.toggleIndex = 0;
    },

    draw() {
      gameOverSymbol.draw();
      gameOverTable.draw();
      medal.draw();
      finalScore.draw();
      gameOvertoMenu.draw();
      gameOvertoStart.draw();
    },
    update() {
      return
    },
    areaClick(event) {
      if (calcAreatoClick(event, gameOvertoMenu.x, gameOvertoMenu.y, gameOvertoMenu.width, gameOvertoMenu.height)) {
        changeScreen(Screens.chooseMode)
      } else if (calcAreatoClick(event, gameOvertoStart.x, gameOvertoStart.y, gameOvertoStart.width, gameOvertoStart.height)) {
        changeScreen(Screens.start)
      }
    }
  },
  afterCollisionMulti: {
    startProps() {
      finalScore.setRanking();
    },
    
    draw() {
      gameOverSymbol.draw();
      gameOverTable.draw();
      medal.draw();
      finalScore.draw();
      gameOvertoMenu.draw();
      gameOvertoStart.draw();
    },
    update() {
      return
    },
    areaClick(event) {
      if (calcAreatoClick(event, gameOvertoMenu.x, gameOvertoMenu.y, gameOvertoMenu.width, gameOvertoMenu.height)) {
        changeScreen(Screens.chooseMode)
      } else if (calcAreatoClick(event, gameOvertoStart.x, gameOvertoStart.y, gameOvertoStart.width, gameOvertoStart.height)) {
        changeScreen(Screens.lobbyRoom)
      }
    }
  }
}

function changeScreen(newScreen) {
  activeScreen = newScreen

  if(activeScreen.startProps) {
    activeScreen.startProps()
  }
}

let activeScreen = Screens.chooseMode

function calcAreatoClick(event, x, y, width, height) {
  const eventX = event.offsetX;
  const eventY = event.offsetY;
  return (eventX >= x && eventX <= x + width && eventY >= y && eventY <= y + height)

}

function loop() {
  activeScreen.draw();
  activeScreen.update();
  requestAnimationFrame(loop);
  frames = frames + 1;
}

canvas.addEventListener('click',
  (e) => {
    e.preventDefault();
    if(activeScreen.click) {
      activeScreen.click()
    }
    if(activeScreen.areaClick) {
      activeScreen.areaClick(e)
    }
  }
)

loop();