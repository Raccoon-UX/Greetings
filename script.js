/* ---------- Config ---------- */
const colors = ['#ff6bcb', '#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#c084fc'];

/* ---------- DOM references ---------- */
const nameInput = document.getElementById('nameInput');
const generateBtn = document.getElementById('generateBtn');
const surpriseBtn = document.getElementById('surpriseBtn');
const wishTitle = document.getElementById('wishTitle');
const wishMessage = document.getElementById('wishMessage');
const stage = document.getElementById('stage');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

/* ---------- Helper functions ---------- */
function sanitize(s) { return String(s || '').trim(); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* Escape HTML (for safe name display) */
function escapeHtml(unsafe) {
  return unsafe.replace(/[&<"'>]/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));
}

/* ---------- Personalized wish text ---------- */
function makeWish(name) {
  const n = sanitize(name) || 'Friend';
  wishTitle.innerHTML = `🎂 Happy Birthday, <span style="color:transparent;background:linear-gradient(90deg,#fff,#ffd166);-webkit-background-clip:text;background-clip:text;font-weight:800">${escapeHtml(n)}</span>!`;

  const lines = [
    `Aaj ka din tere liye pyaar, surprises aur cake se bhara ho.`,
    `Har pal khushiyon se bhara rahe aur saari wishes poori ho.`,
    `May your year be filled with joy, success, and endless memories.`,
    `Smile a lot, make wishes, cut the cake — and enjoy every bit!`
  ];

  const msg = `${pick(lines)} 🌟<br><br><strong>Lots of love & best wishes — ❤️</strong>`;
  wishMessage.innerHTML = msg;

  animateCard();
  createBalloons(10);
  triggerConfettiBurst();
}

/* ---------- Card animation ---------- */
function animateCard() {
  const card = document.getElementById('wishCard');
  card.animate([
    { transform: 'scale(.9) translateY(8px)', opacity: 0 },
    { transform: 'scale(1.03) translateY(-6px)', opacity: 1 },
    { transform: 'scale(1) translateY(0)', opacity: 1 }
  ], {
    duration: 700,
    easing: 'cubic-bezier(.2,.8,.2,1)'
  });
}

/* ---------- Balloons ---------- */
let activeBalloons = [];
function createBalloons(n) {
  // Remove old ones
  activeBalloons.forEach(b => b.el.remove());
  activeBalloons = [];

  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'balloon';
    const w = 40 + Math.round(Math.random() * 90);
    const h = Math.round(w * (1.05 + Math.random() * 0.35));
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.left = Math.random() * 85 + 'vw';
    el.style.background = pick(colors);
    el.style.animation = `floatUp ${6 + Math.random() * 6}s linear infinite`;
    el.style.bottom = -(Math.random() * 160 + 60) + 'px';
    el.style.borderRadius = '50% 50% 46% 46% / 55% 55% 45% 45%';
    el.style.backgroundImage = 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), rgba(255,255,255,0) 18%)';

    stage.appendChild(el);
    activeBalloons.push({ el });
    setTimeout(() => { if (el && el.remove) el.remove(); }, 14000);
  }
}

/* ---------- Confetti ---------- */
let confettis = [];
function resizeCanvas() {
  confettiCanvas.width = stage.clientWidth;
  confettiCanvas.height = stage.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnConfetti(count = 140) {
  confettis = [];
  for (let i = 0; i < count; i++) {
    confettis.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: (Math.random() * 6) + 3,
      d: Math.random() * Math.PI * 2,
      color: pick(colors),
      tilt: Math.random() * 18 - 9,
      speedY: 1 + Math.random() * 3,
      speedX: Math.random() * 2 - 1
    });
  }
}

function updateAndDraw() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let i = 0; i < confettis.length; i++) {
    const c = confettis[i];
    c.y += c.speedY + Math.cos(c.d) * 0.4;
    c.x += c.speedX + Math.sin(c.d) * 0.3;
    c.d += 0.02;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.d * 0.2);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.r / 2 + c.tilt, -c.r / 2, c.r, c.r * 1.6);
    ctx.restore();

    if (c.y > confettiCanvas.height + 30) {
      confettis[i].y = -20;
      confettis[i].x = Math.random() * confettiCanvas.width;
    }
  }
  requestAnimationFrame(updateAndDraw);
}
requestAnimationFrame(updateAndDraw);

function triggerConfettiBurst() {
  spawnConfetti(160);
}

/* ---------- UI Interactions ---------- */
generateBtn.addEventListener('click', () => {
  makeWish(nameInput.value || '');
});
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') makeWish(nameInput.value || '');
});
surpriseBtn.addEventListener('click', () => {
  const surpriseNames = ['Aarav','Neha','Riya','Karan','Sana','Aditya','Maya','Ishaan','Anaya','Rohan'];
  const s = pick(surpriseNames);
  nameInput.value = s;
  makeWish(s);
});

/* ---------- Intro animation ---------- */
(function intro() {
  wishCardPulse();
  setTimeout(() => { animateCard(); }, 300);
})();
function wishCardPulse() {
  const card = document.getElementById('wishCard');
  card.animate([
    { transform: 'translateY(6px) scale(.98)', opacity: 0.92 },
    { transform: 'translateY(-6px) scale(1.01)', opacity: 1 }
  ], { duration: 2200, iterations: Infinity, easing: 'ease-in-out' });
}

/* ---------- Accessibility live region ---------- */
const live = document.createElement('div');
live.setAttribute('aria-live', 'polite');
live.style.position = 'absolute';
live.style.left = '-9999px';
document.body.appendChild(live);

function announce(text) { live.textContent = text; }

generateBtn.addEventListener('click', () => announce('Birthday wish created for ' + (nameInput.value || 'Friend')));
surpriseBtn.addEventListener('click', () => announce('Surprise name selected and wish created'));

/* Prevent accidental double-click text select */
document.addEventListener('mousedown', (e) => { if (e.detail > 1) e.preventDefault(); });
