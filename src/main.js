// Bhikar Sawkar - 3D First-Person Perspective Orchestrator
import confetti from 'canvas-confetti';
import { sounds } from './audio.js';
import { BhikarSawkarEngine } from './engine.js';
import { TableScene3D } from './scene3d.js';

// DOM References
const webglContainer = document.getElementById('webgl-container');
const tensionVignette = document.getElementById('tension-vignette');
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
const hudCardDisplay = document.getElementById('hud-card-display');
const stakesIndicator = document.getElementById('stakes-indicator');
const stakesText = document.getElementById('stakes-text');

const modalRules = document.getElementById('modal-rules');
const modalSettings = document.getElementById('modal-settings');
const modalVictory = document.getElementById('modal-victory');
const btnPlayAgain = document.getElementById('btn-play-again');
const victoryLeaderboard = document.getElementById('victory-leaderboard');
const winnerNameEl = document.getElementById('winner-name');
const winnerSubEl = document.getElementById('winner-sub');

// Seat Mapping
function getSeatMap(playerCount) {
  if (playerCount === 2) {
    return ['bottom', 'top'];
  }
  if (playerCount === 3) {
    return ['bottom', 'left', 'top'];
  }
  return ['bottom', 'left', 'top', 'right'];
}

// Initialize 3D First-Person Scene
const scene3d = new TableScene3D(webglContainer);

// Initialize Game Engine
let engine = new BhikarSawkarEngine({
  playerCount: 4,
  gameSpeed: 'normal',
  ruleVariation: 'rank',
  playMode: 'ai'
});

scene3d.setPlayerCount(4);

// Sound State
let isMuted = false;

// Helpers: Resolve HUD Elements
function getHudElements(seatKey) {
  const hudEl = document.getElementById(`seat-${seatKey}`);
  if (!hudEl) return null;
  return {
    hudEl,
    avatar: document.getElementById(`avatar-${seatKey}`),
    name: document.getElementById(`name-${seatKey}`),
    role: document.getElementById(`role-${seatKey}`),
    count: document.getElementById(`count-${seatKey}`),
    chat: document.getElementById(`chat-${seatKey}`)
  };
}

// Update HUD View
function updateHud(state) {
  if (statPot) statPot.textContent = state.centralPileCount;
  if (statFlips) statFlips.textContent = state.stats.roundFlips;
  if (statMatches) statMatches.textContent = state.stats.matchesCount;

  // Progressive Cinematic Tension Stages based on Pot Stakes
  const pot = state.centralPileCount;
  if (pot >= 20) {
    if (tensionVignette) tensionVignette.className = 'tension-vignette stage-4';
    scene3d.setTensionStage(4);
    if (stakesIndicator) {
      stakesIndicator.classList.add('visible');
      if (stakesText) stakesText.textContent = `👑 ALL-IN SAWKAR POT (${pot} CARDS)!`;
    }
    sounds.playHeartbeat(2.2);
  } else if (pot >= 14) {
    if (tensionVignette) tensionVignette.className = 'tension-vignette stage-3';
    scene3d.setTensionStage(3);
    if (stakesIndicator) {
      stakesIndicator.classList.add('visible');
      if (stakesText) stakesText.textContent = `⚠️ CRITICAL STAKES (${pot} CARDS)`;
    }
    sounds.playHeartbeat(1.6);
  } else if (pot >= 8) {
    if (tensionVignette) tensionVignette.className = 'tension-vignette stage-2';
    scene3d.setTensionStage(2);
    if (stakesIndicator) {
      stakesIndicator.classList.add('visible');
      if (stakesText) stakesText.textContent = `🔥 HEATED POT (${pot} CARDS)`;
    }
    sounds.playHeartbeat(1.1);
  } else if (pot >= 4) {
    if (tensionVignette) tensionVignette.className = 'tension-vignette stage-1';
    scene3d.setTensionStage(1);
    if (stakesIndicator) {
      stakesIndicator.classList.add('visible');
      if (stakesText) stakesText.textContent = `⚡ STAKES RISING (${pot} CARDS)`;
    }
    sounds.playHeartbeat(0.7);
  } else {
    if (tensionVignette) tensionVignette.className = 'tension-vignette';
    scene3d.setTensionStage(0);
    if (stakesIndicator) stakesIndicator.classList.remove('visible');
  }

  const seatKeys = getSeatMap(engine.playerCount);

  // Show/Hide HUD cards
  ['bottom', 'left', 'top', 'right'].forEach(seat => {
    const el = document.getElementById(`seat-${seat}`);
    if (el) {
      el.style.display = seatKeys.includes(seat) ? 'flex' : 'none';
    }
  });

  // Update physical 3D card deck counts
  const deckCounts = {};
  state.players.forEach((p, idx) => {
    const seat = seatKeys[idx];
    if (seat) deckCounts[seat] = p.cardCount;
  });
  scene3d.updateDeckCounts(deckCounts);

  // Update HUD text & turn highlights
  state.players.forEach((player, idx) => {
    const seatKey = seatKeys[idx];
    if (!seatKey) return;

    const els = getHudElements(seatKey);
    if (!els) return;

    els.name.textContent = player.name;
    els.avatar.textContent = player.avatar;
    els.role.textContent = player.role;
    const numEl = els.count.querySelector('.count-num');
    if (numEl) {
      numEl.textContent = player.cardCount;
    } else {
      els.count.innerHTML = `<span class="count-num">${player.cardCount}</span><img src="/nameplate_card.png" class="nameplate-card-icon" alt="Cards" />`;
    }

    if (idx === state.turnIndex && !player.eliminated && state.isPlaying) {
      els.hudEl.classList.add('active');
    } else {
      els.hudEl.classList.remove('active');
    }

    if (player.eliminated) {
      els.hudEl.classList.add('eliminated');
      if (!els.hudEl.querySelector('.eliminated-stamp')) {
        const stamp = document.createElement('div');
        stamp.className = 'eliminated-stamp';
        stamp.textContent = 'भिकारी (BHIKAR)';
        els.hudEl.appendChild(stamp);
      }
    } else {
      els.hudEl.classList.remove('eliminated');
      const stamp = els.hudEl.querySelector('.eliminated-stamp');
      if (stamp) stamp.remove();
    }
  });

  // Last card HUD preview
  const activeCard = state.topCard || lastPlayedCard;
  if (activeCard && state.centralPileCount > 0) {
    const suitSymbol = activeCard.suitSymbol || '♠';
    const isRed = (activeCard.suit === 'hearts' || activeCard.suit === 'diamonds');
    const color = isRed ? '#D42C20' : '#FFFFFF';
    hudCardDisplay.innerHTML = `
      <div class="hud-card-mini" style="color: ${color};">
        <span style="font-size: 1.6rem; font-weight: 800;">${activeCard.rank}</span>
        <span style="font-size: 1.4rem;">${suitSymbol}</span>
      </div>
    `;
  } else {
    hudCardDisplay.innerHTML = `<span class="hud-empty-pot">EMPTY POT</span>`;
  }

  // Turn button state
  const isHumanTurn = state.turnIndex === 0 && !state.players[0].eliminated && state.isPlaying && !state.isPaused;
  btnFlip.disabled = !isHumanTurn;
  btnFlip.style.opacity = isHumanTurn ? '1' : '0.35';
}

// Show Dialogue Chat Bubble
function showChat(seatKey, text) {
  const els = getHudElements(seatKey);
  if (!els || !els.chat) return;

  els.chat.textContent = text;
  els.chat.classList.add('visible');

  setTimeout(() => {
    els.chat.classList.remove('visible');
  }, 3200);
}

// Confetti effects
function fireMatchConfetti() {
  try {
    confetti({
      particleCount: 55,
      spread: 75,
      origin: { y: 0.58 },
      colors: ['#C9A24B', '#E5BF65', '#D4463B', '#F5F0E6']
    });
  } catch (e) {}
}

function fireSawkarVictoryConfetti() {
  try {
    const end = Date.now() + 2500;
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({
        startVelocity: 35,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#C9A24B', '#FFD700', '#F5F0E6', '#D4463B']
      });
    }, 200);
  } catch (e) {}
}

let lastPlayedCard = null;

// Wire Engine Events to 3D Scene
engine.on('onStateChange', (state) => {
  updateHud(state);
});

engine.on('onCardPlayed', ({ player, card, potSize }) => {
  lastPlayedCard = card;
  const seatKeys = getSeatMap(engine.playerCount);
  const pIdx = engine.players.findIndex(p => p.id === player.id);
  const seatKey = seatKeys[pIdx] || 'bottom';

  sounds.playCardFlip();
  updateHud(engine.getState());

  // Play 3D card throw motion from the character's hands
  scene3d.playCardThrow(seatKey, card, () => {
    sounds.playTableThud();
    updateHud(engine.getState());
  });
});

engine.on('onMatch', ({ player, matchedCard, underneathCard, capturedCount, newDeckCount }) => {
  const seatKeys = getSeatMap(engine.playerCount);
  const pIdx = engine.players.findIndex(p => p.id === player.id);
  const seatKey = seatKeys[pIdx] || 'bottom';

  sounds.playSawkarMatch();
  sounds.playTableSlam();
  scene3d.triggerCameraShake(0.045);
  fireMatchConfetti();

  // Reset tension upon match release
  if (tensionVignette) tensionVignette.className = 'tension-vignette';
  scene3d.setTensionStage(0);
  if (stakesIndicator) stakesIndicator.classList.remove('visible');

  // Banner
  matchAnnouncement.classList.add('show');
  matchSubtext.textContent = `${player.name} ने जिंकला ${capturedCount} पानांचा ढीग!`;

  sounds.playCardSweep();
  scene3d.sweepPotToWinner(seatKey, () => {
    updateHud(engine.getState());
  });

  setTimeout(() => {
    matchAnnouncement.classList.remove('show');
  }, 1400);
});

engine.on('onElimination', ({ player, rank }) => {
  sounds.playBhikarElimination();
  updateHud(engine.getState());
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
  const seatKeys = getSeatMap(engine.playerCount);
  const pIdx = engine.players.findIndex(p => p.id === player.id);
  const seatKey = seatKeys[pIdx];
  if (seatKey) {
    showChat(seatKey, text);
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

// Click anywhere on table to flip on human turn
webglContainer.addEventListener('click', () => {
  sounds.ensureContext();
  if (engine.turnIndex === 0 && !engine.players[0].eliminated && engine.isPlaying) {
    handleFlip();
  }
});

// Keyboard Shortcut: Spacebar
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

// Speed Toggle Cycle (if present)
const speeds = ['normal', 'fast', 'turbo'];
if (btnSpeed) {
  btnSpeed.addEventListener('click', () => {
    const curIdx = speeds.indexOf(engine.gameSpeed);
    const nextSpeed = speeds[(curIdx + 1) % speeds.length];
    engine.gameSpeed = nextSpeed;
    btnSpeed.title = `Game Speed: ${nextSpeed.toUpperCase()}`;
    updateSpeedButtonGroup(nextSpeed);
    sounds.playCoin();
  });
}

function updateSpeedButtonGroup(speed) {
  document.querySelectorAll('#group-speed .btn-choice').forEach(b => {
    b.classList.toggle('active', b.dataset.speed === speed);
  });
}

// Modal Triggers
if (btnRules) {
  btnRules.addEventListener('click', () => {
    sounds.playCoin();
    modalRules.classList.add('open');
  });
}

const btnOpenRulesFromSettings = document.getElementById('btn-open-rules-from-settings');
if (btnOpenRulesFromSettings) {
  btnOpenRulesFromSettings.addEventListener('click', () => {
    sounds.playCoin();
    modalSettings.classList.remove('open');
    modalRules.classList.add('open');
  });
}

if (btnSettings) {
  btnSettings.addEventListener('click', () => {
    sounds.playCoin();
    modalSettings.classList.add('open');
  });
}

btnNewMatch.addEventListener('click', () => {
  sounds.playCardSweep();
  lastPlayedCard = null;
  scene3d.clearPot();
  engine.initMatch();
});

btnPlayAgain.addEventListener('click', () => {
  modalVictory.classList.remove('open');
  sounds.playCardSweep();
  lastPlayedCard = null;
  scene3d.clearPot();
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
  scene3d.setPlayerCount(count);
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

// Wire 270° POV Quick-Look Camera Buttons
document.querySelectorAll('.btn-pov').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const target = btn.getAttribute('data-target');
    if (target && scene3d.lookAtSeat) {
      scene3d.lookAtSeat(target);
      sounds.playCardFlip();
    }
  });
});

// First Interaction Audio Unlock
window.addEventListener('click', () => {
  sounds.ensureContext();
}, { once: true });

// Start First Match
engine.initMatch();
