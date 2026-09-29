// Bhikar Sawkar - Main Orchestrator and Table Renderer
import confetti from 'canvas-confetti';
import { sounds } from './audio.js';
import { renderCardFace, renderCardBack } from './cards.js';
import { BhikarSawkarEngine } from './engine.js';

// DOM References
const potContainer = document.getElementById('pot-cards-stack');
const potBadgeNum = document.getElementById('pot-badge-num');
const statPot = document.getElementById('stat-pot');
const statFlips = document.getElementById('stat-flips');
const statMatches = document.getElementById('stat-matches');
const btnFlip = document.getElementById('btn-flip');
const btnAudio = document.getElementById('btn-audio');
const btnSpeed = document.getElementById('btn-speed');
const btnRules = document.getElementById('btn-rules');
const btnSettings = document.getElementById('btn-settings');
const btnNewMatch = document.getElementById('btn-new-match');
const matchAnnouncement = document.getElementById('match-announcement');
const matchSubtext = document.getElementById('match-subtext');
const tableSurface = document.getElementById('table-surface');

const modalRules = document.getElementById('modal-rules');
const modalSettings = document.getElementById('modal-settings');
const modalVictory = document.getElementById('modal-victory');
const btnPlayAgain = document.getElementById('btn-play-again');
const victoryLeaderboard = document.getElementById('victory-leaderboard');
const winnerNameEl = document.getElementById('winner-name');
const winnerSubEl = document.getElementById('winner-sub');

// Seat Mapping
// In 4 players: 0: bottom, 1: left, 2: top, 3: right
// In 3 players: 0: bottom, 1: left, 2: top (right hidden)
// In 2 players: 0: bottom, 1: top (left & right hidden)
const SEATS_CONFIG = {
  4: ['seat-bottom', 'seat-left', 'seat-top', 'seat-right'],
  3: ['seat-bottom', 'seat-left', 'seat-top'],
  2: ['seat-bottom', 'seat-top']
};

const ALL_SEAT_IDS = ['seat-bottom', 'seat-left', 'seat-top', 'seat-right'];

// Initialize Game Engine
let engine = new BhikarSawkarEngine({
  playerCount: 4,
  gameSpeed: 'normal',
  ruleVariation: 'rank',
  playMode: 'ai'
});

// Sound toggle state
let isMuted = false;

// Helpers: Render 3D Deck Stack Height
function renderDeckStack(stackEl, count) {
  if (!stackEl) return;
  stackEl.innerHTML = '';
  if (count <= 0) return;

  const visualLayers = Math.min(Math.ceil(count / 4), 9);
  for (let i = 0; i < visualLayers; i++) {
    const layer = document.createElement('div');
    layer.className = 'stack-layer';
    layer.style.transform = `translate(${i * -0.8}px, ${i * -1.2}px)`;
    stackEl.appendChild(layer);
  }

  // Top of stack is ornate card back
  const topCard = document.createElement('div');
  topCard.style.position = 'absolute';
  topCard.style.inset = '0';
  topCard.style.transform = `translate(${visualLayers * -0.8}px, ${visualLayers * -1.2}px)`;
  topCard.innerHTML = renderCardBack();
  stackEl.appendChild(topCard);
}

// Seat Element Resolver
function getSeatElements(seatId) {
  const seatEl = document.getElementById(seatId);
  return {
    seatEl,
    avatar: seatEl.querySelector('.player-avatar'),
    name: seatEl.querySelector('.player-name'),
    role: seatEl.querySelector('.player-role-tag'),
    count: seatEl.querySelector('.player-card-count'),
    stack: seatEl.querySelector('.card-stack'),
    chat: seatEl.querySelector('.chat-bubble')
  };
}

// Update View based on Engine State
function updateTableView(state) {
  statPot.textContent = state.centralPileCount;
  potBadgeNum.textContent = state.centralPileCount;
  statFlips.textContent = state.stats.roundFlips;
  statMatches.textContent = state.stats.matchesCount;

  const currentSeats = SEATS_CONFIG[engine.playerCount] || SEATS_CONFIG[4];

  // Show/Hide seats according to player count
  ALL_SEAT_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (currentSeats.includes(id)) {
        el.style.display = 'flex';
      } else {
        el.style.display = 'none';
      }
    }
  });

  // Update each active player's seat
  state.players.forEach((player, idx) => {
    const seatId = currentSeats[idx];
    if (!seatId) return;

    const els = getSeatElements(seatId);
    if (!els.seatEl) return;

    els.name.textContent = player.name;
    els.avatar.textContent = player.avatar;
    els.role.textContent = player.role;
    els.count.textContent = `🎴 ${player.cardCount}`;

    renderDeckStack(els.stack, player.cardCount);

    // Turn highlight
    if (idx === state.turnIndex && !player.eliminated && state.isPlaying) {
      els.seatEl.classList.add('active');
    } else {
      els.seatEl.classList.remove('active');
    }

    // Elimination state
    if (player.eliminated) {
      els.seatEl.classList.add('eliminated');
      if (!els.seatEl.querySelector('.eliminated-stamp')) {
        const stamp = document.createElement('div');
        stamp.className = 'eliminated-stamp';
        stamp.textContent = 'भिकारी (BHIKAR)';
        els.seatEl.appendChild(stamp);
      }
    } else {
      els.seatEl.classList.remove('eliminated');
      const stamp = els.seatEl.querySelector('.eliminated-stamp');
      if (stamp) stamp.remove();
    }
  });

  // Enable/Disable Flip Button for human player
  const humanPlayer = state.players[0];
  const isHumanTurn = state.turnIndex === 0 && !humanPlayer.eliminated && state.isPlaying && !state.isPaused;
  btnFlip.disabled = !isHumanTurn;
  btnFlip.style.opacity = isHumanTurn ? '1' : '0.4';
}

// Render Central Pot Cards
function renderPot(centralPile) {
  potContainer.innerHTML = '';
  if (!centralPile || centralPile.length === 0) return;

  // Show last up to 6 overlapping cards for tactile table feel
  const startIdx = Math.max(0, centralPile.length - 6);
  const visibleCards = centralPile.slice(startIdx);

  visibleCards.forEach((card, idx) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'pot-card-item';
    
    // Deterministic pleasant random rotation based on card id
    const seed = card.id.charCodeAt(card.id.length - 1) + idx * 7;
    const rot = ((seed % 25) - 12);
    const offsetX = ((seed % 14) - 7);
    const offsetY = ((seed % 10) - 5);

    cardEl.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rot}deg)`;
    cardEl.style.zIndex = idx + 1;
    cardEl.innerHTML = renderCardFace(card);
    potContainer.appendChild(cardEl);
  });
}

// Show Dialogue Chat Bubble
function showChat(seatId, text) {
  const els = getSeatElements(seatId);
  if (!els.chat) return;

  els.chat.textContent = text;
  els.chat.classList.add('visible');

  setTimeout(() => {
    els.chat.classList.remove('visible');
  }, 3200);
}

// Table Camera Shake on Match or Defeat
function shakeTable() {
  tableSurface.style.transform = 'translate(-4px, 3px) scale(0.99)';
  setTimeout(() => {
    tableSurface.style.transform = 'translate(4px, -3px) scale(1.01)';
    setTimeout(() => {
      tableSurface.style.transform = 'translate(-2px, 1px)';
      setTimeout(() => {
        tableSurface.style.transform = 'none';
      }, 70);
    }, 70);
  }, 70);
}

// Confetti Cannon for Match & Victory
function fireMatchConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#C9A24B', '#E5BF65', '#D4463B', '#F5F0E6']
    });
  } catch (e) {
    // Canvas confetti fallback
  }
}

function fireSawkarVictoryConfetti() {
  try {
    const end = Date.now() + 2500;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 35,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#C9A24B', '#FFD700', '#F5F0E6', '#D4463B']
      });
    }, 200);
  } catch (e) {
    // Ignore
  }
}

// Wire Engine Events
engine.on('onStateChange', (state) => {
  updateTableView(state);
  renderPot(engine.centralPile);
});

engine.on('onCardPlayed', ({ player, card, potSize }) => {
  sounds.playCardFlip();
  setTimeout(() => {
    sounds.playTableThud();
  }, 100);
  renderPot(engine.centralPile);
  updateTableView(engine.getState());
});

engine.on('onMatch', ({ player, matchedCard, underneathCard, capturedCount, newDeckCount }) => {
  shakeTable();
  sounds.playSawkarMatch();
  fireMatchConfetti();

  // Show announcement
  matchAnnouncement.classList.add('show');
  matchSubtext.textContent = `${player.name} ने जिंकला ${capturedCount} पानांचा ढीग!`;

  setTimeout(() => {
    sounds.playCardSweep();
  }, 400);

  setTimeout(() => {
    matchAnnouncement.classList.remove('show');
    renderPot(engine.centralPile);
    updateTableView(engine.getState());
  }, 1400);
});

engine.on('onElimination', ({ player, rank }) => {
  sounds.playBhikarElimination();
  updateTableView(engine.getState());
});

engine.on('onVictory', ({ sawkar, stats, eliminated }) => {
  sounds.playVictoryFanfare();
  fireSawkarVictoryConfetti();

  setTimeout(() => {
    winnerNameEl.textContent = `👑 ${sawkar.name} IS THE SAWKAR!`;
    winnerSubEl.textContent = 'सर्व ५२ पाने जिंकून महा सावकार ठरला!';

    victoryLeaderboard.innerHTML = `
      <div class="leaderboard-item">
        <strong>1. 👑 ${sawkar.name} (सावकार)</strong>
        <span>Won All 52 Cards</span>
      </div>
      ${eliminated.map((p, idx) => `
        <div class="leaderboard-item" style="color: var(--text-muted);">
          <span>${idx + 2}. ${p.name} (भिकारी)</span>
          <span>Bankrupt</span>
        </div>
      `).join('')}
    `;

    modalVictory.classList.add('open');
  }, 1200);
});

engine.on('onBanter', ({ player, text }) => {
  const currentSeats = SEATS_CONFIG[engine.playerCount] || SEATS_CONFIG[4];
  const pIdx = engine.players.findIndex(p => p.id === player.id);
  if (pIdx !== -1 && currentSeats[pIdx]) {
    showChat(currentSeats[pIdx], text);
  }
});

// Flip Button Action
function handleFlip() {
  sounds.ensureContext();
  if (engine.turnIndex === 0 && !engine.players[0].eliminated && engine.isPlaying) {
    engine.playTurn();
  }
}

btnFlip.addEventListener('click', handleFlip);

// User Deck Click
document.getElementById('stack-bottom').addEventListener('click', handleFlip);

// Keyboard Spacebar trigger
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.repeat) {
    const isModalOpen = document.querySelector('.modal-overlay.open');
    if (!isModalOpen && !btnFlip.disabled) {
      e.preventDefault();
      handleFlip();
    }
  }
  if (e.code === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  }
});

// Audio Toggle
btnAudio.addEventListener('click', () => {
  sounds.ensureContext();
  isMuted = sounds.toggleMute();
  btnAudio.textContent = isMuted ? '🔇' : '🔊';
});

// Speed Toggle Cycle
const speeds = ['normal', 'fast', 'turbo'];
btnSpeed.addEventListener('click', () => {
  const curIdx = speeds.indexOf(engine.gameSpeed);
  const nextSpeed = speeds[(curIdx + 1) % speeds.length];
  engine.gameSpeed = nextSpeed;
  btnSpeed.title = `Game Speed: ${nextSpeed.toUpperCase()}`;
  updateSpeedButtonGroup(nextSpeed);
  sounds.playCoin();
});

function updateSpeedButtonGroup(speed) {
  document.querySelectorAll('#group-speed .btn-choice').forEach(b => {
    b.classList.toggle('active', b.dataset.speed === speed);
  });
}

// Modal Triggers
btnRules.addEventListener('click', () => {
  sounds.playCoin();
  modalRules.classList.add('open');
});

btnSettings.addEventListener('click', () => {
  sounds.playCoin();
  modalSettings.classList.add('open');
});

btnNewMatch.addEventListener('click', () => {
  sounds.playCardSweep();
  engine.initMatch();
});

btnPlayAgain.addEventListener('click', () => {
  modalVictory.classList.remove('open');
  sounds.playCardSweep();
  engine.initMatch();
});

// Modal Close Buttons
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-close');
    document.getElementById(modalId)?.classList.remove('open');
  });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
    }
  });
});

// Settings Group Interactions
document.getElementById('group-players').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-choice');
  if (!btn) return;
  document.querySelectorAll('#group-players .btn-choice').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const count = parseInt(btn.dataset.players, 10);
  engine.playerCount = count;
  sounds.playCoin();
  engine.initMatch();
});

document.getElementById('group-speed').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-choice');
  if (!btn) return;
  document.querySelectorAll('#group-speed .btn-choice').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  engine.gameSpeed = btn.dataset.speed;
  sounds.playCoin();
});

document.getElementById('group-rule').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-choice');
  if (!btn) return;
  document.querySelectorAll('#group-rule .btn-choice').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  engine.ruleVariation = btn.dataset.rule;
  sounds.playCoin();
});

document.getElementById('group-mode').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-choice');
  if (!btn) return;
  document.querySelectorAll('#group-mode .btn-choice').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  engine.playMode = btn.dataset.playmode;
  sounds.playCoin();
  engine.initMatch();
});

// First Interaction Audio Unlock
window.addEventListener('click', () => {
  sounds.ensureContext();
}, { once: true });

// Start First Match
engine.initMatch();
