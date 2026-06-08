/* ============================================================
   KINIELA MUNDIAL 2026 — app.js
   ============================================================ */

'use strict';

// ── Constants ──────────────────────────────────────────────

const GROUPS_DEADLINE = new Date(2026, 5, 11, 21, 0, 0); // June 11 2026 21:00 Madrid time

const MONTH_MAP = {
  'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
  'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
};

const TEAM_NAME_MAP = {
  "México": "Mexico", "Sudáfrica": "South Africa", "Corea del Sur": "Korea Republic",
  "República Checa": "Czechia", "Canada": "Canada", "Bosnia Herzegovina": "Bosnia and Herzegovina",
  "Qatar": "Qatar", "Suiza": "Switzerland", "Estados Unidos": "USA", "Paraguay": "Paraguay",
  "Australia": "Australia", "Turquía": "Türkiye", "Alemania": "Germany", "Curaçao": "Curaçao",
  "Costa de Marfil": "Côte d'Ivoire", "Ecuador": "Ecuador", "Países Bajos": "Netherlands",
  "Japón": "Japan", "Suecia": "Sweden", "Túnez": "Tunisia", "Bélgica": "Belgium",
  "Irán": "IR Iran", "Nueva Zelanda": "New Zealand", "Egipto": "Egypt", "España": "Spain",
  "Cabo Verde": "Cabo Verde", "Arabia Saudí": "Saudi Arabia", "Uruguay": "Uruguay",
  "Francia": "France", "Senegal": "Senegal", "Iraq": "Iraq", "Noruega": "Norway",
  "Argentina": "Argentina", "Argelia": "Algeria", "Austria": "Austria", "Jordania": "Jordan",
  "Portugal": "Portugal", "R.D. del Congo": "Congo DR", "Uzbekistán": "Uzbekistan",
  "Colombia": "Colombia", "Inglaterra": "England", "Croacia": "Croatia", "Ghana": "Ghana",
  "Panamá": "Panama", "Haití": "Haiti", "Marruecos": "Morocco", "Brasil": "Brazil",
  "Escocia": "Scotland"
};

const FLAG_MAP = {
  "México": "🇲🇽", "Sudáfrica": "🇿🇦", "Corea del Sur": "🇰🇷", "República Checa": "🇨🇿",
  "Canada": "🇨🇦", "Bosnia Herzegovina": "🇧🇦", "Qatar": "🇶🇦", "Suiza": "🇨🇭",
  "Estados Unidos": "🇺🇸", "Paraguay": "🇵🇾", "Australia": "🇦🇺", "Turquía": "🇹🇷",
  "Alemania": "🇩🇪", "Curaçao": "🇨🇼", "Costa de Marfil": "🇨🇮", "Ecuador": "🇪🇨",
  "Países Bajos": "🇳🇱", "Japón": "🇯🇵", "Suecia": "🇸🇪", "Túnez": "🇹🇳",
  "Bélgica": "🇧🇪", "Irán": "🇮🇷", "Nueva Zelanda": "🇳🇿", "Egipto": "🇪🇬",
  "España": "🇪🇸", "Cabo Verde": "🇨🇻", "Arabia Saudí": "🇸🇦", "Uruguay": "🇺🇾",
  "Francia": "🇫🇷", "Senegal": "🇸🇳", "Iraq": "🇮🇶", "Noruega": "🇳🇴",
  "Argentina": "🇦🇷", "Argelia": "🇩🇿", "Austria": "🇦🇹", "Jordania": "🇯🇴",
  "Portugal": "🇵🇹", "R.D. del Congo": "🇨🇩", "Uzbekistán": "🇺🇿", "Colombia": "🇨🇴",
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croacia": "🇭🇷", "Ghana": "🇬🇭", "Panamá": "🇵🇦",
  "Haití": "🇭🇹", "Marruecos": "🇲🇦", "Brasil": "🇧🇷", "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿"
};

const PLAYERS = [
  "Cole Garmer", "Luisgarrincha", "Alex Casadinho", "Guisermo Casadinho",
  "AnsuFigui", "DaniTwangy", "Dudu", "XaviCarbu", "MarkusRashford", "BusiCusi"
];

// Colors for player avatars (one per player, cycling)
const PLAYER_COLORS = [
  '#e63946','#f5c518','#2ecc71','#3498db','#9b59b6',
  '#e67e22','#1abc9c','#e91e63','#00bcd4','#ff5722'
];

// ── State ──────────────────────────────────────────────────

let matchesData = null;   // raw from matches.json
let playersData = null;   // raw from players.json
let playersByEnglish = {}; // { "Mexico": [...jugadores] }

let currentPlayer = '';
let predictions = {};  // { "A-0": { sign, golesLocal, golesVisitante, firstScorer } }
let groupPredictions = {}; // { "A": ["España","Brasil",...] }

let activeTab = 'dashboard';
let activeDateTab = null;
let activeGroupTab = 'A';

let countdownInterval = null;
let badgeIntervals = [];

// ── Helpers ────────────────────────────────────────────────

/**
 * Returns a Date whose numeric value can be compared against dates built
 * with new Date(year, month, day, h, m) — i.e. parseMatchDate() and
 * GROUPS_DEADLINE — by "pretending" Madrid local time is the system local time.
 * Both sides of every comparison use the same convention, so the math works
 * regardless of the user's actual timezone.
 */
function nowInMadrid() {
  const madridStr = new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
  return new Date(madridStr);
}

function flag(team) {
  return FLAG_MAP[team] || '🏳';
}

function parseMatchDate(fecha, hora) {
  // fecha: "11 jun", hora: "21:00"
  const parts = fecha.split(' ');
  const day = parseInt(parts[0], 10);
  const month = MONTH_MAP[parts[1].toLowerCase()] ?? 5;
  const [h, m] = hora.split(':').map(Number);
  return new Date(2026, month, day, h, m, 0);
}

function isMatchLocked(fecha, hora) {
  return nowInMadrid() >= parseMatchDate(fecha, hora);
}

function areGroupsLocked() {
  return nowInMadrid() >= GROUPS_DEADLINE;
}

function msToCountdown(ms) {
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m ${secs}s`;
}

function getMatchLockStatus(fecha, hora, matchId) {
  // Si el partido ya tiene resultado registrado por el admin, se muestra como finalizado
  const results = JSON.parse(localStorage.getItem('kiniela_results') || '{}');
  if (matchId && results[matchId]) return { locked: true, label: '✅ Finalizado', cls: 'badge-finished', finished: true };

  const kickoff = parseMatchDate(fecha, hora);
  const now = nowInMadrid();
  const diffMs = kickoff - now;
  if (now >= kickoff) return { locked: true, label: '🔒 Cerrado', cls: 'badge-closed' };
  // If closing within 2 hours, show countdown
  if (diffMs < 2 * 3600 * 1000) {
    const cd = msToCountdown(diffMs);
    return { locked: false, label: `⏱ Cierra en ${cd}`, cls: 'badge-soon', live: true, lockTime: kickoff };
  }
  return { locked: false, label: '🟢 Abierto', cls: 'badge-open' };
}

function getSignLabel(sign, local, visitante) {
  if (!sign) return '';
  if (sign === '1') return local;
  if (sign === '2') return visitante;
  return 'Empate';
}

function getPositionLabel(pos) {
  return pos === 0 ? '1º' : pos === 1 ? '2º' : pos === 2 ? '3º' : '4º';
}

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

function loadStorage() {
  currentPlayer = localStorage.getItem('kiniela_current_player') || '';
  loadPlayerData();
}

function loadPlayerData() {
  if (!currentPlayer) { predictions = {}; groupPredictions = {}; return; }
  try { predictions = JSON.parse(localStorage.getItem(`kiniela_predictions_${currentPlayer}`) || '{}'); } catch { predictions = {}; }
  try { groupPredictions = JSON.parse(localStorage.getItem(`kiniela_groups_${currentPlayer}`) || '{}'); } catch { groupPredictions = {}; }
}

function saveStorage() {
  if (!currentPlayer) return;
  localStorage.setItem('kiniela_current_player', currentPlayer);
  localStorage.setItem(`kiniela_predictions_${currentPlayer}`, JSON.stringify(predictions));
  localStorage.setItem(`kiniela_groups_${currentPlayer}`, JSON.stringify(groupPredictions));
}

function selectPlayer(player) {
  currentPlayer = player;
  localStorage.setItem('kiniela_current_player', player);
  loadPlayerData();
  initDefaultGroups();
  updateHeader();
  renderDashboard();
}

function initDefaultGroups() {
  if (!matchesData) return;
  Object.entries(matchesData.grupos).forEach(([grp, matches]) => {
    if (!groupPredictions[grp]) {
      const seen = [];
      matches.forEach(m => {
        if (!seen.includes(m.local)) seen.push(m.local);
        if (!seen.includes(m.visitante)) seen.push(m.visitante);
      });
      groupPredictions[grp] = seen.slice(0, 4);
    }
  });
  saveStorage();
}

function buildPlayersMap() {
  playersByEnglish = {};
  playersData.forEach(team => {
    playersByEnglish[team.seleccion] = team.jugadores;
  });
}

function getPlayers(spanishName) {
  const en = TEAM_NAME_MAP[spanishName];
  return playersByEnglish[en] || [];
}

function getMatchPrediction(grupo, idx) {
  const key = `${grupo}-${idx}`;
  return predictions[key] || {};
}

function setMatchPrediction(grupo, idx, update) {
  const key = `${grupo}-${idx}`;
  predictions[key] = { ...predictions[key], ...update };
  saveStorage();
}

function countPredictedMatches() {
  return Object.keys(predictions).filter(k => {
    const p = predictions[k];
    return p.sign || p.golesLocal != null || p.golesVisitante != null;
  }).length;
}

function countGroupsOrdered() {
  return Object.keys(groupPredictions).length;
}

function countOpenMatches() {
  if (!matchesData) return 0;
  let count = 0;
  Object.entries(matchesData.grupos).forEach(([, matches]) => {
    matches.forEach(m => {
      if (!isMatchLocked(m.fecha, m.hora)) count++;
    });
  });
  return count;
}

function getAllMatchesSorted() {
  if (!matchesData) return [];
  const list = [];
  Object.entries(matchesData.grupos).forEach(([grupo, matches]) => {
    matches.forEach((m, idx) => {
      list.push({ ...m, grupo, idx, id: `${grupo}-${idx}`, date: parseMatchDate(m.fecha, m.hora) });
    });
  });
  list.sort((a, b) => a.date - b.date);
  return list;
}

function getUniqueDates() {
  const all = getAllMatchesSorted();
  const seen = new Set();
  const dates = [];
  all.forEach(m => {
    if (!seen.has(m.fecha)) { seen.add(m.fecha); dates.push(m.fecha); }
  });
  return dates;
}

function getUserPoints() {
  // Lee los puntos acumulados desde localStorage (escritos por admin.js)
  if (!currentPlayer) return 0;
  return parseInt(localStorage.getItem(`kiniela_total_points_${currentPlayer}`) || '0', 10);
}

function getUserRankPosition() {
  // All players at 0 pts; current player is position 1 until real results are added
  return currentPlayer ? PLAYERS.indexOf(currentPlayer) + 1 : '—';
}

// ── Tab Navigation ─────────────────────────────────────────

function switchTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const section = document.getElementById(`tab-${tabName}`);
  if (section) section.classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
  if (btn) btn.classList.add('active');

  if (tabName === 'dashboard') renderDashboard();
  if (tabName === 'partidos') renderPartidosTab();
  if (tabName === 'grupos') renderGruposTab();
  if (tabName === 'ranking') renderRankingTab();
}

// ── Header ────────────────────────────────────────────────

function updateHeader() {
  const pts = getUserPoints();
  const av = document.getElementById('header-avatar');
  av.textContent = getInitial(currentPlayer);
  av.style.background = currentPlayer ? playerColor(currentPlayer) : 'var(--border)';
  document.getElementById('header-points').textContent = currentPlayer ? `${pts} pts` : '';
}

// ── Dashboard Tab ─────────────────────────────────────────

function renderDashboard() {
  updateHeader();
  renderPlayerSelectorSection();
  const pts = getUserPoints();

  // Hero
  document.getElementById('hero-avatar').textContent = getInitial(currentPlayer);
  document.getElementById('hero-name').textContent = currentPlayer || 'Usuario';
  document.getElementById('hero-points').textContent = pts;
  const pos = getUserRankPosition();
  document.getElementById('hero-position').textContent = `#${pos} en el ranking`;

  // Alerts
  const alertPred = document.getElementById('alert-predictions');
  const openMatches = countOpenMatches();
  const predictedCount = countPredictedMatches();
  if (predictedCount < openMatches && openMatches > 0) {
    alertPred.classList.remove('hidden');
    alertPred.querySelector('.alert-text strong').textContent = `${openMatches - predictedCount} partido(s) sin pronosticar`;
  } else {
    alertPred.classList.add('hidden');
  }

  const alertGroups = document.getElementById('alert-groups');
  if (!areGroupsLocked()) {
    const ms = GROUPS_DEADLINE - nowInMadrid();
    const cd = msToCountdown(ms);
    if (cd && ms < 48 * 3600 * 1000) {
      alertGroups.classList.remove('hidden');
      document.getElementById('alert-groups-countdown').textContent = `Cierra en ${cd}`;
    } else {
      alertGroups.classList.add('hidden');
    }
  } else {
    alertGroups.classList.add('hidden');
  }

  // Next 3 unlocked upcoming matches
  const allMatches = getAllMatchesSorted();
  const now = nowInMadrid();
  const upcoming = allMatches.filter(m => m.date > now && !isMatchLocked(m.fecha, m.hora)).slice(0, 3);
  const nextMatchesEl = document.getElementById('next-matches');
  if (upcoming.length === 0) {
    nextMatchesEl.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><p>No hay próximos partidos abiertos</p></div>';
  } else {
    nextMatchesEl.innerHTML = upcoming.map(m => `
      <div class="mini-match-card" data-tab="partidos" data-fecha="${m.fecha}" role="button" tabindex="0">
        <span class="mini-match-group">Grupo ${m.grupo}</span>
        <div class="mini-match-teams">
          <span class="mini-match-flag">${flag(m.local)}</span>
          <span>${m.local}</span>
          <span class="mini-match-vs">vs</span>
          <span>${m.visitante}</span>
          <span class="mini-match-flag">${flag(m.visitante)}</span>
        </div>
        <div class="mini-match-time">
          <div>${m.fecha}</div>
          <div>${m.hora}</div>
        </div>
      </div>
    `).join('');
    nextMatchesEl.querySelectorAll('.mini-match-card').forEach(card => {
      card.addEventListener('click', () => {
        const fecha = card.dataset.fecha;
        switchTab('partidos');
        setTimeout(() => selectDateTab(fecha), 50);
      });
    });
  }

  // Stats
  document.getElementById('stat-predicted').textContent = countPredictedMatches();
  document.getElementById('stat-groups').textContent = countGroupsOrdered();
  document.getElementById('stat-open').textContent = countOpenMatches();
}

// ── Partidos Tab ──────────────────────────────────────────

function renderPartidosTab() {
  renderDateTabs();
}

function renderDateTabs() {
  const dates = getUniqueDates();
  const container = document.getElementById('date-tabs');
  container.innerHTML = '';

  // default: first date with open matches, or first date
  if (!activeDateTab || !dates.includes(activeDateTab)) {
    const allM = getAllMatchesSorted();
    const now = new Date();
    const firstOpen = allM.find(m => !isMatchLocked(m.fecha, m.hora));
    activeDateTab = firstOpen ? firstOpen.fecha : (dates[0] || null);
  }

  dates.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'date-tab' + (d === activeDateTab ? ' active' : '');
    btn.textContent = d;
    btn.addEventListener('click', () => selectDateTab(d));
    container.appendChild(btn);
  });

  renderMatchesForDate(activeDateTab);
}

function selectDateTab(fecha) {
  activeDateTab = fecha;
  document.querySelectorAll('.date-tab').forEach(b => {
    b.classList.toggle('active', b.textContent === fecha);
  });
  renderMatchesForDate(fecha);
  // Scroll selected tab into view
  const active = document.querySelector('.date-tab.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function renderMatchesForDate(fecha) {
  // Clear old badge intervals
  badgeIntervals.forEach(id => clearInterval(id));
  badgeIntervals = [];

  const allMatches = getAllMatchesSorted();
  const filtered = allMatches.filter(m => m.fecha === fecha);
  const container = document.getElementById('matches-list');
  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>Sin partidos este día</p></div>';
    return;
  }

  filtered.forEach(m => {
    const card = renderMatchCard(m);
    container.appendChild(card);
  });
}

function renderMatchCard(m) {
  const { grupo, idx, local, visitante, fecha, hora } = m;
  const pred = getMatchPrediction(grupo, idx);
  const status = getMatchLockStatus(fecha, hora, m.id);
  const locked = status.locked;

  const localPlayers = getPlayers(local);
  const visitantePlayers = getPlayers(visitante);
  const allPlayers = [...localPlayers, ...visitantePlayers];

  const card = document.createElement('div');
  card.className = 'match-card';
  card.id = `card-${grupo}-${idx}`;

  const scoreLoc = pred.golesLocal != null ? pred.golesLocal : null;
  const scoreVis = pred.golesVisitante != null ? pred.golesVisitante : null;

  card.innerHTML = `
    <div class="match-card-header">
      <span class="match-group-badge">Grupo ${grupo}</span>
      <span class="match-time">${hora}</span>
      <span class="match-status-badge ${status.cls}" data-badge="${grupo}-${idx}">${status.label}</span>
    </div>
    <div class="match-card-body">
      <div class="match-teams-row">
        <div class="match-team">
          <span class="match-team-flag">${flag(local)}</span>
          <span class="match-team-name">${local}</span>
        </div>
        <div class="match-score-row">
          <div class="score-input-group">
            <button class="score-btn" data-action="dec" data-team="local" data-grupo="${grupo}" data-idx="${idx}" ${locked ? 'disabled' : ''}>−</button>
            <div class="score-display${scoreLoc != null ? ' has-value' : ''}" id="score-local-${grupo}-${idx}">${scoreLoc != null ? scoreLoc : '–'}</div>
            <button class="score-btn" data-action="inc" data-team="local" data-grupo="${grupo}" data-idx="${idx}" ${locked ? 'disabled' : ''}>+</button>
          </div>
          <span class="score-sep">:</span>
          <div class="score-input-group">
            <button class="score-btn" data-action="dec" data-team="visitante" data-grupo="${grupo}" data-idx="${idx}" ${locked ? 'disabled' : ''}>−</button>
            <div class="score-display${scoreVis != null ? ' has-value' : ''}" id="score-vis-${grupo}-${idx}">${scoreVis != null ? scoreVis : '–'}</div>
            <button class="score-btn" data-action="inc" data-team="visitante" data-grupo="${grupo}" data-idx="${idx}" ${locked ? 'disabled' : ''}>+</button>
          </div>
        </div>
        <div class="match-team">
          <span class="match-team-flag">${flag(visitante)}</span>
          <span class="match-team-name">${visitante}</span>
        </div>
      </div>

      <!-- Sign selector -->
      <div class="sign-row">
        ${['1','X','2'].map(s => {
          const labelText = s === '1' ? local : s === '2' ? visitante : 'Empate';
          const isActive = pred.sign === s;
          return `<button class="sign-btn${isActive ? ' active' : ''}" data-sign="${s}" data-grupo="${grupo}" data-idx="${idx}" ${locked ? 'disabled' : ''}>
            <span class="sign-key">${s}</span>
            <span>${labelText.length > 10 ? labelText.substring(0,9)+'…' : labelText}</span>
          </button>`;
        }).join('')}
      </div>

      <!-- First scorer -->
      <div class="scorer-row">
        <div class="scorer-label">⚡ Primer goleador</div>
        <select class="scorer-select" id="scorer-${grupo}-${idx}" ${locked ? 'disabled' : ''}>
          <option value="">Sin goles / No seleccionado</option>
          ${allPlayers.length > 0 ? `
            <optgroup label="${local}">
              ${localPlayers.map(p => {
                const full = `${p.nombre} ${p.apellido}`;
                return `<option value="${full}" ${pred.firstScorer === full ? 'selected' : ''}>${full}</option>`;
              }).join('')}
            </optgroup>
            <optgroup label="${visitante}">
              ${visitantePlayers.map(p => {
                const full = `${p.nombre} ${p.apellido}`;
                return `<option value="${full}" ${pred.firstScorer === full ? 'selected' : ''}>${full}</option>`;
              }).join('')}
            </optgroup>
          ` : '<option value="" disabled>Sin jugadores disponibles</option>'}
        </select>
      </div>

      ${locked ? '<div class="match-locked-note">🔒 Este partido está cerrado. No puedes modificar el pronóstico.</div>' : ''}
    </div>
  `;

  // ── Desglose de puntos (solo si el partido está finalizado y evaluado) ──
  const results = JSON.parse(localStorage.getItem('kiniela_results') || '{}');
  const matchResult = results[m.id];
  const predBreakdown = pred.points; // seteado por admin.js al puntuar

  if (matchResult && predBreakdown) {
    const realScorer = matchResult.firstScorer || 'Ninguno';
    const predScorer = pred.firstScorer || 'Ninguno';

    const hit  = (ok) => ok ? '✅' : '❌';
    const row  = document.createElement('div');
    row.className = 'match-result-row';
    row.innerHTML = `
      <div class="result-row-real">
        <span class="result-row-label">Resultado:</span>
        <strong>${local} ${matchResult.golesLocal} – ${matchResult.golesVisitante} ${visitante}</strong>
        <span class="result-row-scorer">⚡ ${realScorer}</span>
      </div>
      <div class="result-row-pred">
        <span class="result-row-label">Tu quiniela:</span>
        ${local} ${pred.golesLocal != null ? pred.golesLocal : '—'} – ${pred.golesVisitante != null ? pred.golesVisitante : '—'} ${visitante}
        <span class="result-row-scorer">⚡ ${predScorer}</span>
      </div>
      <div class="result-row-pts">
        <span>${hit(predBreakdown.sign)} Signo +${predBreakdown.sign}</span>
        <span>${hit(predBreakdown.golesLocal)} G.Local +${predBreakdown.golesLocal}</span>
        <span>${hit(predBreakdown.golesVisitante)} G.Visit. +${predBreakdown.golesVisitante}</span>
        <span>${hit(predBreakdown.firstScorer)} Goleador +${predBreakdown.firstScorer}</span>
        <strong class="result-total">= ${predBreakdown.total} pts</strong>
      </div>
    `;
    card.querySelector('.match-card-body').appendChild(row);
  }

  // Score buttons
  card.querySelectorAll('.score-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const team = btn.dataset.team;
      const g = btn.dataset.grupo;
      const i = parseInt(btn.dataset.idx, 10);
      const p = getMatchPrediction(g, i);
      const field = team === 'local' ? 'golesLocal' : 'golesVisitante';
      const dispId = team === 'local' ? `score-local-${g}-${i}` : `score-vis-${g}-${i}`;
      const disp = document.getElementById(dispId);
      let val = p[field] != null ? p[field] : (action === 'inc' ? -1 : 0);
      if (action === 'inc') val = Math.min(val + 1, 20);
      if (action === 'dec') val = Math.max(val - 1, 0);
      setMatchPrediction(g, i, { [field]: val });
      if (disp) {
        disp.textContent = val;
        disp.classList.add('has-value');
      }
      updateDashboardStats();
    });
  });

  // Sign buttons
  card.querySelectorAll('.sign-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sign = btn.dataset.sign;
      const g = btn.dataset.grupo;
      const i = parseInt(btn.dataset.idx, 10);
      const current = getMatchPrediction(g, i).sign;
      const newSign = current === sign ? null : sign;
      setMatchPrediction(g, i, { sign: newSign });
      // Update UI
      card.querySelectorAll('.sign-btn').forEach(b => b.classList.remove('active'));
      if (newSign) btn.classList.add('active');
      updateDashboardStats();
    });
  });

  // Scorer select
  const scorerSel = card.querySelector(`#scorer-${grupo}-${idx}`);
  if (scorerSel) {
    scorerSel.addEventListener('change', () => {
      setMatchPrediction(grupo, idx, { firstScorer: scorerSel.value });
    });
  }

  // Live badge countdown
  if (status.live && status.lockTime) {
    const badgeEl = card.querySelector(`[data-badge="${grupo}-${idx}"]`);
    if (badgeEl) {
      const id = setInterval(() => {
        const ms = status.lockTime - nowInMadrid();
        if (ms <= 0) {
          clearInterval(id);
          badgeEl.textContent = '🔒 Cerrado';
          badgeEl.className = 'match-status-badge badge-closed';
          // Disable controls
          card.querySelectorAll('button, select').forEach(el => el.disabled = true);
        } else {
          const cd = msToCountdown(ms);
          badgeEl.textContent = `⏱ Cierra en ${cd}`;
        }
      }, 1000);
      badgeIntervals.push(id);
    }
  }

  return card;
}

// ── Grupos Tab ─────────────────────────────────────────────

function renderGruposTab() {
  renderGruposBanner();
  renderGroupTabs();
  renderGroupContent(activeGroupTab);
}

function renderGruposBanner() {
  const banner = document.getElementById('grupos-banner');
  if (areGroupsLocked()) {
    banner.innerHTML = '<div class="deadline-closed">🔒 Clasificación de grupos cerrada</div>';
  } else {
    const ms = GROUPS_DEADLINE - nowInMadrid();
    const cd = msToCountdown(ms);
    banner.innerHTML = `<div class="deadline-open">⏰ Grupos cierran el 11 jun a las 21:00${cd ? ' — en ' + cd : ''}</div>`;
  }
}

function renderGroupTabs() {
  const list = document.getElementById('group-tab-list');
  list.innerHTML = '';
  const groups = Object.keys(matchesData.grupos);
  groups.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'group-tab-btn' + (g === activeGroupTab ? ' active' : '');
    btn.textContent = g;
    btn.addEventListener('click', () => {
      activeGroupTab = g;
      document.querySelectorAll('.group-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGroupContent(g);
    });
    list.appendChild(btn);
  });
}

function renderGroupContent(grupo) {
  const content = document.getElementById('group-content');
  const teams = groupPredictions[grupo] || [];
  const locked = areGroupsLocked();

  content.innerHTML = `<div class="group-title">Grupo ${grupo}</div><div class="group-team-list" id="group-list-${grupo}"></div>`;
  const listEl = document.getElementById(`group-list-${grupo}`);

  teams.forEach((team, i) => {
    const item = createGroupTeamItem(grupo, team, i, teams.length, locked);
    listEl.appendChild(item);
  });

  if (!locked) {
    setupDragDrop(listEl, grupo);
  }
}

function createGroupTeamItem(grupo, team, idx, total, locked) {
  const item = document.createElement('div');
  item.className = 'group-team-item';
  item.dataset.team = team;
  item.dataset.idx = idx;
  if (!locked) {
    item.draggable = true;
    item.setAttribute('aria-grabbed', 'false');
  }

  item.innerHTML = `
    <span class="group-pos">${getPositionLabel(idx)}</span>
    <span class="group-flag">${flag(team)}</span>
    <span class="group-name">${team}</span>
    <div class="group-arrows">
      <button class="arrow-btn" data-dir="up" ${idx === 0 || locked ? 'disabled' : ''} title="Subir">↑</button>
      <button class="arrow-btn" data-dir="down" ${idx === total - 1 || locked ? 'disabled' : ''} title="Bajar">↓</button>
    </div>
  `;

  item.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.dir;
      moveTeam(grupo, idx, dir === 'up' ? idx - 1 : idx + 1);
    });
  });

  return item;
}

function moveTeam(grupo, fromIdx, toIdx) {
  const teams = [...groupPredictions[grupo]];
  if (toIdx < 0 || toIdx >= teams.length) return;
  [teams[fromIdx], teams[toIdx]] = [teams[toIdx], teams[fromIdx]];
  groupPredictions[grupo] = teams;
  saveStorage();
  renderGroupContent(grupo);
  updateDashboardStats();
}

function setupDragDrop(listEl, grupo) {
  let dragSrcIdx = null;

  listEl.addEventListener('dragstart', e => {
    const item = e.target.closest('.group-team-item');
    if (!item) return;
    dragSrcIdx = parseInt(item.dataset.idx, 10);
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  listEl.addEventListener('dragend', e => {
    const item = e.target.closest('.group-team-item');
    if (item) item.classList.remove('dragging');
    listEl.querySelectorAll('.group-team-item').forEach(el => el.classList.remove('drag-over'));
    dragSrcIdx = null;
  });

  listEl.addEventListener('dragover', e => {
    e.preventDefault();
    const item = e.target.closest('.group-team-item');
    if (!item) return;
    listEl.querySelectorAll('.group-team-item').forEach(el => el.classList.remove('drag-over'));
    item.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';
  });

  listEl.addEventListener('dragleave', e => {
    const item = e.target.closest('.group-team-item');
    if (item) item.classList.remove('drag-over');
  });

  listEl.addEventListener('drop', e => {
    e.preventDefault();
    const item = e.target.closest('.group-team-item');
    if (!item || dragSrcIdx === null) return;
    const destIdx = parseInt(item.dataset.idx, 10);
    if (dragSrcIdx !== destIdx) {
      const teams = [...groupPredictions[grupo]];
      const moved = teams.splice(dragSrcIdx, 1)[0];
      teams.splice(destIdx, 0, moved);
      groupPredictions[grupo] = teams;
      saveStorage();
      renderGroupContent(grupo);
      updateDashboardStats();
    }
    dragSrcIdx = null;
  });
}

// ── Ranking Tab ────────────────────────────────────────────

function renderRankingTab() {
  document.getElementById('ranking-hero-pos').textContent = currentPlayer ? `#${getUserRankPosition()}` : '—';

  // Build leaderboard with all real players (0 pts until results come in)
  const entries = PLAYERS.map(name => ({
    name,
    points: 0, // all start at 0; scoring will be implemented when results are added
    me: name === currentPlayer
  }));
  entries.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

  const lb = document.getElementById('leaderboard');
  lb.innerHTML = entries.map((e, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    const rankCls = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
    return `
      <div class="leaderboard-row${e.me ? ' me' : ''}">
        <div class="lb-rank ${rankCls}">${medal}</div>
        <div class="lb-avatar${e.me ? ' me-av' : ''}" style="background:${playerColor(e.name)}">${getInitial(e.name)}</div>
        <div class="lb-name">${e.name}${e.me ? ' <span style="font-size:11px;color:var(--accent)">(tú)</span>' : ''}</div>
        <div>
          <span class="lb-points">${e.points}</span>
          <span class="lb-pts-label"> pts</span>
        </div>
      </div>
    `;
  }).join('');
}

// ── Utility: update dashboard stats without full re-render ──

function updateDashboardStats() {
  if (activeTab !== 'dashboard') return;
  document.getElementById('stat-predicted').textContent = countPredictedMatches();
  document.getElementById('stat-groups').textContent = countGroupsOrdered();
  document.getElementById('stat-open').textContent = countOpenMatches();
}

// ── Global Countdown (header) ──────────────────────────────

function startGlobalCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (activeTab === 'dashboard') {
      const alertGroups = document.getElementById('alert-groups');
      if (!areGroupsLocked() && !alertGroups.classList.contains('hidden')) {
        const ms = GROUPS_DEADLINE - nowInMadrid();
        const cd = msToCountdown(ms);
        const span = document.getElementById('alert-groups-countdown');
        if (span) span.textContent = cd ? `Cierra en ${cd}` : '';
      }
    }
    if (activeTab === 'grupos') {
      renderGruposBanner();
    }
  }, 1000);
}

// ── Player Selector ────────────────────────────────────────

function renderPlayerSelectorSection() {
  const el = document.getElementById('player-selector-section');
  if (!el) return;

  const isExpanded = !currentPlayer;

  el.innerHTML = `
    <div class="player-selector-card ${isExpanded ? 'expanded' : 'collapsed'}">
      <div class="player-selector-header" id="player-selector-toggle">
        ${currentPlayer ? `
          <div class="player-current">
            <div class="player-av-sm" style="background:${playerColor(currentPlayer)}">${getInitial(currentPlayer)}</div>
            <span class="player-current-name">${currentPlayer}</span>
          </div>
          <button class="player-change-btn">Cambiar</button>
        ` : `
          <span class="player-prompt">⚽ ¿Quién eres?</span>
        `}
      </div>
      <div class="player-grid" id="player-grid" ${!isExpanded ? 'style="display:none"' : ''}>
        ${PLAYERS.map(p => `
          <button class="player-grid-btn ${currentPlayer === p ? 'selected' : ''}"
                  onclick="selectPlayer('${p}')">
            <div class="player-av-lg" style="background:${playerColor(p)}">${getInitial(p)}</div>
            <span>${p}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Toggle grid on "Cambiar" click
  el.querySelector('#player-selector-toggle')?.addEventListener('click', (e) => {
    if (e.target.closest('.player-grid-btn')) return;
    const grid = el.querySelector('#player-grid');
    if (grid) {
      const hidden = grid.style.display === 'none';
      grid.style.display = hidden ? 'grid' : 'none';
    }
  });
}

function playerColor(name) {
  const idx = PLAYERS.indexOf(name);
  return PLAYER_COLORS[idx >= 0 ? idx : 0];
}

// ── Boot ───────────────────────────────────────────────────

function bootApp() {
  updateHeader();
  renderDashboard();
  startGlobalCountdown();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.getElementById('alert-predictions').addEventListener('click', () => switchTab('partidos'));
  document.getElementById('alert-groups').addEventListener('click', () => switchTab('grupos'));
}

// ── Data Loading ───────────────────────────────────────────

async function loadData() {
  const [matchesRes, playersRes] = await Promise.all([
    fetch('matches.json'),
    fetch('players.json')
  ]);
  matchesData = await matchesRes.json();
  playersData = await playersRes.json();
  buildPlayersMap();
}

// ── Entry Point ────────────────────────────────────────────

async function main() {
  loadStorage();

  try {
    await loadData();
  } catch (err) {
    console.error('Error loading data:', err);
    document.body.innerHTML = `
      <div style="padding:40px;text-align:center;color:#e8eaf0;font-family:sans-serif;">
        <h2 style="color:#e63946">Error al cargar datos</h2>
        <p>Asegúrate de lanzar la app con:</p>
        <code style="background:#1e2538;padding:8px 16px;border-radius:8px;display:inline-block;margin-top:12px;color:#f5c518">
          python3 -m http.server 3000
        </code>
      </div>`;
    return;
  }

  initDefaultGroups();
  bootApp();
}

document.addEventListener('DOMContentLoaded', main);
