// Canvas variables.
var canvas = document.getElementById("myCanvas"),
    ctx = canvas.getContext("2d");

// Button variables.
var muteMusicBtn = document.getElementById("muteMusic"),
    muteAudioBtn = document.getElementById("muteSound");

// Ball variables.
var x = canvas.width / 2, // Starting x value.
    y = canvas.height - 30, // Starting y value.
    rad = 10, // Ball radius.
    dx = 3, // Horizontal speed.
    dy = -3; // Vertical speed.

// Paddle variables.
var paddleHeight = 10,
    paddleWidth = 85,
    paddleSpeed = 5,
    paddleX = (canvas.width - paddleWidth) / 2,
    rightPressed = false,
    leftPressed = false;

// Brick variables.
var brickRowCount = 3,
    brickColumnCount = 5,
    brickWidth = 75,
    brickHeight = 20,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 30;

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Game variables.
var score = 0,
    lives = 3;

// Sound variables.
var bounce = new Audio("media/bounce.wav"),
    damage = new Audio("media/damage.wav"),
    win = new Audio("media/win.wav"),
    music = new Audio("media/pixelland.mp3"),
    audioMuted = false;

bounce.volume = 0.4;
damage.volume = 0.4;
win.volume = 0.4;
music.volume = 0.5;
music.loop = true;

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function keyDownHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    } else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    } else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    bounce.play();
                    b.status = 0;
                    score++;

                    if (score == brickRowCount * brickColumnCount) {
                        win.play();
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "SteelBlue";
    ctx.fillText("Score: " + score, 8, 20)
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "SteelBlue";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20)
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fillStyle = "SteelBlue";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight * 2, paddleWidth, paddleHeight);
    ctx.fillStyle = "SteelBlue";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "SteelBlue";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function moveBall() {
    x += dx;
    y += dy;

    // Handles collision detection with left and right walls.
    if (x + dx < rad || x + dx > canvas.width - rad) {
        dx = -dx;
        bounce.play();
    }

    // Handles collision detection with top and bottom walls.
    if (y + dy < rad) {
        dy = -dy;
        bounce.play();
    } else if (y + dy > canvas.height - rad - (paddleHeight * 2)) {
        if (x > paddleX && x < paddleX + paddleWidth && y + dy > canvas.height - rad - (paddleHeight * 2)) {
            dy = -dy;
            bounce.play();
        } else if (y + dy > canvas.height - r) {
            lives--;
            damage.play();
            if (lives) {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = 2;
                paddleX = (canvas.width - paddleWidth) / 2;
            } else {
                alert("GAME OVER");
                document.location.reload();
            }
        }
    }
}

function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
}

function muteMusic() {
    if (music.muted) {
        music.muted = false;
    } else {
        music.muted = true;
    }
}

function muteAudio() {
    if (audioMuted) {
        audioMuted = false;
        bounce.muted = false;
        damage.muted = false;
        win.muted = false;
    } else {
        audioMuted = true;
        bounce.muted = true;
        damage.muted = true;
        win.muted = true;
    }
}

function draw() {
    clearCanvas();
    drawScore();
    drawLives();
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    moveBall();
    movePaddle();
    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
muteMusicBtn.addEventListener("click", muteMusic, false);
muteAudioBtn.addEventListener("click", muteAudio, false);

draw();
music.play();