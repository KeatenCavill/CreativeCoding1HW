// player object with properties for position, direction, speed, and shooting state
let player = {
  x: 0,
  y: 0,
  xdir: 0,
  ydir: 0,
  speed: 0,
  vspeed: 0,
  shooting: false,
  shootTimer: 0
};

// game variables
let bullets = [];
let enemies = [];
let enemyCount = 20;
let playerYMin = 600;
let gameOver = false;
let enemySpawnTimer = -240; // delay first enemy spawn
let spawnInterval = 240; // slow initial spawn rate
let minSpawnInterval = 40;
let spawnDecreaseRate = 0.005; // slower spawn ramp-up
let maxEnemies = 20;
let score = 0;

let spawnAcceleration = 0.002;
let maxSpawnDecreaseRate = 2;

let zombieFrames = [];
let totalZombieFrames = 9;

let playerFrames = [];
let totalPlayerFrames = 9;
let playerFrame = 0;
let playerFrameDelay = 0;
let playerShootImage;
let arrowImage;
let backgroundImg;

let bgMusic;
let fireSound;
let lastFireSoundTime = -1000;

let showTutorial = true;

// preloads sounds and images, such as the player, zombies, background, music, and sound effects
function preload() {
  for (let i = 1; i <= totalZombieFrames; i++) {
    let numStr = nf(i);
    zombieFrames.push(loadImage("Assets/Zombie_walk/zombie_walk" + numStr + ".png"));
  }

  for (let i = 1; i <= totalPlayerFrames; i++) {
    let numStr = nf(i);
    playerFrames.push(loadImage("Assets/Player_walk/player_walk" + numStr + ".png"));
  }

  playerShootImage = loadImage("Assets/Player_walk/player_shoot.png");
  arrowImage = loadImage("Assets/Player_walk/player_arrow.png");
  backgroundImg = loadImage("Assets/background.png");

  bgMusic = loadSound("Assets/Music.mp3");
  fireSound = loadSound("Assets/Fire.mp3");
}

// sets up canvas and background along with player position
function setup() {
  createCanvas(1280, 700);
  player.x = width / 2;
  player.y = height - 50;
}

// main gameplay loop
function draw() {
  image(backgroundImg, 0, 0, width, height);

  // gameover screen
  if (gameOver) {
    fill(255);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("You Lose", width / 2, height / 2);
    textSize(32);
    text("Score: " + score, width / 2, height / 2 + 50);
    return;
  }

  // shows score in and tutorial text
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);

  if (showTutorial) {
    textAlign(RIGHT, TOP);
    textSize(20);
    text("The Horde is coming, prepare yourself.\nUse arrow keys to move and space to shoot", width - 10, 10);
  }

  drawPlayer();
  movePlayer();

  //draw and updates arrows
  for (let i = bullets.length - 1; i >= 0; i--) {
    drawBullet(bullets[i]);
    moveBullet(bullets[i]);
    if (bulletOffscreen(bullets[i])) {
      bullets.splice(i, 1);
    }
  }

  // draw and updates zombies
  for (let i = enemies.length - 1; i >= 0; i--) {
    drawEnemy(enemies[i]);
    moveEnemy(enemies[i]);

    // checks collision withh player or bottom of map-- lose conditions
    if (enemies[i].y > height ||
        (enemies[i].y + 40 > player.y && enemies[i].x < player.x + 40 && enemies[i].x + 40 > player.x)) {
      gameOver = true;
    }
  }
  // checks for collision between arrow and zombies
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bulletHitsEnemy(bullets[i], enemies[j])) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        score += 10;
        showTutorial = false;
        break;
      }
    }
  }

  // spawns enemies at a set interval, increases spawn rate over time
  enemySpawnTimer++;
  if (enemySpawnTimer >= spawnInterval && enemies.length < maxEnemies) {
    spawnSingleEnemy();
    enemySpawnTimer = 0;
    spawnInterval = constrain(spawnInterval - spawnDecreaseRate, minSpawnInterval, 9999);
    spawnDecreaseRate = min(spawnDecreaseRate + spawnAcceleration, maxSpawnDecreaseRate);
  }

  // draws the player boundary line
  stroke(255);
  line(0, playerYMin, width, playerYMin);

  // updates player shooting state and cooldown timer
  if (player.shooting) {
    player.shootTimer--;
    if (player.shootTimer <= 0) {
      player.shooting = false;
    }
  }
}

// input controls for player movement and shooting
function keyPressed() {
  // Start music on first interaction
  if (bgMusic && !bgMusic.isPlaying()) {
    bgMusic.setLoop(true);
    bgMusic.setVolume(0.5);
    bgMusic.play();
  }

  if (keyCode === RIGHT_ARROW) {
    player.speed = 5;
  } else if (keyCode === LEFT_ARROW) {
    player.speed = -5;
  } else if (keyCode === UP_ARROW) {
    player.vspeed = -5;
  } else if (keyCode === DOWN_ARROW) {
    player.vspeed = 5;
  } else if (key === ' ') {
    bullets.push(createBullet(player.x + 20, player.y));
    player.shooting = true;
    player.shootTimer = 10;

    if (millis() - lastFireSoundTime >= 500) { // shorter cooldown
      if (fireSound && fireSound.isLoaded()) {
        fireSound.setVolume(0.6);
        fireSound.play();
        lastFireSoundTime = millis();
      }
    }
  }
}

// stops player movement when key is released , allows for better/ soother feeling movment
function keyReleased() {
  if ((keyCode === RIGHT_ARROW && player.speed > 0) ||
      (keyCode === LEFT_ARROW && player.speed < 0)) {
    player.speed = 0;
  }
  if ((keyCode === UP_ARROW && player.vspeed < 0) ||
      (keyCode === DOWN_ARROW && player.vspeed > 0)) {
    player.vspeed = 0;
  }
}

// draws the player character, handles animation frames and shooting state
function drawPlayer() {
  if (player.shooting) {
    image(playerShootImage, player.x, player.y, 40, 51);
  } else {
    if (player.speed !== 0 || player.vspeed !== 0) {
      playerFrameDelay++;
      if (playerFrameDelay >= 6) {
        playerFrame = (playerFrame + 1) % totalPlayerFrames;
        playerFrameDelay = 0;
      }
    } else {
      playerFrame = 0;
      playerFrameDelay = 0;
    }
    image(playerFrames[playerFrame], player.x, player.y, 40, 51);
  }
}

// creates a boundary for the player to move within
function movePlayer() {
  player.x += player.speed;
  player.x = constrain(player.x, 0, width - 40);
  player.y += player.vspeed;
  player.y = constrain(player.y, playerYMin, height - 40);
}

// creates arrow 
function createBullet(x, y) {
  return {
    x: x,
    y: y,
    w: 20,
    h: 20
  };
}

// draws the arrow
function drawBullet(bullet) {
  image(arrowImage, bullet.x - bullet.w / 2, bullet.y - bullet.h / 2, bullet.w, bullet.h);
}

// moves the arrow up the screen
function moveBullet(bullet) {
  bullet.y -= 5;
}

// checks if the arrow is off the screen
function bulletOffscreen(bullet) {
  return bullet.y < 0;
}

// checks if the arrow hits a zombie
function bulletHitsEnemy(bullet, enemy) {
  let d = dist(bullet.x, bullet.y, enemy.x + 20, enemy.y + 20);
  return d < 20;
}

// spawns a single enemy at a random position, ensuring it doesn't overlap with existing enemies
function spawnSingleEnemy() {
  let x, y;
  let attempts = 0;
  let minDist = 50;
  do {
    x = random(0, width - 40);
    y = random(-300, -40);
    attempts++;
  } while (!enemyPositionValid(x, y, minDist) && attempts < 10);

  enemies.push({
    x: x,
    y: y,
    slowed: false,
    frame: int(random(totalZombieFrames)),
    frameDelay: 0
  });
}

// checks if the enemy position is valid (not overlapping with other enemies)
function enemyPositionValid(x, y, minDist) {
  for (let enemy of enemies) {
    if (dist(x, y, enemy.x, enemy.y) < minDist) {
      return false;
    }
  }
  return true;
}

// draws the enemy character, handles animation frames
function drawEnemy(enemy) {
  image(zombieFrames[enemy.frame], enemy.x, enemy.y, 40, 51);
  enemy.frameDelay++;
  if (enemy.frameDelay >= 6) {
    enemy.frame = (enemy.frame + 1) % totalZombieFrames;
    enemy.frameDelay = 0;
  }
}

// moves the enemy down the screen, slows down when it reaches player boundary
function moveEnemy(enemy) {
  if (enemy.y + 40 >= playerYMin && !enemy.slowed) {
    enemy.slowed = true;
  }

  enemy.y += enemy.slowed ? 0.15 : 0.3;
}

// fallback to play music on mouse click if needed
function mousePressed() {
  if (bgMusic && !bgMusic.isPlaying()) {
    bgMusic.setLoop(true);
    bgMusic.setVolume(0.5);
    bgMusic.play();
  }
}
