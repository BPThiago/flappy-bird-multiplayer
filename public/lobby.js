import extendedElements from "./gameDefault/extendedElements.js";
import uniqueElements from "./gameDefault/uniqueElements.js";
export default function createGame() {
    let players = {}; let observers = []; let startCount = false; let regressive = 5;
    const minUsers = uniqueElements.lobbyDetails.minPlayers; const pairs = []; let countInterval;

    function newRoom() {
        for (let observer of observers) {
            addPlayer(observer)
        }
        observers.length = 0;
    }

    function addObserver(id) {
        observers.push(id);
    }

    function addPlayer(id) {
        if (!players[id]) {
        players[id] = {
            y: extendedElements.flappyBird.y,
            speed: extendedElements.flappyBird.speed,
            }
        }
    }

    function getPlayersNumber() {
        return {players: Object.keys(players).length, observers: observers.length}
    }

    function isUserPlayer(id) {
        return id in players;
    }

    function isUserObserver(id) {
        return observers.includes(id);
    }

    function isUserMultiplayer(id) {
        return isUserPlayer(id) || isUserObserver(id);
    }

    function removeMultiplayerUser(id) {
        if (isUserPlayer(id)) {
            delete players[id]
        }
        if (isUserObserver(id)) {
            observers.splice(observers.indexOf(id), 1)
        }
    }

    function toggleStartCount(io, newValue) {
        regressive = 5;
        startCount = newValue
        io.to('multiplayer').emit('start count', startCount, regressive)
    }
    
    function count(io) {
        if (observers.length >= minUsers && Object.keys(players).length == 0 && !startCount) {
            toggleStartCount(io, true);
            if (countInterval) clearInterval(countInterval)
            countInterval = setInterval(() => {
                if (!startCount) {
                    clearInterval(countInterval)   
                    io.to('multiplayer').emit('start count', startCount, regressive);                     
                } else {
                    --regressive;
                    io.to('multiplayer').emit('start count', startCount, regressive);
                    if (regressive === 0) {
                        clearInterval(countInterval)
                        toggleStartCount(io, false);
                        newRoom();
                        io.to('multiplayer').emit('on game', players);
                        movePlayer(io);
                    }
                }
            }, 1000);
        }
    }

    function genPair() {
        if (Object.keys(players).length > 0) {
            pairs.push({
                x: 320,
                y: Math.floor(Math.random() * (-150 + 300) + -300)
            })
        }
    }

    function movePair() {
        const width = extendedElements.pipes.width;
        pairs.forEach(
            pair => {
                pair.x -= 2;
            
                if (pair.x + width <= 0) {
                    pairs.shift()
                }
            }
        )
    }

    function checkForPairCollision(flappyBird) {
        const fBDimensions = {
            x: extendedElements.flappyBird.x,
            width: extendedElements.flappyBird.width,
            height: extendedElements.flappyBird.height,
        }
        const pDimensions = {
            width: extendedElements.pipes.width,
            height: extendedElements.pipes.height,
        }
        for (let pair of pairs) {
            if (fBDimensions.x + fBDimensions.width >= pair.x && fBDimensions.x <= pair.x + pDimensions.width && (flappyBird.y <= pair.y + pDimensions.height || flappyBird.y + fBDimensions.height >= 110 + pDimensions.height + pair.y)) {
                return true
            }
        }
        return false
    }

    function deletePairs() {
        pairs.length = 0;
    }

    function movePlayer(io) {
        const gravity = 0.25;
        const flappyBirdHeight = extendedElements.flappyBird.height;
        const groundY = uniqueElements.ground.y;
        let frames = 0;
        const interval = setInterval(() => {
            if (Object.keys(players).length === 0) {
                io.emit('new player', getPlayersNumber())
                clearInterval(interval)
                deletePairs();

                if (observers.length >= minUsers) {
                    count(io)
                }
                return
            }
            movePair()
            for (const player in players) {
                const playerObj = players[player]

                if (checkForPairCollision(playerObj)) {
                    io.to(player).emit('lose', Object.keys(players).length)
                    removeMultiplayerUser(player);
                    io.to('multiplayer').emit('ryu punch')
                } else if ((playerObj.y + flappyBirdHeight) < groundY) {
                    playerObj.speed += gravity;
                    playerObj.y += playerObj.speed;
                } else {
                    io.to(player).emit('lose', Object.keys(players).length)
                    removeMultiplayerUser(player);
                    io.to('multiplayer').emit('ryu punch')
                }
            }

                if (frames % 134 == 0) {
                    genPair()
                }

                io.to('multiplayer').emit('update speed', players, pairs)

                ++frames;
            }, 
        1000 / 60);
    };

    return {players, observers, isUserMultiplayer, toggleStartCount, count, removeMultiplayerUser, addObserver, getPlayersNumber};
}