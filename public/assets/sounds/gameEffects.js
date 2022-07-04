const hitSound = new Audio();

hitSound.src = 'assets/sounds/effects/hit.wav'

const jumpSound = new Audio();
jumpSound.src = 'assets/sounds/effects/jump.wav'

const fallSound = new Audio();
fallSound.src = 'assets/sounds/effects/fall.wav'

const addScoreSound = new Audio();
addScoreSound.src = 'assets/sounds/effects/addScore.wav'

export {hitSound, jumpSound, fallSound, addScoreSound};