/* ============================================================
   KINIELA MUNDIAL 2026 — app.js
   Main user-facing SPA — Supabase backend
   ============================================================ */

'use strict';

// ── Supabase Config ────────────────────────────────────────

const SUPABASE_URL = 'https://opudnzjgyswwjpindeat.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZUhLIbEjBORppt2rSSLgSw_M_BI4aw0';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Constants ──────────────────────────────────────────────

const GROUPS_DEADLINE         = new Date(2026, 5, 11, 21, 0, 0); // June 11 2026 21:00 Madrid time
const GROUPS_DEADLINE_XAVI    = new Date(2026, 5, 11, 23, 0, 0); // XaviCarbu extended deadline
const GROUPS_DEADLINE_RIBINHA = new Date(2026, 5, 14, 19, 0, 0); // Ribinha extended deadline — June 14 19:00
const SPECIAL_DEADLINE        = new Date(2026, 5, 11, 21, 0, 0); // same — first match kickoff
const SPECIAL_DEADLINE_RIBINHA = new Date(2026, 5, 14, 19, 0, 0); // Ribinha special predictions deadline

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
  "Cold Garmer", "Luisgarrincha", "Ribinha", "Guishermo Casadinho",
  "DaniTwangy", "Dudu", "XaviCarbu", "MarkusRashford", "BusiCusi",
  "BoxToBox", "Aleix"
];

const PLAYER_COLORS = [
  '#e63946', '#f5c518', '#2ecc71', '#3498db',
  '#e67e22', '#1abc9c', '#e91e63', '#00bcd4', '#ff5722',
  '#8e44ad', '#27ae60'
];

const PLAYER_PINS = {
  "Cold Garmer":         "0000",
  "Luisgarrincha":       "4944",
  "Ribinha":             "2323",
  "Guishermo Casadinho": "3232",
  "DaniTwangy":          "6767",
  "Dudu":                "8923",
  "XaviCarbu":           "1313",
  "MarkusRashford":      "1021",
  "BusiCusi":            "7943",
  "BoxToBox":            "9999",
  "Aleix":               "8888"
};

// ── Player slug helpers ────────────────────────────────────

function nameToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

const SLUG_TO_NAME = Object.fromEntries(PLAYERS.map(n => [nameToSlug(n), n]));

function getPlayerFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('u') || '';
}

function selectPlayer(player) {
  const slug = nameToSlug(player);
  window.location.href = `?u=${slug}`;
}

// ── State ──────────────────────────────────────────────────

let matchesData = null;        // from matches.json
let playersData = null;        // from players.json
let playersByEnglish = {};     // { "Spain": [{nombre, apellido},...] }

let currentPlayer = '';        // "Cold Garmer"
let currentPlayerSlug = '';    // "cold-garmer"

let predictions = {};          // { "A-0": { sign, golesLocal, golesVisitante, firstScorer, points } }
let groupPredictions = {};     // { "A": ["España",...] }

let matchResultsCache = {};    // { "A-0": { golesLocal, golesVisitante, firstScorer } }
let groupResultsCache = {};    // { "A": ["España",...] }
let playerPointsCache = {};    // { "cold-garmer": 42, ... }

let activeTab = 'dashboard';
let activeDateTab = null;
let activeGroupTab = 'A';
let countdownInterval = null;
let badgeIntervals = [];

let unsavedMatchPreds = new Set();  // match IDs with unsaved changes (unused for dirty tracking, just for reference)
let apuestasPlayer = '';  // slug of player selected in Apuestas tab
let historicoCache = {};  // { matchId: predRows[] } — fetched on demand

let specialPredictions = {}; // { mvp, top_scorer, top_assister, golden_glove, revelation_team, disappointment_team }
let specialResults     = null; // same shape — actual winners set by admin

// ── Madrid Time ────────────────────────────────────────────

function nowInMadrid() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
}

// ── Date / lock helpers ────────────────────────────────────

function parseMatchDate(fecha, hora) {
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
  let deadline = GROUPS_DEADLINE;
  if (currentPlayerSlug === 'xavicarbu') deadline = GROUPS_DEADLINE_XAVI;
  if (currentPlayerSlug === 'ribinha') deadline = GROUPS_DEADLINE_RIBINHA;
  return nowInMadrid() >= deadline;
}

function areSpecialsLocked() {
  if (currentPlayerSlug === 'ribinha') return nowInMadrid() >= SPECIAL_DEADLINE_RIBINHA;
  return nowInMadrid() >= SPECIAL_DEADLINE;
}

function msToCountdown(ms) {
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const days  = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins  = Math.floor((totalSec % 3600) / 60);
  const secs  = totalSec % 60;
  if (days  > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m ${secs}s`;
}

function getMatchLockStatus(fecha, hora, matchId) {
  // Special unlock: Luisgarrincha can re-enter his prediction for Brasil vs Marruecos (C-0)
  if (matchId === 'C-0' && currentPlayerSlug === 'luisgarrincha') {
    return { locked: false, label: '🔓 Edición especial', cls: 'badge-soon' };
  }

  // If the match has a recorded result it is finished
  if (matchId && matchResultsCache[matchId]) {
    return { locked: true, label: '✅ Finalizado', cls: 'badge-finished', finished: true };
  }

  const kickoff = parseMatchDate(fecha, hora);
  const now = nowInMadrid();
  const diffMs = kickoff - now;

  if (now >= kickoff) return { locked: true, label: '🔒 Cerrado', cls: 'badge-closed' };

  if (diffMs < 2 * 3600 * 1000) {
    const cd = msToCountdown(diffMs);
    return { locked: false, label: `⏱ Cierra en ${cd}`, cls: 'badge-soon', live: true, lockTime: kickoff };
  }

  return { locked: false, label: '🟢 Abierto', cls: 'badge-open' };
}

// ── Generic helpers ────────────────────────────────────────

function flag(team) {
  return FLAG_MAP[team] || '🏳';
}

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

function playerColor(name) {
  const idx = PLAYERS.indexOf(name);
  return PLAYER_COLORS[idx >= 0 ? idx : 0];
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

// ── Supabase data loading ──────────────────────────────────

async function loadSupabaseData() {
  const queries = [
    sb.from('match_results').select('*'),
    sb.from('group_results').select('*'),
    sb.from('player_points').select('*')
  ];

  queries.push(sb.from('special_results').select('*').eq('id', 'final').maybeSingle());

  if (currentPlayerSlug) {
    queries.push(
      sb.from('predictions').select('*').eq('player_id', currentPlayerSlug),
      sb.from('group_predictions').select('*').eq('player_id', currentPlayerSlug),
      sb.from('special_predictions').select('*').eq('player_id', currentPlayerSlug).maybeSingle()
    );
  }

  const results = await Promise.all(queries);
  const [matchRes, groupRes, ptsRes, specResRes] = results;
  const predRes    = results[4] || null;
  const grpPredRes = results[5] || null;
  const specPredRes = results[6] || null;

  // match_results
  matchResultsCache = {};
  (matchRes.data || []).forEach(r => {
    matchResultsCache[r.match_id] = {
      golesLocal:    r.goles_local,
      golesVisitante: r.goles_visitante,
      firstScorer:   r.first_scorer,
      mvp:           r.mvp    || '',
      winner:        r.winner || ''
    };
  });

  // group_results
  groupResultsCache = {};
  (groupRes.data || []).forEach(r => {
    groupResultsCache[r.grupo] = r.positions;
  });

  // player_points
  playerPointsCache = {};
  (ptsRes.data || []).forEach(r => {
    playerPointsCache[r.player_id] = { total: r.total || 0, special_total: r.special_total || 0 };
  });

  // predictions (current player only)
  predictions = {};
  if (predRes) {
    (predRes.data || []).forEach(r => {
      predictions[r.match_id] = {
        sign:           r.sign,
        golesLocal:     r.goles_local,
        golesVisitante: r.goles_visitante,
        firstScorer:    r.first_scorer,
        mvpPred:        r.mvp_pred || null,
        points:         r.points
      };
    });
  }

  // group_predictions (current player only)
  groupPredictions = {};
  if (grpPredRes) {
    (grpPredRes.data || []).forEach(r => {
      groupPredictions[r.grupo] = r.positions;
      if (r.evaluated && r.points) {
        groupPredictions[r.grupo + '_points'] = r.points;
        groupPredictions[r.grupo + '_evaluated'] = true;
      }
    });
  }

  // special_results (admin-set winners)
  specialResults = specResRes?.data || null;

  // special_predictions (current player only)
  specialPredictions = {};
  if (specPredRes?.data) {
    const r = specPredRes.data;
    specialPredictions = {
      mvp:               r.mvp               || null,
      top_scorer:        r.top_scorer        || null,
      top_assister:      r.top_assister      || null,
      golden_glove:      r.golden_glove      || null,
      revelation_team:   r.revelation_team   || null,
      disappointment_team: r.disappointment_team || null
    };
  }
}

// ── Saving predictions ─────────────────────────────────────

// Update prediction in memory only (no Supabase)
function updatePrediction(grupo, idx, update) {
  const key = `${grupo}-${idx}`;
  predictions[key] = { ...predictions[key], ...update };
}

// Persist current prediction to Supabase (called from save button)
async function persistPrediction(grupo, idx) {
  if (!currentPlayerSlug) return;
  const key = `${grupo}-${idx}`;
  const p = predictions[key] || {};
  const { error } = await sb.from('predictions').upsert({
    player_id:       currentPlayerSlug,
    match_id:        key,
    sign:            p.sign           ?? null,
    goles_local:     p.golesLocal     ?? null,
    goles_visitante: p.golesVisitante ?? null,
    first_scorer:    p.firstScorer    ?? null,
    mvp_pred:        p.mvpPred        ?? null
  }, { onConflict: 'player_id,match_id' });
  if (error) throw error;
}

// Persist group prediction to Supabase (called from save button)
async function persistGroupPrediction(grupo) {
  if (!currentPlayerSlug) return;
  const positions = getGroupOrder(grupo);
  const { error } = await sb.from('group_predictions').upsert({
    player_id: currentPlayerSlug,
    grupo,
    positions
  }, { onConflict: 'player_id,grupo' });
  if (error) throw error;
  groupPredictions[grupo] = positions;
}

// Show saved feedback on a button
function showSavedFeedback(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = '✅ Guardado';
  btn.disabled = true;
  btn.classList.add('btn-save-done');
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.disabled = false;
    btn.classList.remove('btn-save-done');
  }, 2000);
}

// ── Key helpers ────────────────────────────────────────────

function getGroupOrder(grupo) {
  if (groupPredictions[grupo]) return groupPredictions[grupo];
  const matches = matchesData?.grupos[grupo] || [];
  const seen = [];
  matches.forEach(m => {
    if (!seen.includes(m.local)) seen.push(m.local);
    if (!seen.includes(m.visitante)) seen.push(m.visitante);
  });
  return seen.slice(0, 4);
}

function getTotalPoints(slug) {
  const cache = playerPointsCache[slug] || { total: 0, special_total: 0 };
  return (cache.total || 0) + (cache.special_total || 0);
}

function getUserPoints() {
  return getTotalPoints(currentPlayerSlug);
}

function getUserRankPosition() {
  if (!currentPlayerSlug) return '—';
  const sorted = PLAYERS
    .map(n => ({ slug: nameToSlug(n), pts: getTotalPoints(nameToSlug(n)) }))
    .sort((a, b) => b.pts - a.pts);
  const idx = sorted.findIndex(e => e.slug === currentPlayerSlug);
  return idx >= 0 ? idx + 1 : '—';
}

function getMatchPrediction(grupo, idx) {
  const key = `${grupo}-${idx}`;
  return predictions[key] || {};
}

function countPredictedMatches() {
  return Object.keys(predictions).filter(k => {
    const p = predictions[k];
    return p.sign || p.golesLocal != null || p.golesVisitante != null;
  }).length;
}

function countGroupsOrdered() {
  return Object.keys(groupPredictions).filter(k => !k.includes('_')).length;
}

function countOpenMatches() {
  if (!matchesData) return 0;
  let count = 0;
  Object.entries(matchesData.grupos).forEach(([, matches]) => {
    matches.forEach(m => {
      if (!isMatchLocked(m.fecha, m.hora)) count++;
    });
  });
  (matchesData.dieciseisavos || []).forEach(m => {
    if (!isMatchLocked(m.fecha, m.hora)) count++;
  });
  return count;
}

function getAllMatchesSorted() {
  if (!matchesData) return [];
  const list = [];
  Object.entries(matchesData.grupos).forEach(([grupo, matches]) => {
    matches.forEach((m, idx) => {
      list.push({ ...m, grupo, idx, id: `${grupo}-${idx}`, fase: `Grupo ${grupo}`, date: parseMatchDate(m.fecha, m.hora) });
    });
  });
  (matchesData.dieciseisavos || []).forEach((m, idx) => {
    list.push({ ...m, grupo: 'D32', idx, id: `D32-${idx}`, fase: 'Dieciseisavos', date: parseMatchDate(m.fecha, m.hora) });
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

// ── Tab Navigation ─────────────────────────────────────────

function switchTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const section = document.getElementById(`tab-${tabName}`);
  if (section) section.classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
  if (btn) btn.classList.add('active');

  if (tabName === 'dashboard')           renderDashboard();
  if (tabName === 'partidos')            renderPartidosTab();
  if (tabName === 'grupos')              renderGruposTab();
  if (tabName === 'ranking')             renderRankingTab();
  if (tabName === 'apuestas')            renderApuestasTab();
  if (tabName === 'misapuestas')         renderMisApuestasTab();
  if (tabName === 'jugadores')           renderJugadoresTab();
  if (tabName === 'historico')           renderEvolucionTab();
  if (tabName === 'especiales-ribinha')  renderEspecialesRibinhaTab();
}

// ── Header ─────────────────────────────────────────────────

function updateHeader() {
  const pts = getUserPoints();
  const av = document.getElementById('header-avatar');
  av.textContent = getInitial(currentPlayer);
  av.style.background = currentPlayer ? playerColor(currentPlayer) : 'var(--border)';
  document.getElementById('header-points').textContent = currentPlayer ? `${pts} pts` : '';
}

// ── Dashboard Tab ──────────────────────────────────────────

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
    alertPred.querySelector('.alert-text strong').textContent =
      `${openMatches - predictedCount} partido(s) sin pronosticar`;
  } else {
    alertPred.classList.add('hidden');
  }

  const alertGroups = document.getElementById('alert-groups');
  if (!areGroupsLocked()) {
    let deadline = GROUPS_DEADLINE;
    if (currentPlayerSlug === 'xavicarbu') deadline = GROUPS_DEADLINE_XAVI;
    if (currentPlayerSlug === 'ribinha') deadline = GROUPS_DEADLINE_RIBINHA;
    const ms = deadline - nowInMadrid();
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
  const upcoming = allMatches
    .filter(m => m.date > now && !isMatchLocked(m.fecha, m.hora))
    .slice(0, 3);
  const nextMatchesEl = document.getElementById('next-matches');
  if (upcoming.length === 0) {
    nextMatchesEl.innerHTML =
      '<div class="empty-state"><div class="empty-icon">✅</div><p>No hay próximos partidos abiertos</p></div>';
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
  document.getElementById('stat-groups').textContent    = countGroupsOrdered();
  document.getElementById('stat-open').textContent      = countOpenMatches();

  // Histórico
  renderHistorico();
}

// ── Partidos Tab ───────────────────────────────────────────

function renderPartidosTab() {
  renderDateTabs();
  // Refresca resultados en segundo plano para mostrar el tick sin recargar la página
  sb.from('match_results').select('*').then(({ data }) => {
    if (!data) return;
    const before = Object.keys(matchResultsCache).length;
    matchResultsCache = {};
    data.forEach(r => {
      matchResultsCache[r.match_id] = {
        golesLocal:     r.goles_local,
        golesVisitante: r.goles_visitante,
        firstScorer:    r.first_scorer,
        mvp:            r.mvp    || '',
        winner:         r.winner || ''
      };
    });
    if (Object.keys(matchResultsCache).length !== before) renderDateTabs();
  });
}

function renderDateTabs() {
  const dates = getUniqueDates();
  const container = document.getElementById('date-tabs');
  container.innerHTML = '';

  if (!activeDateTab || !dates.includes(activeDateTab)) {
    const allM = getAllMatchesSorted();
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
  const active = document.querySelector('.date-tab.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function renderMatchesForDate(fecha) {
  badgeIntervals.forEach(id => clearInterval(id));
  badgeIntervals = [];

  const allMatches = getAllMatchesSorted();
  const filtered = allMatches.filter(m => m.fecha === fecha);
  const container = document.getElementById('matches-list');
  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><div class="empty-icon">📭</div><p>Sin partidos este día</p></div>';
    return;
  }

  filtered.forEach(m => {
    const card = renderMatchCard(m);
    container.appendChild(card);
  });
}

function renderMatchCard(m) {
  const { grupo, idx, local, visitante, fecha, hora } = m;
  const pred       = getMatchPrediction(grupo, idx);
  const status     = getMatchLockStatus(fecha, hora, m.id);
  const locked     = status.locked;
  const isKnockout = grupo === 'D32';

  const localPlayers    = getPlayers(local);
  const visitantePlayers = getPlayers(visitante);
  const allPlayers = [...localPlayers, ...visitantePlayers];

  const card = document.createElement('div');
  card.className = 'match-card';
  card.id = `card-${grupo}-${idx}`;

  const scoreLoc = pred.golesLocal     != null ? pred.golesLocal     : null;
  const scoreVis = pred.golesVisitante != null ? pred.golesVisitante : null;

  // Pre-generar opciones de MVP (evita backticks anidados en el template)
  const mvpOptionsHtml = allPlayers.length > 0
    ? `<optgroup label="${local}">${localPlayers.map(p => {
        const full = `${p.nombre} ${p.apellido}`;
        return `<option value="${full}" ${pred.mvpPred === full ? 'selected' : ''}>${full}</option>`;
      }).join('')}</optgroup>
      <optgroup label="${visitante}">${visitantePlayers.map(p => {
        const full = `${p.nombre} ${p.apellido}`;
        return `<option value="${full}" ${pred.mvpPred === full ? 'selected' : ''}>${full}</option>`;
      }).join('')}</optgroup>`
    : '<option value="" disabled>Sin jugadores disponibles</option>';

  const mvpSelectHtml = isKnockout ? `
    <div class="scorer-row">
      <div class="scorer-label">🌟 MVP del partido</div>
      <select class="scorer-select" id="mvp-${grupo}-${idx}" ${locked ? 'disabled' : ''}>
        <option value="">Sin MVP / No seleccionado</option>
        ${mvpOptionsHtml}
      </select>
    </div>` : '';

  card.innerHTML = `
    <div class="match-card-header">
      <span class="match-group-badge">${m.fase || ('Grupo ' + grupo)}</span>
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
        ${(isKnockout ? ['1', '2'] : ['1', 'X', '2']).map(s => {
          const labelText = s === '1' ? local : s === '2' ? visitante : 'Empate';
          const isActive  = pred.sign === s;
          return `<button class="sign-btn${isActive ? ' active' : ''}" data-sign="${s}" data-grupo="${grupo}" data-idx="${idx}" ${locked ? 'disabled' : ''}>
            <span class="sign-key">${isKnockout ? (s === '1' ? '1' : '2') : s}</span>
            <span>${labelText.length > 10 ? labelText.substring(0, 9) + '…' : labelText}</span>
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

      ${mvpSelectHtml}

      ${locked ? '<div class="match-locked-note">🔒 Este partido está cerrado. No puedes modificar el pronóstico.</div>' : ''}
      ${!locked && currentPlayerSlug ? `<button class="btn-save-pred" id="save-btn-${grupo}-${idx}">💾 Guardar apuesta</button>` : ''}
      ${!locked && !currentPlayerSlug ? '<div class="match-locked-note">Selecciona un jugador para guardar apuestas</div>' : ''}
    </div>
  `;

  // Points breakdown (shown when match is finished and evaluated)
  const matchResult  = matchResultsCache[m.id];
  const predBreakdown = pred.points;

  if (matchResult && predBreakdown) {
    const realScorer = matchResult.firstScorer || 'Ninguno';
    const predScorer = pred.firstScorer || 'Ninguno';
    const hit = (ok) => ok ? '✅' : '❌';

    const row = document.createElement('div');
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
        <span>${hit(predBreakdown.sign)} 1/X/2 +${predBreakdown.sign}</span>
        <span>${hit(predBreakdown.exacto)} Exacto +${predBreakdown.exacto}</span>
        <span>${hit(predBreakdown.firstScorer)} Goleador +${predBreakdown.firstScorer}</span>
        <strong class="result-total">= ${predBreakdown.total} pts</strong>
      </div>
    `;
    card.querySelector('.match-card-body').appendChild(row);
  }

  // Score buttons
  card.querySelectorAll('.score-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!currentPlayerSlug) return;
      const action = btn.dataset.action;
      const team   = btn.dataset.team;
      const g      = btn.dataset.grupo;
      const i      = parseInt(btn.dataset.idx, 10);
      const p      = getMatchPrediction(g, i);
      const field  = team === 'local' ? 'golesLocal' : 'golesVisitante';
      const dispId = team === 'local' ? `score-local-${g}-${i}` : `score-vis-${g}-${i}`;
      const disp   = document.getElementById(dispId);
      let val      = p[field] != null ? p[field] : (action === 'inc' ? -1 : 0);
      if (action === 'inc') val = Math.min(val + 1, 20);
      if (action === 'dec') val = Math.max(val - 1, 0);
      updatePrediction(g, i, { [field]: val });
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
      if (!currentPlayerSlug) return;
      const sign    = btn.dataset.sign;
      const g       = btn.dataset.grupo;
      const i       = parseInt(btn.dataset.idx, 10);
      const current = getMatchPrediction(g, i).sign;
      const newSign = current === sign ? null : sign;
      updatePrediction(g, i, { sign: newSign });
      card.querySelectorAll('.sign-btn').forEach(b => b.classList.remove('active'));
      if (newSign) btn.classList.add('active');
      updateDashboardStats();
    });
  });

  // Scorer select
  const scorerSel = card.querySelector(`#scorer-${grupo}-${idx}`);
  if (scorerSel) {
    scorerSel.addEventListener('change', () => {
      if (!currentPlayerSlug) return;
      updatePrediction(grupo, idx, { firstScorer: scorerSel.value });
    });
  }

  // MVP select (knockout only)
  const mvpSel = card.querySelector(`#mvp-${grupo}-${idx}`);
  if (mvpSel) {
    mvpSel.addEventListener('change', () => {
      if (!currentPlayerSlug) return;
      updatePrediction(grupo, idx, { mvpPred: mvpSel.value });
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
          badgeEl.className   = 'match-status-badge badge-closed';
          card.querySelectorAll('button, select').forEach(el => el.disabled = true);
        } else {
          const cd = msToCountdown(ms);
          badgeEl.textContent = `⏱ Cierra en ${cd}`;
        }
      }, 1000);
      badgeIntervals.push(id);
    }
  }

  // Save button
  const saveBtn = card.querySelector(`#save-btn-${grupo}-${idx}`);
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '⏳ Guardando…';
      try {
        await persistPrediction(grupo, idx);
        showSavedFeedback(saveBtn);
        updateDashboardStats();
      } catch (e) {
        saveBtn.innerHTML = '❌ Error — reintentar';
        saveBtn.disabled = false;
        console.error('persistPrediction:', e);
      }
    });
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
  let deadline = GROUPS_DEADLINE;
  let deadlineLabel = '11 jun · 21:00';
  if (currentPlayerSlug === 'xavicarbu') { deadline = GROUPS_DEADLINE_XAVI; deadlineLabel = '11 jun · 23:00'; }
  if (currentPlayerSlug === 'ribinha')   { deadline = GROUPS_DEADLINE_RIBINHA; deadlineLabel = '14 jun · 19:00'; }
  if (areGroupsLocked()) {
    banner.innerHTML = '<div class="deadline-closed">🔒 Clasificación de grupos cerrada</div>';
  } else {
    const ms = deadline - nowInMadrid();
    const cd = msToCountdown(ms);
    banner.innerHTML = `<div class="deadline-open">⏰ Grupos cierran el ${deadlineLabel}${cd ? ' — en ' + cd : ''}</div>`;
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
  const teams   = getGroupOrder(grupo);
  const locked  = areGroupsLocked();

  const saveBtnHtml = !locked && currentPlayerSlug
    ? `<button class="btn-save-group" id="save-btn-group-${grupo}">💾 Guardar clasificación</button>`
    : '';

  content.innerHTML = `
    <div class="group-title">Grupo ${grupo}</div>
    <div class="group-team-list" id="group-list-${grupo}"></div>
    ${saveBtnHtml}
  `;
  const listEl = document.getElementById(`group-list-${grupo}`);

  teams.forEach((team, i) => {
    const item = createGroupTeamItem(grupo, team, i, teams.length, locked);
    listEl.appendChild(item);
  });

  if (!locked) {
    setupDragDrop(listEl, grupo);
  }

  const groupSaveBtn = document.getElementById(`save-btn-group-${grupo}`);
  if (groupSaveBtn) {
    groupSaveBtn.addEventListener('click', async () => {
      groupSaveBtn.disabled = true;
      groupSaveBtn.innerHTML = '⏳ Guardando…';
      try {
        await persistGroupPrediction(grupo);
        showSavedFeedback(groupSaveBtn);
        updateDashboardStats();
      } catch (e) {
        groupSaveBtn.innerHTML = '❌ Error — reintentar';
        groupSaveBtn.disabled = false;
        console.error('persistGroupPrediction:', e);
      }
    });
  }
}

function createGroupTeamItem(grupo, team, idx, total, locked) {
  const item = document.createElement('div');
  item.className   = 'group-team-item';
  item.dataset.team = team;
  item.dataset.idx  = idx;
  if (!locked) {
    item.draggable = true;
    item.setAttribute('aria-grabbed', 'false');
  }

  item.innerHTML = `
    <span class="group-pos">${getPositionLabel(idx)}</span>
    <span class="group-flag">${flag(team)}</span>
    <span class="group-name">${team}</span>
    <div class="group-arrows">
      <button class="arrow-btn" data-dir="up"   ${idx === 0 || locked ? 'disabled' : ''} title="Subir">↑</button>
      <button class="arrow-btn" data-dir="down"  ${idx === total - 1 || locked ? 'disabled' : ''} title="Bajar">↓</button>
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
  const teams = [...getGroupOrder(grupo)];
  if (toIdx < 0 || toIdx >= teams.length) return;
  [teams[fromIdx], teams[toIdx]] = [teams[toIdx], teams[fromIdx]];
  groupPredictions[grupo] = teams;
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
      const teams = [...getGroupOrder(grupo)];
      const moved = teams.splice(dragSrcIdx, 1)[0];
      teams.splice(destIdx, 0, moved);
      groupPredictions[grupo] = teams;
      renderGroupContent(grupo);
      updateDashboardStats();
    }
    dragSrcIdx = null;
  });
}

// ── Ranking Tab ────────────────────────────────────────────

function renderRankingTab() {
  document.getElementById('ranking-hero-pos').textContent = currentPlayer ? `#${getUserRankPosition()}` : '—';

  const entries = PLAYERS.map(name => ({
    name,
    points: getTotalPoints(nameToSlug(name)),
    me: name === currentPlayer
  })).sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

  const lb = document.getElementById('leaderboard');
  lb.innerHTML = entries.map((e, i) => {
    const rank    = i + 1;
    const medal   = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
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

// ── Apuestas Tab ───────────────────────────────────────────

function renderApuestasTab() {
  renderApuestasPlayerPicker();
  if (apuestasPlayer) {
    loadAndRenderApuestas(apuestasPlayer);
  } else {
    const content = document.getElementById('apuestas-content');
    if (content) {
      content.innerHTML = '<div class="empty-state"><div class="empty-icon">🎯</div><p>Selecciona un jugador para ver sus apuestas</p></div>';
    }
  }
}

function renderApuestasPlayerPicker() {
  const picker = document.getElementById('apuestas-player-picker');
  if (!picker) return;
  picker.innerHTML = `
    <div class="apuestas-picker-title">Ver apuestas de:</div>
    <div class="apuestas-player-grid">
      ${PLAYERS.map(p => {
        const slug = nameToSlug(p);
        const isSelected = slug === apuestasPlayer;
        return `
          <button class="apuestas-player-btn ${isSelected ? 'selected' : ''}"
                  data-slug="${slug}" onclick="selectApuestasPlayer('${slug}')">
            <div class="player-av-sm" style="background:${playerColor(p)}">${getInitial(p)}</div>
            <span>${p}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

function selectApuestasPlayer(slug) {
  apuestasPlayer = slug;
  renderApuestasPlayerPicker();
  loadAndRenderApuestas(slug);
}


async function loadAndRenderApuestas(playerSlug) {
  const content = document.getElementById('apuestas-content');
  if (!content) return;
  content.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><p>Cargando apuestas…</p></div>';

  try {
    const [predsRes, groupPredsRes, specPredRes] = await Promise.all([
      sb.from('predictions').select('*').eq('player_id', playerSlug),
      sb.from('group_predictions').select('*').eq('player_id', playerSlug),
      sb.from('special_predictions').select('*').eq('player_id', playerSlug).maybeSingle()
    ]);

    const matchPreds = {};
    (predsRes.data || []).forEach(r => {
      matchPreds[r.match_id] = {
        sign: r.sign,
        golesLocal: r.goles_local,
        golesVisitante: r.goles_visitante,
        firstScorer: r.first_scorer,
        mvpPred: r.mvp_pred || null
      };
    });

    const groupPreds = {};
    (groupPredsRes.data || []).forEach(r => {
      groupPreds[r.grupo] = r.positions;
    });

    const specPreds = specPredRes?.data || {};

    renderApuestasContent(playerSlug, matchPreds, groupPreds, specPreds);
  } catch (e) {
    content.innerHTML = '<div class="empty-state"><p>❌ Error al cargar apuestas</p></div>';
    console.error('loadAndRenderApuestas:', e);
  }
}

function renderApuestasContent(_playerSlug, matchPreds, groupPreds, specPreds = {}) {
  const content = document.getElementById('apuestas-content');
  if (!content || !matchesData) return;

  const allMatches = getAllMatchesSorted().reverse();

  // Build match predictions HTML — split into group stage vs knockout
  function buildApuestaRow(m, pred) {
    const hasPred = pred.sign || pred.golesLocal != null || pred.golesVisitante != null;
    if (!hasPred || !isMatchLocked(m.fecha, m.hora)) return '';
    const signLabel = pred.sign === '1' ? m.local : pred.sign === '2' ? m.visitante : pred.sign === 'X' ? 'Empate' : '—';
    const signBadgeClass = pred.sign === '1' ? 'sign-1' : pred.sign === '2' ? 'sign-2' : 'sign-x';
    const scoreStr = (pred.golesLocal != null && pred.golesVisitante != null)
      ? `${pred.golesLocal} – ${pred.golesVisitante}` : '— – —';
    const phaseBadge = m.grupo === 'D32' ? 'Dieciseisavos' : `Grupo ${m.grupo}`;
    return `
      <div class="apuesta-match-row">
        <div class="apuesta-match-header">
          <span class="match-group-badge">${phaseBadge}</span>
          <span class="apuesta-match-date">${m.fecha} · ${m.hora}</span>
        </div>
        <div class="apuesta-match-teams-row">
          <span>${flag(m.local)} ${m.local}</span>
          <span class="apuesta-vs">vs</span>
          <span>${m.visitante} ${flag(m.visitante)}</span>
        </div>
        <div class="apuesta-pred-row">
          ${pred.sign ? `<span class="apuesta-sign-badge ${signBadgeClass}">${pred.sign} · ${signLabel}</span>` : ''}
          <span class="apuesta-score-badge">${scoreStr}</span>
          ${pred.firstScorer ? `<span class="apuesta-scorer-badge">⚡ ${pred.firstScorer}</span>` : ''}
          ${pred.mvpPred ? `<span class="apuesta-scorer-badge">🌟 ${pred.mvpPred}</span>` : ''}
        </div>
      </div>`;
  }

  const grupoRows    = allMatches.filter(m => m.grupo !== 'D32').map(m => buildApuestaRow(m, matchPreds[m.id] || {})).filter(Boolean).join('');
  const knockoutRows = allMatches.filter(m => m.grupo === 'D32').map(m => buildApuestaRow(m, matchPreds[m.id] || {})).filter(Boolean).join('');

  // Build group predictions HTML
  // Use the general deadline (not player-specific) for the view tab — editing deadlines are handled in the Grupos tab
  const groups = Object.keys(matchesData.grupos || {}).sort();
  const groupsUnlocked = nowInMadrid() >= GROUPS_DEADLINE;
  let totalGroupPoints = 0;
  const groupCards = groupsUnlocked ? groups.map(g => {
    const positions = groupPreds[g];
    if (!positions || positions.length === 0) return '';
    const realPos = groupResultsCache[g];
    const byPos = positions.map((team, i) => !!(realPos && realPos[i] === team));
    const grpPts = byPos.filter(Boolean).length;
    totalGroupPoints += grpPts;
    const ptsBadge = (realPos && grpPts > 0) ? `<span class="group-pts-badge">+${grpPts} pts</span>` : '';
    return `
      <div class="apuesta-group-card">
        <div class="apuesta-group-title">Grupo ${g}${ptsBadge}</div>
        <div class="apuesta-group-teams">
          ${positions.map((team, i) => `
            <div class="apuesta-group-row">
              <span class="group-pos">${getPositionLabel(i)}</span>
              <span class="group-flag">${flag(team)}</span>
              <span class="group-name">${team}</span>
              ${byPos[i] ? '<span class="group-check">✅</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).filter(Boolean).join('') : null;

  const totalMatchPreds = allMatches.filter(m => matchPreds[m.id] && isMatchLocked(m.fecha, m.hora)).length;
  const totalGroupPreds = groupsUnlocked ? Object.keys(groupPreds).length : 0;

  // Build special predictions HTML
  const specialsUnlocked = nowInMadrid() >= SPECIAL_DEADLINE;
  const specialRows = specialsUnlocked ? SPECIAL_FIELDS.map(f => {
    const val = specPreds[f.key];
    if (!val) return '';
    const result = specialResults?.[f.key] || null;
    const correct = result && val === result;
    const badgeClass = result ? (correct ? 'apuesta-esp-correct' : 'apuesta-esp-wrong') : '';
    return `
      <div class="apuesta-esp-row">
        <span class="apuesta-esp-icon">${f.icon}</span>
        <span class="apuesta-esp-label">${f.label}</span>
        <span class="apuesta-esp-value ${badgeClass}">${val}${correct ? ' ✅' : result ? ' ❌' : ''}</span>
      </div>
    `;
  }).filter(Boolean).join('') : null;
  const totalSpecialPreds = specialsUnlocked ? SPECIAL_FIELDS.filter(f => specPreds[f.key]).length : 0;

  const lockedUntilMsg = '<div class="empty-state" style="padding:20px 0"><p>🔒 Disponible a partir del 11 jun · 21:00</p></div>';

  content.innerHTML = `
    <div class="apuestas-stats-row">
      <div class="apuestas-stat"><span>${totalMatchPreds}</span><small>Partidos</small></div>
      <div class="apuestas-stat"><span>${totalGroupPreds}</span><small>Grupos</small></div>
      <div class="apuestas-stat"><span>${totalSpecialPreds}</span><small>Especiales</small></div>
    </div>

    <div class="section-header" style="margin-top:4px"><h3>Pronósticos de Partidos</h3></div>

    <details class="apuesta-accordion">
      <summary class="apuesta-accordion-summary">
        ⚽ Fase de grupos
        <span class="accordion-chevron">▾</span>
      </summary>
      <div class="apuesta-accordion-body">
        ${grupoRows || '<div class="empty-state" style="padding:16px"><p>Sin pronósticos de fase de grupos</p></div>'}
      </div>
    </details>

    <details class="apuesta-accordion" open>
      <summary class="apuesta-accordion-summary">
        🏆 Knockouts
        <span class="accordion-chevron">▾</span>
      </summary>
      <div class="apuesta-accordion-body">
        ${knockoutRows || '<div class="empty-state" style="padding:16px"><p>Sin pronósticos de eliminatorias</p></div>'}
      </div>
    </details>

    <div class="section-header" style="margin-top:16px"><h3>Clasificaciones de Grupos${totalGroupPoints > 0 ? ` <span class="section-pts-total">+${totalGroupPoints} pts</span>` : ''}</h3></div>
    <div class="apuesta-groups-grid">
      ${groupCards !== null ? (groupCards || '<div class="empty-state" style="padding:20px 0"><p>Sin clasificaciones guardadas</p></div>') : lockedUntilMsg}
    </div>

    <div class="section-header" style="margin-top:16px"><h3>Apuestas Especiales</h3></div>
    <div class="apuesta-esp-list">
      ${specialRows !== null ? (specialRows || '<div class="empty-state" style="padding:20px 0"><p>Sin apuestas especiales guardadas</p></div>') : lockedUntilMsg}
    </div>
  `;
}

// ── Mis Apuestas Tab ───────────────────────────────────────

async function renderMisApuestasTab() {
  const el = document.getElementById('misapuestas-content');
  if (!el) return;

  if (!currentPlayerSlug) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">👤</div><p>Selecciona tu usuario para ver tus apuestas</p></div>';
    return;
  }

  el.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><p>Cargando…</p></div>';

  try {
    const [predsRes, groupPredsRes, specPredRes] = await Promise.all([
      sb.from('predictions').select('*').eq('player_id', currentPlayerSlug),
      sb.from('group_predictions').select('*').eq('player_id', currentPlayerSlug),
      sb.from('special_predictions').select('*').eq('player_id', currentPlayerSlug).maybeSingle()
    ]);

    const matchPreds = {};
    (predsRes.data || []).forEach(r => {
      matchPreds[r.match_id] = {
        sign: r.sign,
        golesLocal: r.goles_local,
        golesVisitante: r.goles_visitante,
        firstScorer: r.first_scorer,
        mvpPred: r.mvp_pred || null
      };
    });

    const groupPreds = {};
    (groupPredsRes.data || []).forEach(r => { groupPreds[r.grupo] = r.positions; });

    const specPreds = specPredRes?.data || {};

    renderMisApuestasContent(matchPreds, groupPreds, specPreds);
  } catch (e) {
    el.innerHTML = '<div class="empty-state"><p>❌ Error al cargar</p></div>';
    console.error('renderMisApuestasTab:', e);
  }
}

function renderMisApuestasContent(matchPreds, groupPreds, specPreds) {
  const el = document.getElementById('misapuestas-content');
  if (!el || !matchesData) return;

  const allMatches = getAllMatchesSorted().reverse();

  // Todos los partidos donde haya pronóstico guardado (abiertos y cerrados)
  function buildMisApuestaRow(m, pred) {
    if (!pred) return '';
    const hasPred = pred.sign || pred.golesLocal != null || pred.golesVisitante != null;
    if (!hasPred) return '';
    const locked = isMatchLocked(m.fecha, m.hora);
    const signLabel = pred.sign === '1' ? m.local : pred.sign === '2' ? m.visitante : pred.sign === 'X' ? 'Empate' : '—';
    const signBadgeClass = pred.sign === '1' ? 'sign-1' : pred.sign === '2' ? 'sign-2' : 'sign-x';
    const scoreStr = (pred.golesLocal != null && pred.golesVisitante != null)
      ? `${pred.golesLocal} – ${pred.golesVisitante}` : '— – —';
    const statusBadge = locked
      ? '<span style="font-size:10px;color:var(--text-muted)">🔒</span>'
      : '<span style="font-size:10px;color:var(--success)">🟢</span>';
    const phaseBadge = m.grupo === 'D32' ? 'Dieciseisavos' : `Grupo ${m.grupo}`;
    return `
      <div class="apuesta-match-row">
        <div class="apuesta-match-header">
          <span class="match-group-badge">${phaseBadge}</span>
          <span class="apuesta-match-date">${m.fecha} · ${m.hora}</span>
          ${statusBadge}
        </div>
        <div class="apuesta-match-teams-row">
          <span>${flag(m.local)} ${m.local}</span>
          <span class="apuesta-vs">vs</span>
          <span>${m.visitante} ${flag(m.visitante)}</span>
        </div>
        <div class="apuesta-pred-row">
          ${pred.sign ? `<span class="apuesta-sign-badge ${signBadgeClass}">${pred.sign} · ${signLabel}</span>` : ''}
          <span class="apuesta-score-badge">${scoreStr}</span>
          ${pred.firstScorer ? `<span class="apuesta-scorer-badge">⚡ ${pred.firstScorer}</span>` : ''}
          ${pred.mvpPred ? `<span class="apuesta-scorer-badge">🌟 ${pred.mvpPred}</span>` : ''}
        </div>
      </div>`;
  }

  const grupoRows    = allMatches.filter(m => m.grupo !== 'D32').map(m => buildMisApuestaRow(m, matchPreds[m.id])).filter(Boolean).join('');
  const knockoutRows = allMatches.filter(m => m.grupo === 'D32').map(m => buildMisApuestaRow(m, matchPreds[m.id])).filter(Boolean).join('');

  // Grupos
  const grupos = Object.keys(matchesData.grupos || {}).sort();
  let totalGroupPoints = 0;
  const groupCards = grupos.map(g => {
    const positions = groupPreds[g];
    if (!positions || positions.length === 0) return '';
    const realPos = groupResultsCache[g];
    const byPos = positions.map((team, i) => !!(realPos && realPos[i] === team));
    const grpPts = byPos.filter(Boolean).length;
    totalGroupPoints += grpPts;
    const ptsBadge = (realPos && grpPts > 0) ? `<span class="group-pts-badge">+${grpPts} pts</span>` : '';
    return `
      <div class="apuesta-group-card">
        <div class="apuesta-group-title">Grupo ${g}${ptsBadge}</div>
        <div class="apuesta-group-teams">
          ${positions.map((team, i) => `
            <div class="apuesta-group-row">
              <span class="group-pos">${getPositionLabel(i)}</span>
              <span class="group-flag">${flag(team)}</span>
              <span class="group-name">${team}</span>
              ${byPos[i] ? '<span class="group-check">✅</span>' : ''}
            </div>`).join('')}
        </div>
      </div>`;
  }).filter(Boolean).join('');

  // Especiales
  const specialRows = SPECIAL_FIELDS.map(f => {
    const val = specPreds[f.key];
    if (!val) return '';
    return `
      <div class="apuesta-esp-row">
        <span class="apuesta-esp-icon">${f.icon}</span>
        <span class="apuesta-esp-label">${f.label}</span>
        <span class="apuesta-esp-value">${val}</span>
      </div>`;
  }).filter(Boolean).join('');

  const totalMatch  = allMatches.filter(m => matchPreds[m.id] && (matchPreds[m.id].sign || matchPreds[m.id].golesLocal != null)).length;
  const totalGroups = Object.keys(groupPreds).length;
  const totalSpec   = SPECIAL_FIELDS.filter(f => specPreds[f.key]).length;

  el.innerHTML = `
    <div class="apuestas-stats-row">
      <div class="apuestas-stat"><span>${totalMatch}</span><small>Partidos</small></div>
      <div class="apuestas-stat"><span>${totalGroups}</span><small>Grupos</small></div>
      <div class="apuestas-stat"><span>${totalSpec}</span><small>Especiales</small></div>
    </div>

    <div class="section-header" style="margin-top:4px"><h3>Pronósticos de Partidos</h3></div>

    <details class="apuesta-accordion">
      <summary class="apuesta-accordion-summary">
        ⚽ Fase de grupos
        <span class="accordion-chevron">▾</span>
      </summary>
      <div class="apuesta-accordion-body">
        ${grupoRows || '<div class="empty-state" style="padding:16px"><p>Sin pronósticos de fase de grupos</p></div>'}
      </div>
    </details>

    <details class="apuesta-accordion" open>
      <summary class="apuesta-accordion-summary">
        🏆 Knockouts
        <span class="accordion-chevron">▾</span>
      </summary>
      <div class="apuesta-accordion-body">
        ${knockoutRows || '<div class="empty-state" style="padding:16px"><p>Sin pronósticos de eliminatorias</p></div>'}
      </div>
    </details>

    <div class="section-header" style="margin-top:16px"><h3>Clasificaciones de Grupos${totalGroupPoints > 0 ? ` <span class="section-pts-total">+${totalGroupPoints} pts</span>` : ''}</h3></div>
    <div class="apuesta-groups-grid">
      ${groupCards || '<div class="empty-state" style="padding:20px 0"><p>Sin clasificaciones guardadas</p></div>'}
    </div>

    <div class="section-header" style="margin-top:16px"><h3>Apuestas Especiales</h3></div>
    <div class="apuesta-esp-list">
      ${specialRows || '<div class="empty-state" style="padding:20px 0"><p>Sin apuestas especiales guardadas</p></div>'}
    </div>
  `;
}

// ── Histórico ──────────────────────────────────────────────

function renderHistorico() {
  const el = document.getElementById('historico-list');
  if (!el) return;
  // Refresca resultados en segundo plano
  sb.from('match_results').select('*').then(({ data }) => {
    if (!data) return;
    const before = Object.keys(matchResultsCache).length;
    matchResultsCache = {};
    data.forEach(r => {
      matchResultsCache[r.match_id] = {
        golesLocal:     r.goles_local,
        golesVisitante: r.goles_visitante,
        firstScorer:    r.first_scorer,
        mvp:            r.mvp    || '',
        winner:         r.winner || ''
      };
    });
    if (Object.keys(matchResultsCache).length !== before) renderHistorico();
  });

  const finished = getAllMatchesSorted().filter(m => matchResultsCache[m.id]);

  if (finished.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>Aún no hay partidos finalizados</p></div>';
    return;
  }

  el.innerHTML = finished.map(m => {
    const result = matchResultsCache[m.id];
    return `
      <div class="hist-match-row" id="hist-row-${m.id}">
        <button class="hist-match-btn" onclick="toggleHistorico('${m.id}')">
          <span class="hist-group-badge">${m.grupo === 'D32' ? 'Dieciseisavos' : 'Grupo ' + m.grupo}</span>
          <div class="hist-teams">
            <span>${flag(m.local)} ${m.local}</span>
            <strong class="hist-score">${result.golesLocal} – ${result.golesVisitante}</strong>
            <span>${m.visitante} ${flag(m.visitante)}</span>
          </div>
          <span class="hist-date">${m.fecha}</span>
          <span class="hist-chevron" id="chevron-${m.id}">›</span>
        </button>
        <div class="hist-detail hidden" id="hist-detail-${m.id}"></div>
      </div>
    `;
  }).join('');
}

function toggleHistorico(matchId) {
  const detail  = document.getElementById(`hist-detail-${matchId}`);
  const chevron = document.getElementById(`chevron-${matchId}`);
  if (!detail) return;

  const isOpen = !detail.classList.contains('hidden');
  if (isOpen) {
    detail.classList.add('hidden');
    if (chevron) chevron.textContent = '›';
    return;
  }

  detail.classList.remove('hidden');
  if (chevron) chevron.textContent = '↓';

  if (historicoCache[matchId]) {
    renderHistoricoDetail(matchId, historicoCache[matchId]);
    return;
  }

  detail.innerHTML = '<div class="hist-loading">⏳ Cargando…</div>';

  sb.from('predictions').select('*').eq('match_id', matchId).then(({ data, error }) => {
    if (error || !data) {
      detail.innerHTML = '<div class="hist-loading">❌ Error al cargar</div>';
      return;
    }
    historicoCache[matchId] = data;
    renderHistoricoDetail(matchId, data);
  });
}

function renderHistoricoDetail(matchId, predRows) {
  const detail = document.getElementById(`hist-detail-${matchId}`);
  if (!detail) return;

  const match  = getAllMatchesSorted().find(m => m.id === matchId);
  const result = matchResultsCache[matchId];
  if (!match || !result) return;

  const predMap = {};
  predRows.forEach(r => { predMap[r.player_id] = r; });

  const rows = PLAYERS.map(name => {
    const slug = nameToSlug(name);
    const r    = predMap[slug];
    const pts  = r?.points || null;
    const total = pts?.total ?? 0;

    const avatarHtml = `<div class="player-av-sm" style="background:${playerColor(name)}">${getInitial(name)}</div>`;

    if (!r) {
      return `
        <div class="hist-player-row">
          <div class="hist-player-id">${avatarHtml}<span class="hist-player-name-txt">${name}</span></div>
          <span class="hist-no-pred">Sin apuesta</span>
          <span class="hist-total-pts">0 pts</span>
        </div>`;
    }

    const facets = [
      { label: '1/X/2', ok: pts?.sign        > 0 },
      { label: 'G.L',   ok: pts?.golesLocal   > 0 },
      { label: 'G.V',   ok: pts?.golesVisitante > 0 },
      { label: '⚡',    ok: pts?.firstScorer  > 0 },
    ];

    return `
      <div class="hist-player-row">
        <div class="hist-player-id">${avatarHtml}<span class="hist-player-name-txt">${name}</span></div>
        <div class="hist-facets">
          ${facets.map(f => `<span class="hist-facet ${f.ok ? 'ok' : 'no'}">${f.ok ? '✅' : '❌'} <span class="hist-facet-lbl">${f.label}</span></span>`).join('')}
        </div>
        <span class="hist-total-pts ${total > 0 ? 'has-pts' : ''}">${total} pts</span>
      </div>`;
  }).join('');

  detail.innerHTML = `
    <div class="hist-result-info">
      <strong>${flag(match.local)} ${match.local} ${result.golesLocal}–${result.golesVisitante} ${match.visitante} ${flag(match.visitante)}</strong>
      <span class="hist-scorer-chip">⚡ ${result.firstScorer || 'Ninguno'}</span>
    </div>
    <div class="hist-players-list">${rows}</div>
  `;
}

// ── Dashboard stats (partial update) ──────────────────────

function updateDashboardStats() {
  if (activeTab !== 'dashboard') return;
  document.getElementById('stat-predicted').textContent = countPredictedMatches();
  document.getElementById('stat-groups').textContent    = countGroupsOrdered();
  document.getElementById('stat-open').textContent      = countOpenMatches();
}

// ── Global Countdown ───────────────────────────────────────

function startGlobalCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (activeTab === 'dashboard') {
      const alertGroups = document.getElementById('alert-groups');
      if (!areGroupsLocked() && !alertGroups.classList.contains('hidden')) {
        const ms  = GROUPS_DEADLINE - nowInMadrid();
        const cd  = msToCountdown(ms);
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

// ── Especiales (constante necesaria para tab Apuestas) ──────

const SPECIAL_FIELDS = [
  { key: 'mvp',               label: 'MVP',                icon: '🏅', type: 'player', desc: 'Mejor jugador del torneo' },
  { key: 'top_scorer',        label: 'Máximo Goleador',    icon: '⚽', type: 'player', desc: 'Jugador con más goles' },
  { key: 'top_assister',      label: 'Máximo Asistente',   icon: '🎯', type: 'player', desc: 'Jugador con más asistencias' },
  { key: 'golden_glove',      label: 'Guante de Oro',      icon: '🧤', type: 'player', desc: 'Mejor portero del torneo' },
  { key: 'revelation_team',   label: 'Selección Revelación', icon: '🌟', type: 'team', desc: 'Selección sorpresa del torneo' },
  { key: 'disappointment_team', label: 'Selección Decepción', icon: '😞', type: 'team', desc: 'Selección más decepcionante' }
];

// ── Jugadores Tab ────────────────────────────────────────────

async function renderJugadoresTab() {
  const el = document.getElementById('jugadores-content');
  if (!el) return;

  // Siempre cargar datos frescos de Supabase para incluir los últimos resultados (incl. dieciseisavos)
  el.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><p>Cargando…</p></div>';
  const [matchRes, ptsRes] = await Promise.all([
    sb.from('match_results').select('*'),
    sb.from('player_points').select('*')
  ]);
  if (matchRes.data) {
    matchResultsCache = {};
    matchRes.data.forEach(r => {
      matchResultsCache[r.match_id] = {
        golesLocal:    r.goles_local,
        golesVisitante: r.goles_visitante,
        firstScorer:   r.first_scorer,
        mvp:           r.mvp    || '',
        winner:        r.winner || ''
      };
    });
  }
  if (ptsRes.data) {
    playerPointsCache = {};
    ptsRes.data.forEach(r => {
      playerPointsCache[r.player_id] = { total: r.total || 0, special_total: r.special_total || 0 };
    });
  }

  const finished = getAllMatchesSorted().filter(m => matchResultsCache[m.id]);

  if (finished.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>Aún no hay partidos finalizados</p></div>';
    return;
  }

  const matchIds = finished.map(m => m.id);
  const [{ data: predData }, { data: grpData }] = await Promise.all([
    sb.from('predictions').select('*').in('match_id', matchIds),
    sb.from('group_predictions').select('*').eq('evaluated', true)
  ]);
  const jugadoresCache = {};
  (predData || []).forEach(r => {
    if (!jugadoresCache[r.player_id]) jugadoresCache[r.player_id] = {};
    jugadoresCache[r.player_id][r.match_id] = r;
  });
  const jugadoresGrpCache = {};
  (grpData || []).forEach(r => {
    if (!jugadoresGrpCache[r.player_id]) jugadoresGrpCache[r.player_id] = {};
    jugadoresGrpCache[r.player_id][r.grupo] = r;
  });

  // Ordenar jugadores por puntos totales reales (partidos + grupos + especiales)
  const ranked = [...PLAYERS].sort((a, b) =>
    getTotalPoints(nameToSlug(b)) - getTotalPoints(nameToSlug(a))
  );

  el.innerHTML = ranked.map(player => {
    const slug    = nameToSlug(player);
    const preds   = jugadoresCache[slug] || {};
    const grpPreds = jugadoresGrpCache[slug] || {};
    const matchPts = Object.values(preds).reduce((s, r) => s + (r.points?.total || 0), 0);
    const groupPts = Object.values(grpPreds).reduce((s, r) => s + (r.points?.total || 0), 0);
    const total    = getTotalPoints(slug);

    const rows = finished.map(m => {
      const result = matchResultsCache[m.id];
      const r      = preds[m.id];
      const b      = r?.points || { sign: 0, golesLocal: 0, golesVisitante: 0, firstScorer: 0, total: 0 };
      const hit    = ok => ok ? '✅' : '❌';
      const predStr = r
        ? `${r.sign || '—'} · ${r.goles_local ?? '—'}–${r.goles_visitante ?? '—'}`
        : '<em style="color:var(--text-muted)">Sin apuesta</em>';

      return `
        <div class="jug-match-row">
          <div class="jug-match-teams">
            <span class="match-group-badge" style="font-size:10px">Gr.${m.grupo}</span>
            ${flag(m.local)} ${m.local}
            <strong style="margin:0 4px">${result.golesLocal}–${result.golesVisitante}</strong>
            ${m.visitante} ${flag(m.visitante)}
          </div>
          <div class="jug-match-pred">${predStr}</div>
          <div class="jug-match-pts">
            <span class="jug-facet ${b.sign        ? 'ok' : 'no'}">${hit(b.sign)}1/X/2</span>
            <span class="jug-facet ${b.exacto      ? 'ok' : 'no'}">${hit(b.exacto)}Exacto</span>
            <span class="jug-facet ${b.firstScorer ? 'ok' : 'no'}">${hit(b.firstScorer)}⚡</span>
            <span class="jug-total-pts ${b.total > 0 ? 'has-pts' : ''}">${b.total}pts</span>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="hist-match-row" id="jug-row-${slug}">
        <button class="hist-match-btn" onclick="toggleJugadorRow('${slug}')">
          <div class="hist-player-id" style="gap:8px">
            <div class="player-av-sm" style="background:${playerColor(player)}">${getInitial(player)}</div>
            <span class="hist-player-name-txt">${player}</span>
          </div>
          <span style="font-size:12px;color:var(--text-muted);margin-left:auto;display:flex;gap:6px;align-items:center">
            ${matchPts > 0 ? `<span title="Puntos de partidos">⚽ ${matchPts}</span>` : ''}
            ${groupPts > 0 ? `<span title="Puntos de grupos">📊 ${groupPts}</span>` : ''}
          </span>
          <strong class="hist-score" style="min-width:55px;text-align:right">${total} pts</strong>
          <span class="hist-chevron" id="jug-chevron-${slug}">›</span>
        </button>
        <div class="hist-detail hidden" id="jug-detail-${slug}">
          <div class="jug-player-matches">${rows}</div>
        </div>
      </div>`;
  }).join('');
}

function toggleJugadorRow(slug) {
  const detail  = document.getElementById(`jug-detail-${slug}`);
  const chevron = document.getElementById(`jug-chevron-${slug}`);
  if (!detail) return;
  const isOpen = !detail.classList.contains('hidden');
  detail.classList.toggle('hidden', isOpen);
  if (chevron) chevron.textContent = isOpen ? '›' : '↓';
}

// ── Evolución Tab ────────────────────────────────────────────

let evolucionChart = null;

async function renderEvolucionTab() {
  const el = document.getElementById('historico-content');
  if (!el) return;

  el.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><p>Cargando…</p></div>';

  // Refresh match_results cache
  const { data: matchData } = await sb.from('match_results').select('*');
  if (matchData) {
    matchResultsCache = {};
    matchData.forEach(r => {
      matchResultsCache[r.match_id] = {
        golesLocal:     r.goles_local,
        golesVisitante: r.goles_visitante,
        firstScorer:    r.first_scorer,
        mvp:            r.mvp    || '',
        winner:         r.winner || ''
      };
    });
  }

  const finished = getAllMatchesSorted().filter(m => matchResultsCache[m.id]);

  if (finished.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><p>Aún no hay partidos finalizados</p></div>';
    return;
  }

  // Fetch match predictions and evaluated group predictions in parallel
  const [{ data: predData }, { data: grpData }] = await Promise.all([
    sb.from('predictions').select('player_id,match_id,points').in('match_id', finished.map(m => m.id)),
    sb.from('group_predictions').select('player_id,points').eq('evaluated', true)
  ]);

  // Build match points map: { playerSlug: { matchId: pts } }
  const pointsMap = {};
  PLAYERS.forEach(p => { pointsMap[nameToSlug(p)] = {}; });
  (predData || []).forEach(r => {
    if (pointsMap[r.player_id] !== undefined) {
      pointsMap[r.player_id][r.match_id] = r.points?.total || 0;
    }
  });

  // Sum group bonus points per player (all evaluated groups)
  const groupBonus = {};
  PLAYERS.forEach(p => { groupBonus[nameToSlug(p)] = 0; });
  (grpData || []).forEach(r => {
    if (groupBonus[r.player_id] !== undefined) {
      groupBonus[r.player_id] += r.points?.total || 0;
    }
  });

  // Build timeline: match events + a "Grupos" checkpoint inserted before the first 28-jun match
  const timeline = [];
  let gruposInserted = false;
  let matchCounter = 0;
  finished.forEach(m => {
    if (!gruposInserted && m.fecha === '28 jun') {
      timeline.push({ type: 'grupos', label: 'Grupos' });
      gruposInserted = true;
    }
    matchCounter++;
    timeline.push({ type: 'match', match: m, label: `P${matchCounter}` });
  });

  // Compute cumulative totals and positions across the full timeline
  const runningTotals = {};
  PLAYERS.forEach(p => { runningTotals[nameToSlug(p)] = 0; });

  const positionsPerPlayer = {};
  PLAYERS.forEach(p => { positionsPerPlayer[nameToSlug(p)] = []; });

  const cumulativeAtPoint = []; // snapshot of totals at each timeline index

  timeline.forEach(event => {
    if (event.type === 'grupos') {
      PLAYERS.forEach(p => { runningTotals[nameToSlug(p)] += groupBonus[nameToSlug(p)]; });
    } else {
      PLAYERS.forEach(p => {
        const slug = nameToSlug(p);
        runningTotals[slug] += pointsMap[slug][event.match.id] || 0;
      });
    }
    cumulativeAtPoint.push({ ...runningTotals });
    const sorted = [...PLAYERS].map(p => nameToSlug(p))
      .sort((a, b) => runningTotals[b] - runningTotals[a]);
    sorted.forEach((slug, idx) => { positionsPerPlayer[slug].push(idx + 1); });
  });

  const labels = timeline.map(e => e.label);

  // Helper: build dataset style based on selected player
  let selectedEvSlug = null;

  function buildDatasets() {
    return PLAYERS.map((name, i) => {
      const slug = nameToSlug(name);
      const isSelected = !selectedEvSlug || slug === selectedEvSlug;
      return {
        label: name,
        data: positionsPerPlayer[slug],
        borderColor: isSelected ? PLAYER_COLORS[i] : PLAYER_COLORS[i] + '28',
        backgroundColor: PLAYER_COLORS[i],
        tension: 0.3,
        pointRadius: selectedEvSlug
          ? (isSelected ? 4 : 0)
          : (timeline.length <= 30 ? 3 : 1),
        pointHoverRadius: isSelected ? 6 : 0,
        borderWidth: selectedEvSlug ? (isSelected ? 3 : 1) : 1.5,
        order: isSelected ? 0 : 1,
      };
    });
  }

  // End-of-line label plugin: draws player initial/short name at last data point
  const endLabelPlugin = {
    id: 'endLabels',
    afterDatasetsDraw(chart) {
      if (!selectedEvSlug) return;
      const { ctx: c } = chart;
      chart.data.datasets.forEach((ds, i) => {
        if (nameToSlug(ds.label) !== selectedEvSlug) return;
        const meta = chart.getDatasetMeta(i);
        const last = meta.data[meta.data.length - 1];
        if (!last) return;
        const shortName = ds.label.split(' ')[0];
        c.save();
        c.font = 'bold 12px -apple-system, sans-serif';
        c.fillStyle = ds.borderColor;
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        c.fillText(shortName, last.x + 6, last.y);
        c.restore();
      });
    },
  };

  // Chart canvas — fixed height, scrollable wrap if many points
  const minPx = Math.max(100, timeline.length * 14);
  el.innerHTML = `
    <div class="evolucion-scroll-wrap">
      <div style="min-width:${minPx}px;height:300px;position:relative">
        <canvas id="historico-chart"></canvas>
      </div>
    </div>
    <div class="evolucion-player-grid" id="historico-legend"></div>
    <p class="evolucion-note">Toca un jugador para resaltar su línea · incluye partidos + bonus de grupos</p>
  `;

  if (evolucionChart) { evolucionChart.destroy(); evolucionChart = null; }

  const ctx = document.getElementById('historico-chart').getContext('2d');
  evolucionChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: buildDatasets() },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 200 },
      interaction: { mode: 'index', intersect: false },
      layout: { padding: { right: 70 } },
      scales: {
        y: {
          reverse: true,
          min: 1,
          max: PLAYERS.length,
          ticks: { stepSize: 1, color: '#8892a4', callback: v => `#${v}` },
          grid: { color: 'rgba(255,255,255,0.06)' },
        },
        x: {
          ticks: { color: '#8892a4', font: { size: 10 }, maxRotation: 0,
            callback: (_, idx) => {
              const e = timeline[idx];
              return e.type === 'grupos' ? '📊' : e.label;
            }
          },
          grid: {
            color: (ctx2) => labels[ctx2.index] === 'Grupos'
              ? 'rgba(245,197,24,0.5)' : 'rgba(255,255,255,0.05)',
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: item => !selectedEvSlug || nameToSlug(item.dataset.label) === selectedEvSlug,
          backgroundColor: '#1e2538',
          titleColor: '#e8eaf0',
          bodyColor: '#8892a4',
          borderColor: '#2a3348',
          borderWidth: 1,
          callbacks: {
            title: items => {
              const idx = items[0].dataIndex;
              const event = timeline[idx];
              if (event.type === 'grupos') return '📊 Fase de Grupos — bonus (28 jun)';
              const m = event.match;
              return `${event.label}: ${m.local} vs ${m.visitante}`;
            },
            label: item => {
              const slug = nameToSlug(item.dataset.label);
              const cum = cumulativeAtPoint[item.dataIndex][slug];
              return ` ${item.dataset.label}: #${item.raw}  (${cum} pts)`;
            },
          },
        },
      },
    },
    plugins: [endLabelPlugin],
  });

  // Interactive player buttons
  const legendEl = document.getElementById('historico-legend');
  legendEl.innerHTML = PLAYERS.map((name, i) => {
    const slug = nameToSlug(name);
    const lastPos = positionsPerPlayer[slug][positionsPerPlayer[slug].length - 1];
    return `
      <button class="evolucion-player-btn" data-slug="${slug}" onclick="selectEvolucionPlayer('${slug}')">
        <span class="evolucion-legend-dot" style="background:${PLAYER_COLORS[i]}"></span>
        <span class="evolucion-btn-name">${name}</span>
        <span class="evolucion-btn-pos">#${lastPos}</span>
      </button>`;
  }).join('');

  window.selectEvolucionPlayer = (slug) => {
    selectedEvSlug = selectedEvSlug === slug ? null : slug;
    evolucionChart.data.datasets = buildDatasets();
    evolucionChart.update('none');
    document.querySelectorAll('.evolucion-player-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.slug === selectedEvSlug);
    });
  };
}

// ── PIN modal ───────────────────────────────────────────────

let _pinPlayer = '';
let _pinValue  = '';

function showPinModal(playerName) {
  _pinPlayer = playerName;
  _pinValue  = '';

  // Inject modal if not present
  if (!document.getElementById('pin-modal')) {
    const div = document.createElement('div');
    div.id = 'pin-modal';
    div.className = 'pin-overlay hidden';
    div.innerHTML = `
      <div class="pin-box">
        <button class="pin-close" onclick="closePinModal()">✕</button>
        <div class="pin-avatar" id="pin-avatar"></div>
        <div class="pin-name" id="pin-name"></div>
        <div class="pin-dots" id="pin-dots">
          <span class="pin-dot" id="pd0"></span>
          <span class="pin-dot" id="pd1"></span>
          <span class="pin-dot" id="pd2"></span>
          <span class="pin-dot" id="pd3"></span>
        </div>
        <div class="pin-error hidden" id="pin-error">PIN incorrecto</div>
        <div class="pin-keypad">
          ${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k => `
            <button class="pin-key ${k==='' ? 'pin-key-empty' : ''}"
                    onclick="pinPress('${k}')"
                    ${k==='' ? 'disabled' : ''}>${k}</button>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(div);
  }

  document.getElementById('pin-avatar').style.cssText =
    `background:${playerColor(playerName)}`;
  document.getElementById('pin-avatar').textContent = getInitial(playerName);
  document.getElementById('pin-name').textContent    = playerName;
  _pinUpdateDots();
  document.getElementById('pin-error').classList.add('hidden');
  document.getElementById('pin-modal').classList.remove('hidden');
}

function closePinModal() {
  document.getElementById('pin-modal')?.classList.add('hidden');
  _pinValue = '';
}

function pinPress(k) {
  if (k === '⌫') {
    _pinValue = _pinValue.slice(0, -1);
    document.getElementById('pin-error').classList.add('hidden');
    _pinUpdateDots();
    return;
  }
  if (_pinValue.length >= 4) return;
  _pinValue += k;
  _pinUpdateDots();
  if (_pinValue.length === 4) {
    if (_pinValue === PLAYER_PINS[_pinPlayer]) {
      closePinModal();
      selectPlayer(_pinPlayer);
    } else {
      document.getElementById('pin-error').classList.remove('hidden');
      // shake + reset after short delay
      const dots = document.getElementById('pin-dots');
      dots.classList.add('pin-shake');
      setTimeout(() => {
        dots.classList.remove('pin-shake');
        _pinValue = '';
        _pinUpdateDots();
      }, 600);
    }
  }
}

function _pinUpdateDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`pd${i}`);
    if (dot) dot.classList.toggle('filled', i < _pinValue.length);
  }
}

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
                  onclick="showPinModal('${p}')">
            <div class="player-av-lg" style="background:${playerColor(p)}">${getInitial(p)}</div>
            <span>${p}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  el.querySelector('#player-selector-toggle')?.addEventListener('click', (e) => {
    if (e.target.closest('.player-grid-btn')) return;
    const grid = el.querySelector('#player-grid');
    if (grid) {
      const hidden = grid.style.display === 'none';
      grid.style.display = hidden ? 'grid' : 'none';
    }
  });
}

// ── Especiales Ribinha Tab ──────────────────────────────────

function isEspecialesRibinhaVisible() {
  return currentPlayerSlug === 'ribinha' && nowInMadrid() < SPECIAL_DEADLINE_RIBINHA;
}

async function persistSpecialPrediction() {
  if (!currentPlayerSlug) return;
  const { error } = await sb.from('special_predictions').upsert({
    player_id:           currentPlayerSlug,
    mvp:                 specialPredictions.mvp               || null,
    top_scorer:          specialPredictions.top_scorer         || null,
    top_assister:        specialPredictions.top_assister       || null,
    golden_glove:        specialPredictions.golden_glove       || null,
    revelation_team:     specialPredictions.revelation_team    || null,
    disappointment_team: specialPredictions.disappointment_team || null,
  }, { onConflict: 'player_id' });
  if (error) throw error;
}

function renderEspecialesRibinhaTab() {
  const content = document.getElementById('especiales-ribinha-content');
  if (!content) return;

  if (!isEspecialesRibinhaVisible()) {
    switchTab('dashboard');
    return;
  }

  const ms = SPECIAL_DEADLINE_RIBINHA - nowInMadrid();
  const cd = msToCountdown(ms);

  // Player options grouped by team
  const renderPlayerSelect = (key) => {
    const val = specialPredictions[key] || '';
    const groups = (playersData || []).map(team => {
      const spanishName = Object.keys(TEAM_NAME_MAP).find(k => TEAM_NAME_MAP[k] === team.seleccion) || team.seleccion;
      const opts = (team.jugadores || []).map(p => {
        const full = `${p.nombre} ${p.apellido}`;
        return `<option value="${full}" ${val === full ? 'selected' : ''}>${full}</option>`;
      }).join('');
      return `<optgroup label="${spanishName}">${opts}</optgroup>`;
    }).join('');
    return `<select class="esp-select" data-key="${key}"><option value="">— Sin seleccionar —</option>${groups}</select>`;
  };

  const renderTeamSelect = (key) => {
    const val = specialPredictions[key] || '';
    const opts = Object.keys(TEAM_NAME_MAP).sort().map(t =>
      `<option value="${t}" ${val === t ? 'selected' : ''}>${flag(t)} ${t}</option>`
    ).join('');
    return `<select class="esp-select" data-key="${key}"><option value="">— Sin seleccionar —</option>${opts}</select>`;
  };

  content.innerHTML = `
    <div class="especiales-open-banner">⏰ Cierra hoy a las 19:00${cd ? ' — en ' + cd : ''}</div>
    <div id="especiales-list">
      ${SPECIAL_FIELDS.map(f => `
        <div class="esp-card">
          <div class="esp-card-header">
            <span class="esp-icon">${f.icon}</span>
            <div class="esp-card-title">
              <strong>${f.label}</strong>
              <span class="esp-desc">${f.desc}</span>
            </div>
          </div>
          <div class="esp-input-row${f.type === 'player' ? ' esp-player-row' : ''}">
            ${f.type === 'player' ? renderPlayerSelect(f.key) : renderTeamSelect(f.key)}
          </div>
        </div>
      `).join('')}
    </div>
    <button class="btn-save-pred" id="btn-save-especiales" style="margin-top:16px;width:100%">💾 Guardar apuestas especiales</button>
  `;

  content.querySelectorAll('.esp-select').forEach(sel => {
    sel.addEventListener('change', () => {
      specialPredictions[sel.dataset.key] = sel.value || null;
    });
  });

  document.getElementById('btn-save-especiales').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.innerHTML = '⏳ Guardando…';
    try {
      await persistSpecialPrediction();
      showSavedFeedback(btn);
    } catch (err) {
      btn.innerHTML = '❌ Error — reintentar';
      btn.disabled = false;
      console.error('persistSpecialPrediction:', err);
    }
  });
}

// ── Boot ────────────────────────────────────────────────────

function bootApp() {
  updateHeader();
  renderDashboard();
  startGlobalCountdown();

  // Show Especiales tab only for Ribinha before the deadline
  const navEspeciales = document.getElementById('nav-especiales-ribinha');
  if (navEspeciales) navEspeciales.style.display = isEspecialesRibinhaVisible() ? '' : 'none';

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
  const slug = getPlayerFromURL();
  if (slug && SLUG_TO_NAME[slug]) {
    currentPlayer     = SLUG_TO_NAME[slug];
    currentPlayerSlug = slug;
  }

  try {
    await Promise.all([loadData(), loadSupabaseData()]);
  } catch (err) {
    console.error('Error:', err);
    document.body.innerHTML = `
      <div style="padding:40px;text-align:center;color:#e8eaf0;font-family:sans-serif;">
        <h2 style="color:#e63946">Error al cargar datos</h2>
        <p>Comprueba la conexión a internet.</p>
      </div>`;
    return;
  }

  bootApp();
}

document.addEventListener('DOMContentLoaded', main);
