// app.js — Moteur de jeu Hantise
import { PLAYER_ROLES, buildGameDecks, shuffle } from './cards.js';

// ── État global ──────────────────────────────────────────────────────────────
const STATE = {
  phase: 'setup',      // setup | player-turn | ritual | event | end
  players: [],
  currentPlayerIndex: 0,
  turn: 1,
  maxTurns: 7,
  rituals: [],
  completedRituals: [],
  eventDeck: [],
  activeEvents: [],
  clues: [],
  gameResult: null     // null | 'victory' | 'defeat'
};

// ── Écrans ───────────────────────────────────────────────────────────────────
const SCREENS = {
  splash:     document.getElementById('screen-splash'),
  setup:      document.getElementById('screen-setup'),
  handoff:    document.getElementById('screen-handoff'),
  board:      document.getElementById('screen-board'),
  playerView: document.getElementById('screen-player-view'),
  ritual:     document.getElementById('screen-ritual'),
  event:      document.getElementById('screen-event'),
  end:        document.getElementById('screen-end')
};

function showScreen(name) {
  Object.values(SCREENS).forEach(s => s && s.classList.add('hidden'));
  if (SCREENS[name]) SCREENS[name].classList.remove('hidden');
}

// ── Sons ─────────────────────────────────────────────────────────────────────
const SFX = {
  click: new Audio('clic.mp3'),
  ritual: new Audio('bip.mp3'),
  victory: new Audio('bravo.mp3')
};
function playSound(key) {
  try {
    const s = SFX[key] ? SFX[key].cloneNode() : null;
    if (s) s.play().catch(() => {});
  } catch {}
}

// ── Setup ────────────────────────────────────────────────────────────────────
let pendingPlayers = [];

export function initSetup() {
  showScreen('setup');
  pendingPlayers = [];
  renderPlayerList();

  const btnAdd    = document.getElementById('btn-add-player');
  const btnStart  = document.getElementById('btn-start-game');
  const nameInput = document.getElementById('player-name-input');

  btnAdd.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name || pendingPlayers.length >= 8) return;
    if (pendingPlayers.find(p => p.name === name)) return;
    const role = PLAYER_ROLES[pendingPlayers.length % PLAYER_ROLES.length];
    pendingPlayers.push({ name, role });
    nameInput.value = '';
    nameInput.focus();
    renderPlayerList();
    btnStart.disabled = pendingPlayers.length < 3;
    playSound('click');
  });

  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') btnAdd.click(); });

  btnStart.addEventListener('click', () => {
    if (pendingPlayers.length < 3) return;
    startGame(pendingPlayers);
  });
}

function renderPlayerList() {
  const list = document.getElementById('player-list');
  list.innerHTML = pendingPlayers.map((p, i) => `
    <div class="player-entry" style="border-left: 4px solid #${p.role.colorHex}">
      <span class="player-role-icon">${p.role.symbol}</span>
      <div class="player-entry-info">
        <span class="player-name-text">${p.name}</span>
        <span class="player-role-name" style="color:#${p.role.colorHex}">${p.role.name}</span>
      </div>
      <button class="btn-remove-player" onclick="removePlayer(${i})">✕</button>
    </div>
  `).join('');
  document.getElementById('player-count-label').textContent =
    `${pendingPlayers.length} / 8 joueur${pendingPlayers.length > 1 ? 's' : ''}`;
}

window.removePlayer = function(i) {
  pendingPlayers.splice(i, 1);
  renderPlayerList();
  document.getElementById('btn-start-game').disabled = pendingPlayers.length < 3;
};

// ── Démarrage ────────────────────────────────────────────────────────────────
function startGame(players) {
  const { rituals, events, clues } = buildGameDecks(players.length);

  STATE.phase = 'player-turn';
  STATE.players = players.map((p, i) => ({
    ...p,
    id: i,
    clues: clues.slice(i * 2, i * 2 + 2),
    skipNextTurn: false
  }));
  STATE.currentPlayerIndex = 0;
  STATE.turn = 1;
  STATE.rituals = rituals;
  STATE.completedRituals = [];
  STATE.eventDeck = events;
  STATE.activeEvents = [];
  STATE.gameResult = null;

  showHandoff(STATE.players[0]);
}

// ── Handoff (passe le téléphone) ─────────────────────────────────────────────
function showHandoff(player) {
  showScreen('handoff');
  document.getElementById('handoff-name').textContent = player.name;
  document.getElementById('handoff-role').textContent = player.role.name;
  document.getElementById('handoff-icon').textContent = player.role.symbol;
  document.getElementById('handoff-color').style.color = `#${player.role.colorHex}`;

  const btn = document.getElementById('btn-handoff-ready');
  btn.onclick = () => {
    playSound('click');
    showPlayerView(player);
  };
}

// ── Vue joueur (cartes masquées) ─────────────────────────────────────────────
let revealTimeout = null;

function showPlayerView(player) {
  showScreen('playerView');

  document.getElementById('pv-name').textContent = player.name;
  document.getElementById('pv-role').textContent = player.role.name;
  document.getElementById('pv-role-symbol').textContent = player.role.symbol;
  document.getElementById('pv-ability').textContent = player.role.ability;

  const clueArea = document.getElementById('pv-clues');
  clueArea.innerHTML = player.clues.map(c => `
    <div class="clue-card blurred" data-id="${c.id}">
      <span class="clue-symbol">${c.symbol}</span>
      <span class="clue-element">${c.element}</span>
      <span class="clue-text">${c.text}</span>
    </div>
  `).join('');

  // Appui long pour révéler
  const revealBtn = document.getElementById('btn-reveal-clues');
  revealBtn.onpointerdown = () => {
    revealTimeout = setTimeout(() => {
      document.querySelectorAll('.clue-card').forEach(c => c.classList.remove('blurred'));
      revealBtn.textContent = '🔒 Relâcher pour masquer';
    }, 600);
  };
  revealBtn.onpointerup = revealBtn.onpointerleave = () => {
    clearTimeout(revealTimeout);
    document.querySelectorAll('.clue-card').forEach(c => c.classList.add('blurred'));
    revealBtn.textContent = '👁 Maintenir pour voir mes indices';
  };

  document.getElementById('btn-done-viewing').onclick = () => {
    playSound('click');
    showBoard();
  };
}

// ── Plateau ──────────────────────────────────────────────────────────────────
function showBoard() {
  showScreen('board');
  renderBoard();
}

function renderBoard() {
  // Tour
  document.getElementById('board-turn').textContent = STATE.turn;
  document.getElementById('board-turn-max').textContent = STATE.maxTurns;

  // Barre de progression
  const pct = Math.round((STATE.turn - 1) / STATE.maxTurns * 100);
  document.getElementById('turn-progress').style.width = pct + '%';

  // Rituels
  const ritualList = document.getElementById('ritual-list');
  ritualList.innerHTML = STATE.rituals.map(r => {
    const done = STATE.completedRituals.find(c => c.id === r.id);
    return `
      <div class="ritual-card ${done ? 'ritual-done' : ''}" onclick="openRitual('${r.id}')">
        <span class="ritual-symbol">${r.symbol}</span>
        <div class="ritual-info">
          <span class="ritual-name">${r.name}</span>
          <span class="ritual-diff">${'★'.repeat(r.difficulty)}${'☆'.repeat(3 - r.difficulty)}</span>
        </div>
        <span class="ritual-status">${done ? '✅' : '🔸'}</span>
      </div>
    `;
  }).join('');

  // Événements actifs
  const evArea = document.getElementById('active-events');
  evArea.innerHTML = STATE.activeEvents.length
    ? STATE.activeEvents.map(e => `<div class="event-badge">${e.symbol} ${e.name}</div>`).join('')
    : '<span class="no-events">Aucun événement actif</span>';

  // Joueur actuel
  const cp = STATE.players[STATE.currentPlayerIndex];
  document.getElementById('current-player-name').textContent = cp.name;
  document.getElementById('current-player-role').textContent = `${cp.role.symbol} ${cp.role.name}`;

  // Boutons actions
  document.getElementById('btn-draw-event').onclick = () => drawEvent();
  document.getElementById('btn-next-turn').onclick = () => nextTurn();
  document.getElementById('btn-view-my-cards').onclick = () => {
    playSound('click');
    showHandoff(cp);
  };
}

// ── Rituel ───────────────────────────────────────────────────────────────────
window.openRitual = function(ritualId) {
  const ritual = STATE.rituals.find(r => r.id === ritualId);
  if (!ritual) return;
  const done = STATE.completedRituals.find(c => c.id === ritualId);

  showScreen('ritual');
  document.getElementById('ritual-symbol').textContent = ritual.symbol;
  document.getElementById('ritual-title').textContent = ritual.name;
  document.getElementById('ritual-description').textContent = ritual.description;
  document.getElementById('ritual-clue-text').textContent = done ? ritual.completionText : ritual.clue;
  document.getElementById('ritual-elements').innerHTML =
    ritual.elements.map(el => `<span class="element-tag">${el}</span>`).join('');

  const btnComplete = document.getElementById('btn-complete-ritual');
  btnComplete.disabled = !!done;
  btnComplete.textContent = done ? '✅ Rituel accompli' : '✅ Accomplir ce rituel';
  btnComplete.onclick = () => completeRitual(ritual);

  document.getElementById('btn-ritual-back').onclick = () => { playSound('click'); showBoard(); };
};

function completeRitual(ritual) {
  if (STATE.completedRituals.find(r => r.id === ritual.id)) return;
  STATE.completedRituals.push(ritual);
  playSound('ritual');

  showRitualSuccess(ritual);

  if (STATE.completedRituals.length >= STATE.rituals.length) {
    setTimeout(() => endGame('victory'), 2000);
  }
}

function showRitualSuccess(ritual) {
  const overlay = document.getElementById('ritual-success-overlay');
  overlay.querySelector('.success-text').textContent = ritual.completionText;
  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.classList.add('hidden');
    showBoard();
  }, 2500);
}

// ── Événement ────────────────────────────────────────────────────────────────
function drawEvent() {
  if (STATE.eventDeck.length === 0) return;
  playSound('click');
  const event = STATE.eventDeck.shift();

  showScreen('event');
  document.getElementById('event-symbol').textContent = event.symbol;
  document.getElementById('event-name').textContent = event.name;
  document.getElementById('event-type').textContent = event.type.toUpperCase();
  document.getElementById('event-description').textContent = event.description;
  document.getElementById('event-type').className = `event-type-badge event-${event.type}`;

  if (event.duration > 0) STATE.activeEvents.push(event);

  document.getElementById('btn-event-ok').onclick = () => {
    playSound('click');
    showBoard();
  };
}

// ── Tours ────────────────────────────────────────────────────────────────────
function nextTurn() {
  playSound('click');

  // Décrémenter durée des événements actifs
  STATE.activeEvents = STATE.activeEvents
    .map(e => ({ ...e, duration: e.duration - 1 }))
    .filter(e => e.duration > 0);

  // Passer au joueur suivant
  STATE.currentPlayerIndex = (STATE.currentPlayerIndex + 1) % STATE.players.length;

  // Si on a fait un cycle complet, on avance le tour global
  if (STATE.currentPlayerIndex === 0) {
    STATE.turn++;
    if (STATE.turn > STATE.maxTurns) {
      endGame('defeat');
      return;
    }
  }

  const nextPlayer = STATE.players[STATE.currentPlayerIndex];
  showHandoff(nextPlayer);
}

// ── Fin de partie ────────────────────────────────────────────────────────────
function endGame(result) {
  STATE.gameResult = result;
  STATE.phase = 'end';

  showScreen('end');

  const isVictory = result === 'victory';
  document.getElementById('end-title').textContent = isVictory ? '🕯️ Rituels Accomplis !' : '💀 Les Esprits ont Triomphé';
  document.getElementById('end-subtitle').textContent = isVictory
    ? 'Vos rituels ont scellé le voile entre les mondes. La hantise est levée.'
    : `7 tours se sont écoulés. ${STATE.completedRituals.length}/${STATE.rituals.length} rituels accomplis. Les ténèbres vous ont engloutis.`;

  document.getElementById('end-rituals-done').textContent = STATE.completedRituals.length;
  document.getElementById('end-rituals-total').textContent = STATE.rituals.length;
  document.getElementById('end-turn-reached').textContent = Math.min(STATE.turn, STATE.maxTurns);

  document.getElementById('end-screen-bg').className = isVictory ? 'end-victory' : 'end-defeat';

  if (isVictory) playSound('victory');

  document.getElementById('btn-replay').onclick = () => {
    playSound('click');
    initSetup();
  };
}

// ── Point d'entrée ───────────────────────────────────────────────────────────
export function init() {
  document.getElementById('btn-splash-start').addEventListener('click', () => {
    playSound('click');
    initSetup();
  });
  showScreen('splash');
}
