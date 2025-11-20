// Simple two-player Tic-Tac-Toe
const cells = () => Array.from(document.querySelectorAll('.tic-tac-toe .cell'));
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let board = Array(9).fill(null);
let current = 'X';
let running = true;

function updateStatus() {
  if (!running) return;
  statusEl.textContent = `Player ${current}'s turn`;
}

function checkWin(bd) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of wins) {
    if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return {winner: bd[a], line:[a,b,c]};
  }
  if (bd.every(Boolean)) return {draw:true};
  return null;
}

function render() {
  cells().forEach((el, i) => {
    el.classList.remove('x','o','win');
    if (board[i]) el.classList.add(board[i].toLowerCase());
    el.textContent = board[i] || '';
  });
}

function handleClick(e) {
  if (!running) return;
  const idx = Number(e.currentTarget.dataset.index);
  if (board[idx]) return; // occupied
  board[idx] = current;
  const result = checkWin(board);
  if (result && result.winner) {
    running = false;
    statusEl.textContent = `Player ${result.winner} wins!`;
    // highlight winning cells
    result.line.forEach(i => document.querySelector(`.tic-tac-toe .cell[data-index="${i}"]`).classList.add('win'));
    // launch confetti for the winner
    try { launchConfetti(result.winner); } catch (err) { /* ignore if confetti fails */ }
  } else if (result && result.draw) {
    running = false;
    statusEl.textContent = `It's a draw`;
  } else {
    current = current === 'X' ? 'O' : 'X';
    updateStatus();
  }
  render();
}

function addListeners() {
  cells().forEach(cell => {
    cell.addEventListener('click', handleClick);
    cell.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') handleClick(e);
    });
  });
  restartBtn.addEventListener('click', reset);
}

function reset() {
  board = Array(9).fill(null);
  current = 'X';
  running = true;
  statusEl.textContent = `Player ${current}'s turn`;
  cells().forEach(c => c.classList.remove('win'));
  render();
}

// ---------------------------------------------------------------Simple confetti launcher (small, self-contained)
function launchConfetti(winner) {
  const root = document.documentElement;
  const accent = getComputedStyle(root).getPropertyValue('--accent').trim() || '#7cf2ff';
  const accent2 = getComputedStyle(root).getPropertyValue('--accent-2').trim() || '#8a6bff';
  const colors = winner === 'X' ? [accent, accent2, '#9be8ff'] : [accent2, accent, '#cdb6ff'];

  const container = document.createElement('div');
  container.className = 'confetti-container';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  const count = 36;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'confetti';
    const w = Math.floor(Math.random() * 10) + 6;
    el.style.width = w + 'px';
    el.style.height = Math.floor(w * 2.3) + 'px';
    el.style.left = Math.random() * 100 + '%';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.opacity = (Math.random() * 0.5 + 0.6).toString();
    el.style.transform = `translateY(-20vh) rotate(${Math.random() * 360}deg)`;
    el.style.animationDelay = (Math.random() * 0.4) + 's';
    el.style.animationDuration = (Math.random() * 0.9 + 5.0) + 's';
    // slight horizontal offset animation using CSS variable
    el.style.setProperty('--tx', (Math.random() * 140 - 70) + 'px');
    container.appendChild(el);
  }

  // remove after animation
  setTimeout(() => {
    container.remove();
  }, 3000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { addListeners(); updateStatus(); render(); });
} else {
  addListeners(); updateStatus(); render();
}

export {};
