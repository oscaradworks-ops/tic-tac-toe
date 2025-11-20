// Simple Snake game (arrow keys)

function initSnake() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas && canvas.getContext && canvas.getContext('2d');
  const scoreEl = document.getElementById('snakeScore');
  const startBtn = document.getElementById('snakeStart');
  const pauseBtn = document.getElementById('snakePause');
  const resetBtn = document.getElementById('snakeReset');

  if (!(canvas && ctx)) {
    console.warn('Snake canvas or context not available');
    return;
  }
  // Grid settings
  const COLS = 21;
  const ROWS = 21;
  let cellSize = Math.floor(canvas.width / COLS);

  // Game state
  let snake = [{x: Math.floor(COLS/2), y: Math.floor(ROWS/2)}];
  let dir = {x: 0, y: 0};
  let nextDir = {x: 0, y: 0};
  let food = null;
  let running = false;
  let score = 0;
  let lastTime = 0;
  let tickInterval = 120; // ms per move

  function resizeCanvas() {
    // keep logical canvas resolution crisp on high DPI
    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;
    canvas.width = Math.floor(displayW * dpr);
    canvas.height = Math.floor(displayH * dpr);
    // reset any existing transform before scaling to avoid accumulation
    if (ctx.resetTransform) ctx.resetTransform(); else ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
    cellSize = Math.floor(displayW / COLS);
  }

  function placeFood() {
    const empty = [];
    for (let y=0;y<ROWS;y++) for (let x=0;x<COLS;x++) {
      if (!snake.some(s => s.x===x && s.y===y)) empty.push({x,y});
    }
    if (empty.length===0) return null;
    return empty[Math.floor(Math.random()*empty.length)];
  }

  function resetGame() {
    snake = [{x: Math.floor(COLS/2), y: Math.floor(ROWS/2)}];
    dir = {x: 0, y: 0};
    nextDir = {x: 0, y: 0};
    food = placeFood();
    score = 0;
    running = false;
    updateScore();
    draw();
  }

  function updateScore(){ if(scoreEl) scoreEl.textContent = `Score: ${score}`; }

  function step(){
    if (nextDir.x === -dir.x && nextDir.y === -dir.y) {
      // prevent reversing into self
    } else if (nextDir.x!==0 || nextDir.y!==0) dir = nextDir;

    if (dir.x===0 && dir.y===0) return; // not moving

    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    // check collisions
    if (head.x<0 || head.x>=COLS || head.y<0 || head.y>=ROWS || snake.some(s=>s.x===head.x && s.y===head.y)) {
      // game over
      running = false;
      statusGameOver();
      return;
    }

    snake.unshift(head);
    // eat food
    if (food && head.x===food.x && head.y===food.y) {
      score += 1;
      food = placeFood();
      updateScore();
    } else {
      snake.pop();
    }
  }

  function statusGameOver(){
    if (scoreEl) scoreEl.textContent = `Game Over — Score: ${score}`;
  }

  function draw(){
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0,0,w,h);
    // background grid
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(0,0,w,h);

    // draw food
    if (food) {
      ctx.fillStyle = 'rgba(255,80,100,0.95)';
      ctx.fillRect(food.x*cellSize + 2, food.y*cellSize + 2, cellSize-4, cellSize-4);
    }

    // draw snake
    for (let i=0;i<snake.length;i++){
      const s = snake[i];
      if (i===0) ctx.fillStyle = 'rgba(124,242,255,0.95)'; else ctx.fillStyle = 'rgba(138,107,255,0.9)';
      ctx.fillRect(s.x*cellSize + 2, s.y*cellSize + 2, cellSize-4, cellSize-4);
    }
  }

  function loop(time){
    if (!lastTime) lastTime = time;
    const elapsed = time - lastTime;
    if (running && elapsed >= tickInterval) {
      lastTime = time;
      step();
      draw();
    }
    requestAnimationFrame(loop);
  }

  function start() { if (!running) { running = true; lastTime = 0; requestAnimationFrame(loop); } }
  function pause() { running = false; }

  // keyboard controls
  window.addEventListener('keydown', e => {
    const key = e.key;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)) e.preventDefault();
    if (key === 'ArrowUp') nextDir = {x:0,y:-1};
    if (key === 'ArrowDown') nextDir = {x:0,y:1};
    if (key === 'ArrowLeft') nextDir = {x:-1,y:0};
    if (key === 'ArrowRight') nextDir = {x:1,y:0};
  });

  // buttons
  if (startBtn) startBtn.addEventListener('click', ()=>{ start(); });
  if (pauseBtn) pauseBtn.addEventListener('click', ()=>{ pause(); });
  if (resetBtn) resetBtn.addEventListener('click', ()=>{ resetGame(); });

  // handle resize
  window.addEventListener('resize', ()=>{ resizeCanvas(); draw(); });

  // initialize
  resizeCanvas();
  food = placeFood();
  draw();
  requestAnimationFrame(loop);
}

// initialize when DOM is ready
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSnake); else initSnake();

export {};
