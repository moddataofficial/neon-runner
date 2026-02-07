const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const gameOverBox = document.getElementById("gameOver");

let W, H;
function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ---------------- PLAYER ----------------
const player = {
    x:120,
    y:0,
    r:18,
    vy:0,
    jump(){
        if(this.y >= H-90){
            this.vy = -18;
        }
    }
};

// ---------------- GAME DATA ----------------
let obstacles = [];
let speed = 7;
let score = 0;
let running = true;

player.y = H-90;

// ---------------- CONTROLS ----------------
document.addEventListener("keydown", e=>{
    if(e.code === "Space") player.jump();
});
document.addEventListener("touchstart", ()=>player.jump());

// ---------------- OBSTACLE ----------------
function spawnObstacle(){
    obstacles.push({
        x:W + 40,
        w:30,
        h:50
    });
}

// ---------------- GAME LOOP ----------------
function loop(){
    if(!running) return;

    ctx.fillStyle = "#050510";
    ctx.fillRect(0,0,W,H);

    // ground
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(0,H-60,W,3);

    // player physics
    player.vy += 1;
    player.y += player.vy;
    if(player.y > H-90){
        player.y = H-90;
        player.vy = 0;
    }

    // player draw
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI*2);
    ctx.fillStyle = "#00ffff";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // obstacles
    if(Math.random() < 0.02) spawnObstacle();

    for(let i=obstacles.length-1; i>=0; i--){
        const o = obstacles[i];
        o.x -= speed;

        ctx.fillStyle = "#ff0066";
        ctx.fillRect(o.x, H-90, o.w, o.h);

        // collision
        if(
            player.x + player.r > o.x &&
            player.x - player.r < o.x + o.w &&
            player.y + player.r > H-90
        ){
            endGame();
        }

        if(o.x < -50) obstacles.splice(i,1);
    }

    score += 0.1;
    scoreEl.textContent = Math.floor(score);
    speed += 0.002;

    requestAnimationFrame(loop);
}

// ---------------- GAME STATE ----------------
function endGame(){
    running = false;
    gameOverBox.style.display = "flex";
}

function restartGame(){
    obstacles = [];
    speed = 7;
    score = 0;
    running = true;
    player.y = H-90;
    gameOverBox.style.display = "none";
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
