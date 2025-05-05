let player = {
  x: 0,
  y: 0,
  xdir: 0,
  ydir: 0,
  speed: 0,
  vspeed: 0
};

let bullets = [];
let enemies = [];
let enemyCount = 20;
let playerYMin = 600;
let gameOver = false;
let enemySpawnTimer = 0;
let spawnInterval = 120;
let minSpawnInterval = 30;
let spawnDecreaseRate = 0.01;
let maxEnemies = 30;
let score = 0;

let zombieFrames = [];
let totalZombieFrames = 9;

function preload() {
  for (let i = 1; i <= totalZombieFrames; i++) {
    let numStr = nf(i); // ensures two-digit format like 01, 02, etc.
    zombieFrames.push(loadImage("Zombie_walk/zombie_walk" + numStr + ".png"));
  }
}

function setup() {
  createCanvas(1280, 700);
  player.x = width / 2;
  player.y = height - 50;
}

function draw() {
  background(0);

  if (gameOver) {
    fill(255);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("You Lose", width / 2, height / 2);
    textSize(32);
    text("Score: " + score, width / 2, height / 2 + 50);
    return;
  }

  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);

  drawPlayer();
  movePlayer();

  for (let i = bullets.length - 1; i >= 0; i--) {
    drawBullet(bullets[i]);
    moveBullet(bullets[i]);
    if (bulletOffscreen(bullets[i])) {
      bullets.splice(i, 1);
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    drawEnemy(enemies[i]);
    moveEnemy(enemies[i]);

    if (enemies[i].y > height) {
      gameOver = true;
    }

    if (enemies[i].y + 40 > player.y && enemies[i].x < player.x + 40 && enemies[i].x + 40 > player.x) {
      gameOver = true;
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bulletHitsEnemy(bullets[i], enemies[j])) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        score += 10;
        break;
      }
    }
  }

  enemySpawnTimer++;
  if (enemySpawnTimer >= spawnInterval && enemies.length < maxEnemies) {
    spawnSingleEnemy();
    enemySpawnTimer = 0;
    spawnInterval = max(minSpawnInterval, spawnInterval - spawnDecreaseRate);
  }

  stroke(255);
  line(0, playerYMin, width, playerYMin);
}

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
  }
}

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

function drawPlayer() {
  fill(0, 255, 0);
  rect(player.x, player.y, 40, 40);
}

function movePlayer() {
  player.x += player.speed;
  player.x = constrain(player.x, 0, width - 40);
  player.y += player.vspeed;
  player.y = constrain(player.y, playerYMin, height - 40);
}

function createBullet(x, y) {
  return {
    x: x,
    y: y,
    r: 4
  };
}

function drawBullet(bullet) {
  fill(255);
  noStroke();
  ellipse(bullet.x, bullet.y, bullet.r * 2);
}

function moveBullet(bullet) {
  bullet.y -= 5;
}

function bulletOffscreen(bullet) {
  return bullet.y < 0;
}

function bulletHitsEnemy(bullet, enemy) {
  let d = dist(bullet.x, bullet.y, enemy.x + 20, enemy.y + 20);
  return d < bullet.r + 20;
}

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

function enemyPositionValid(x, y, minDist) {
  for (let enemy of enemies) {
    if (dist(x, y, enemy.x, enemy.y) < minDist) {
      return false;
    }
  }
  return true;
}

function drawEnemy(enemy) {
  image(zombieFrames[enemy.frame], enemy.x, enemy.y, 40, 51);

  enemy.frameDelay++;
  if (enemy.frameDelay >= 6) {
    enemy.frame = (enemy.frame + 1) % totalZombieFrames;
    enemy.frameDelay = 0;
  }
}

function moveEnemy(enemy) {
  if (enemy.y + 40 >= playerYMin && !enemy.slowed) {
    enemy.slowed = true;
  }

  enemy.y += enemy.slowed ? 0.15 : 0.3;
}
