// Player object with its position, movement, and shooting status
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

// game state variables
let bullets = [];
let enemies = [];
let enemyCount = 20;
let playerYMin = 600; // maximum y position the player can go
let gameOver = false;
let enemySpawnTimer = 0;
let spawnInterval = 120;
let minSpawnInterval = 30;
let spawnDecreaseRate = 0.01;
let maxEnemies = 30;
let score = 0;

// zombine animation frames
let zombieFrames = [];
let totalZombieFrames = 9;

// player animation frames
let playerFrames = [];
let totalPlayerFrames = 9;
let playerFrame = 0;
let playerFrameDelay = 0;
let playerShootImage;
let arrowImage;

// background image and tutorial visibility
let backgroundImg;
let showTutorial = true;

// preloads all the images for the game, player, zombie, arrows, and the background
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
}

// initializes the game, sets up the canvas, and player position
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

  // shows the score 
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);

  // show the controls at the beginning, goes away when first enemy is hit
  if (showTutorial) {
    textAlign(RIGHT, TOP);
    textSize(20);
    text("The Horde is coming, prepare yourself.\nUse arrow keys to move and space to shoot", width - 10, 10);
  }

  drawPlayer();
  movePlayer();

  // updates and draws the arrows
  for (let i = bullets.length - 1; i >= 0; i--) {
    drawBullet(bullets[i]);
    moveBullet(bullets[i]);
    if (bulletOffscreen(bullets[i])) {
      bullets.splice(i, 1);
    }
  }

  // updates and draws the zombies
  for (let i = enemies.length - 1; i >= 0; i--) {
    drawEnemy(enemies[i]);
    moveEnemy(enemies[i]);

    // constantly check for loss conditions, the zombies tought the player or pass them
    if (enemies[i].y > height) {
      gameOver = true;
    }

    if (enemies[i].y + 40 > player.y && enemies[i].x < player.x + 40 && enemies[i].x + 40 > player.x) {
      gameOver = true;
    }
  }

  // check for collisions between bullets and zombies
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

  // spawn new zombies at a set interval, and decrease the interval over time
  enemySpawnTimer++;
  if (enemySpawnTimer >= spawnInterval && enemies.length < maxEnemies) {
    spawnSingleEnemy();
    enemySpawnTimer = 0;

 // Gradually increase spawn rate by reducing interval more over time
 spawnInterval = max(minSpawnInterval, spawnInterval - spawnDecreaseRate);
 spawnDecreaseRate += spawnAcceleration; // Increase decrease rate over time
}  

// boundary line for the player movment limit
  stroke(255);
  line(0, playerYMin, width, playerYMin);

  if (player.shooting) {
    player.shootTimer--;
    if (player.shootTimer <= 0) {
      player.shooting = false;
    }
  }
}

// handles key presses for player movement and shooting
function keyPressed() {
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
  }
}
// handles key releases to stop movement, allows for smoother movement
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

// updates the player animation frame
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

// updates player position and constrains them within the boundaries
function movePlayer() {
  player.x += player.speed;
  player.x = constrain(player.x, 0, width - 40);
  player.y += player.vspeed;
  player.y = constrain(player.y, playerYMin, height - 40);
}

// creates arrow objects
function createBullet(x, y) {
  return {
    x: x,
    y: y,
    w: 20,
    h: 20
  };
}

// draws the arrows
function drawBullet(bullet) {
  image(arrowImage, bullet.x - bullet.w / 2, bullet.y - bullet.h / 2, bullet.w, bullet.h);
}

// moves the arrows up the screen
function moveBullet(bullet) {
  bullet.y -= 5;
}

// checks if the arrows are offscreen
function bulletOffscreen(bullet) {
  return bullet.y < 0;
}

// checks if the arrows hit the zombies
function bulletHitsEnemy(bullet, enemy) {
  let d = dist(bullet.x, bullet.y, enemy.x + 20, enemy.y + 20);
  return d < 20;
}

// spawns a single zombie at a random position, ensuring it doesn't overlap with existing zombies
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

// checks if the zombie position is valid, ensuring it doesn't overlap with existing zombies
function enemyPositionValid(x, y, minDist) {
  for (let enemy of enemies) {
    if (dist(x, y, enemy.x, enemy.y) < minDist) {
      return false;
    }
  }
  return true;
}

// draws enemy with the zombies animation frames
function drawEnemy(enemy) {
  image(zombieFrames[enemy.frame], enemy.x, enemy.y, 40, 51);

  enemy.frameDelay++;
  if (enemy.frameDelay >= 6) {
    enemy.frame = (enemy.frame + 1) % totalZombieFrames;
    enemy.frameDelay = 0;
  }
}

// moves teh zombies down the screen, slowing them down when they reach the player barrirer
function moveEnemy(enemy) {
  if (enemy.y + 40 >= playerYMin && !enemy.slowed) {
    enemy.slowed = true;
  }

  enemy.y += enemy.slowed ? 0.15 : 0.3;
}
