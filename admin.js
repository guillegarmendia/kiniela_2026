/* ============================================================
   KINIELA MUNDIAL 2026 — admin.js
   Panel de administración — Supabase backend

   ⚠️  SOLO PROTOTIPO — Las credenciales están en texto plano.
       Esto NO es seguro para producción. En un entorno real,
       la autenticación debe hacerse en el servidor con hashing
       de contraseñas y tokens de sesión seguros.
   ============================================================ */

'use strict';

/* ── Supabase Config ──────────────────────────────────────── */
const SUPABASE_URL = 'https://opudnzjgyswwjpindeat.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZUhLIbEjBORppt2rSSLgSw_M_BI4aw0';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── Credenciales (SOLO PROTOTIPO — ver advertencia arriba) ── */
const ADMIN_EMAIL    = 'ggarmendiabalmana@gmail.com';
const ADMIN_PASSWORD = 'kiniela2026';

/* ── Jugadores de la kiniela ─────────────────────────────── */
const PLAYERS = [
  'Cold Garmer', 'Luisgarrincha', 'Ribinha', 'Guishermo Casadinho',
  'DaniTwangy', 'Dudu', 'XaviCarbu', 'MarkusRashford', 'BusiCusi',
  'BoxToBox', 'Aleix'
];

const PLAYER_COLORS = [
  '#e63946', '#f5c518', '#2ecc71', '#3498db', '#9b59b6',
  '#e67e22', '#1abc9c', '#e91e63', '#00bcd4', '#ff5722',
  '#8e44ad', '#27ae60'
];

/* ── Mapas de nombres ────────────────────────────────────── */
const TEAM_NAME_MAP = {
  'México': 'Mexico', 'Sudáfrica': 'South Africa', 'Corea del Sur': 'Korea Republic',
  'República Checa': 'Czechia', 'Canada': 'Canada', 'Bosnia Herzegovina': 'Bosnia and Herzegovina',
  'Qatar': 'Qatar', 'Suiza': 'Switzerland', 'Estados Unidos': 'USA', 'Paraguay': 'Paraguay',
  'Australia': 'Australia', 'Turquía': 'Türkiye', 'Alemania': 'Germany', 'Curaçao': 'Curaçao',
  'Costa de Marfil': "Côte d'Ivoire", 'Ecuador': 'Ecuador', 'Países Bajos': 'Netherlands',
  'Japón': 'Japan', 'Suecia': 'Sweden', 'Túnez': 'Tunisia', 'Bélgica': 'Belgium',
  'Irán': 'IR Iran', 'Nueva Zelanda': 'New Zealand', 'Egipto': 'Egypt', 'España': 'Spain',
  'Cabo Verde': 'Cabo Verde', 'Arabia Saudí': 'Saudi Arabia', 'Uruguay': 'Uruguay',
  'Francia': 'France', 'Senegal': 'Senegal', 'Iraq': 'Iraq', 'Noruega': 'Norway',
  'Argentina': 'Argentina', 'Argelia': 'Algeria', 'Austria': 'Austria', 'Jordania': 'Jordan',
  'Portugal': 'Portugal', 'R.D. del Congo': 'Congo DR', 'Uzbekistán': 'Uzbekistan',
  'Colombia': 'Colombia', 'Inglaterra': 'England', 'Croacia': 'Croatia', 'Ghana': 'Ghana',
  'Panamá': 'Panama', 'Haití': 'Haiti', 'Marruecos': 'Morocco', 'Brasil': 'Brazil',
  'Escocia': 'Scotland'
};

const FLAG_MAP = {
  'México': '🇲🇽', 'Sudáfrica': '🇿🇦', 'Corea del Sur': '🇰🇷', 'República Checa': '🇨🇿',
  'Canada': '🇨🇦', 'Bosnia Herzegovina': '🇧🇦', 'Qatar': '🇶🇦', 'Suiza': '🇨🇭',
  'Estados Unidos': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Turquía': '🇹🇷',
  'Alemania': '🇩🇪', 'Curaçao': '🇨🇼', 'Costa de Marfil': '🇨🇮', 'Ecuador': '🇪🇨',
  'Países Bajos': '🇳🇱', 'Japón': '🇯🇵', 'Suecia': '🇸🇪', 'Túnez': '🇹🇳',
  'Bélgica': '🇧🇪', 'Irán': '🇮🇷', 'Nueva Zelanda': '🇳🇿', 'Egipto': '🇪🇬',
  'España': '🇪🇸', 'Cabo Verde': '🇨🇻', 'Arabia Saudí': '🇸🇦', 'Uruguay': '🇺🇾',
  'Francia': '🇫🇷', 'Senegal': '🇸🇳', 'Iraq': '🇮🇶', 'Noruega': '🇳🇴',
  'Argentina': '🇦🇷', 'Argelia': '🇩🇿', 'Austria': '🇦🇹', 'Jordania': '🇯🇴',
  'Portugal': '🇵🇹', 'R.D. del Congo': '🇨🇩', 'Uzbekistán': '🇺🇿', 'Colombia': '🇨🇴',
  'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croacia': '🇭🇷', 'Ghana': '🇬🇭', 'Panamá': '🇵🇦',
  'Haití': '🇭🇹', 'Marruecos': '🇲🇦', 'Brasil': '🇧🇷', 'Escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿'
};

const MONTH_MAP = {
  'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
  'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
};

/* ── Estado del módulo ───────────────────────────────────── */
let matchesData      = null;
let playersData      = null;
let playersByEnglish = {};
let allMatchesSorted = [];

// Caches cargados desde Supabase
let storedResultsCache      = {};   // { "A-0": { golesLocal, golesVisitante, firstScorer, realSign } }
let storedGroupResultsCache = {};   // { "A": ["España",...] }
let allPredictionsCache     = [];   // all rows from predictions table
let allGroupPredsCache      = [];   // all rows from group_predictions table
let allSpecialPredsCache    = [];   // all rows from special_predictions table
let storedSpecialResults    = null; // row from special_results (id='final')

// Pendientes de confirmación
let pendingMatchId   = null;
let pendingResult    = null;
let pendingGrupo     = null;
let pendingRealOrder = null;

/* ── Toast timer ─────────────────────────────────────────── */
let toastTimer = null;

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function nameToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function parseMatchDate(fecha, hora) {
  const parts  = fecha.split(' ');
  const day    = parseInt(parts[0], 10);
  const month  = MONTH_MAP[parts[1].toLowerCase()] ?? 5;
  const [h, m] = hora.split(':').map(Number);
  return new Date(2026, month, day, h, m, 0);
}

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

function getPlayersForTeam(spanishName) {
  const en = TEAM_NAME_MAP[spanishName];
  return playersByEnglish[en] || [];
}

/* ═══════════════════════════════════════════════════════════
   SUPABASE — CARGA DE DATOS ADMIN
   ═══════════════════════════════════════════════════════════ */

/**
 * Recarga todos los datos necesarios para el panel admin
 * desde Supabase en paralelo y actualiza los caches locales.
 */
async function refreshAdminData() {
  const [matchRes, groupRes, predRes, grpPredRes, specPredRes, specResRes] = await Promise.all([
    sb.from('match_results').select('*'),
    sb.from('group_results').select('*'),
    sb.from('predictions').select('*'),
    sb.from('group_predictions').select('*'),
    sb.from('special_predictions').select('*'),
    sb.from('special_results').select('*').eq('id', 'final').maybeSingle()
  ]);

  // match_results → storedResultsCache
  storedResultsCache = {};
  (matchRes.data || []).forEach(r => {
    storedResultsCache[r.match_id] = {
      golesLocal:     r.goles_local,
      golesVisitante: r.goles_visitante,
      firstScorer:    r.first_scorer,
      realSign:       calcRealSign(r.goles_local, r.goles_visitante)
    };
  });

  // group_results → storedGroupResultsCache
  storedGroupResultsCache = {};
  (groupRes.data || []).forEach(r => {
    storedGroupResultsCache[r.grupo] = r.positions;
  });

  // predictions → allPredictionsCache (raw rows)
  allPredictionsCache = predRes.data || [];

  // group_predictions → allGroupPredsCache (raw rows)
  allGroupPredsCache = grpPredRes.data || [];

  // special_predictions → allSpecialPredsCache
  allSpecialPredsCache = specPredRes.data || [];

  // special_results → storedSpecialResults
  storedSpecialResults = specResRes.data || null;
}

/* ═══════════════════════════════════════════════════════════
   AUTENTICACIÓN
   ═══════════════════════════════════════════════════════════ */

function checkSession() {
  if (sessionStorage.getItem('adminAuthenticated') === 'true') {
    showPanel();
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl  = document.getElementById('login-error');

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminAuthenticated', 'true');
    errorEl.classList.add('hidden');
    showPanel();
  } else {
    errorEl.classList.remove('hidden');
  }
}

function handleLogout() {
  sessionStorage.removeItem('adminAuthenticated');
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('login-section').classList.remove('hidden');
  document.getElementById('login-email').value    = '';
  document.getElementById('login-password').value = '';
}

async function showPanel() {
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('admin-panel').classList.remove('hidden');
  if (!matchesData) await loadData();
  await refreshAdminData();
  populateMatchSelect();
  populateGroupSelect();
  renderHistory();
  renderGroupHistory();
}

/* ═══════════════════════════════════════════════════════════
   CARGA DE DATOS JSON
   ═══════════════════════════════════════════════════════════ */

async function loadData() {
  try {
    const [matchesRes, playersRes] = await Promise.all([
      fetch('matches.json'),
      fetch('players.json')
    ]);
    matchesData = await matchesRes.json();
    playersData = await playersRes.json();
    buildPlayersMap();
    buildAllMatchesSorted();
  } catch (err) {
    console.error('Error cargando datos:', err);
    showToast('Error al cargar datos JSON. ¿Está corriendo el servidor?', 'error');
  }
}

function buildPlayersMap() {
  playersByEnglish = {};
  playersData.forEach(team => {
    playersByEnglish[team.seleccion] = team.jugadores;
  });
}

function buildAllMatchesSorted() {
  allMatchesSorted = [];
  Object.entries(matchesData.grupos).forEach(([grupo, matches]) => {
    matches.forEach((m, idx) => {
      allMatchesSorted.push({
        ...m,
        grupo,
        idx,
        id: `${grupo}-${idx}`,
        date: parseMatchDate(m.fecha, m.hora)
      });
    });
  });
  allMatchesSorted.sort((a, b) => a.date - b.date);
}

/* ═══════════════════════════════════════════════════════════
   TAB SWITCHING
   ═══════════════════════════════════════════════════════════ */

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tabName)
  );
  document.querySelectorAll('.admin-tab-content').forEach(c =>
    c.classList.toggle('active', c.id === `admin-tab-${tabName}`)
  );
  if (tabName === 'grupos')     renderGroupHistory();
  if (tabName === 'jugadores')  renderJugadoresTab();
}

/* ═══════════════════════════════════════════════════════════
   SELECTOR DE PARTIDOS
   ═══════════════════════════════════════════════════════════ */

function populateMatchSelect() {
  const sel = document.getElementById('match-select');
  sel.innerHTML = '<option value="">— Selecciona un partido —</option>';

  allMatchesSorted.forEach(m => {
    const isFinished = !!storedResultsCache[m.id];
    const prefix     = isFinished ? '✅ ' : '';
    const label      = `${prefix}Grupo ${m.grupo}: ${m.local} vs ${m.visitante} (${m.fecha}, ${m.hora})`;
    const opt        = document.createElement('option');
    opt.value        = m.id;
    opt.textContent  = label;
    sel.appendChild(opt);
  });

  document.getElementById('btn-process').disabled = true;
}

function handleMatchSelect() {
  const matchId    = document.getElementById('match-select').value;
  const btnProcess = document.getElementById('btn-process');

  if (!matchId) {
    resetScoreInputs();
    btnProcess.disabled = true;
    return;
  }

  btnProcess.disabled = false;

  const match = allMatchesSorted.find(m => m.id === matchId);
  if (!match) return;

  document.getElementById('label-local').textContent   = `${flag(match.local)} ${match.local}`;
  document.getElementById('label-visitor').textContent = `${flag(match.visitante)} ${match.visitante}`;

  const prev = storedResultsCache[matchId];
  if (prev) {
    document.getElementById('goals-local').value   = prev.golesLocal;
    document.getElementById('goals-visitor').value = prev.golesVisitante;
  } else {
    document.getElementById('goals-local').value   = '';
    document.getElementById('goals-visitor').value = '';
  }

  populateScorerDropdown(match, prev ? prev.firstScorer : '');
}

function populateScorerDropdown(match, current = '') {
  const sel = document.getElementById('first-scorer');
  sel.innerHTML = '';

  const noneOpt        = document.createElement('option');
  noneOpt.value        = '';
  noneOpt.textContent  = 'Ninguno (0-0 o sin goles)';
  sel.appendChild(noneOpt);

  const addGroup = (teamName) => {
    const players = getPlayersForTeam(teamName);
    if (players.length === 0) return;
    const group   = document.createElement('optgroup');
    group.label   = `${flag(teamName)} ${teamName}`;
    players.forEach(p => {
      const full      = `${p.nombre} ${p.apellido}`;
      const opt       = document.createElement('option');
      opt.value       = full;
      opt.textContent = full;
      if (full === current) opt.selected = true;
      group.appendChild(opt);
    });
    sel.appendChild(group);
  };

  addGroup(match.local);
  addGroup(match.visitante);
}

function resetScoreInputs() {
  document.getElementById('goals-local').value   = '';
  document.getElementById('goals-visitor').value = '';
  document.getElementById('label-local').textContent   = 'Equipo local';
  document.getElementById('label-visitor').textContent = 'Equipo visitante';
  const scorerSel = document.getElementById('first-scorer');
  scorerSel.innerHTML = '<option value="">Ninguno (0-0 o sin goles)</option>';
}

/* ═══════════════════════════════════════════════════════════
   SELECTOR DE GRUPOS
   ═══════════════════════════════════════════════════════════ */

function populateGroupSelect() {
  if (!matchesData) return;
  const sel    = document.getElementById('group-select');
  const grupos = Object.keys(matchesData.grupos).sort();

  sel.innerHTML = '<option value="">— Selecciona un grupo —</option>';
  grupos.forEach(g => {
    const done = !!storedGroupResultsCache[g];
    const opt  = document.createElement('option');
    opt.value       = g;
    opt.textContent = `${done ? '✅ ' : ''}Grupo ${g}`;
    sel.appendChild(opt);
  });

  document.getElementById('group-positions').classList.add('hidden');
}

function getGroupTeams(grupo) {
  const matches = matchesData.grupos[grupo] || [];
  const seen    = [];
  matches.forEach(m => {
    if (!seen.includes(m.local))     seen.push(m.local);
    if (!seen.includes(m.visitante)) seen.push(m.visitante);
  });
  return seen.slice(0, 4);
}

function handleGroupSelect() {
  const grupo   = document.getElementById('group-select').value;
  const posDiv  = document.getElementById('group-positions');
  const btnGrp  = document.getElementById('btn-group-process');

  if (!grupo) { posDiv.classList.add('hidden'); return; }

  const teams = getGroupTeams(grupo);
  const prev  = storedGroupResultsCache[grupo] || [];

  [1, 2, 3, 4].forEach(pos => {
    const s = document.getElementById(`pos-${pos}`);
    s.innerHTML = '<option value="">— Equipo —</option>';
    teams.forEach(team => {
      const opt       = document.createElement('option');
      opt.value       = team;
      opt.textContent = `${flag(team)} ${team}`;
      if (prev[pos - 1] === team) opt.selected = true;
      s.appendChild(opt);
    });
  });

  posDiv.classList.remove('hidden');
  btnGrp.disabled = false;
}

/* ═══════════════════════════════════════════════════════════
   ALGORITMOS DE PUNTUACIÓN (funciones puras)
   ═══════════════════════════════════════════════════════════ */

/**
 * Determina el signo real de un partido.
 * @param {number} golesLocal
 * @param {number} golesVisitante
 * @returns {'1'|'X'|'2'}
 */
function calcRealSign(golesLocal, golesVisitante) {
  if (golesLocal > golesVisitante) return '1';
  if (golesLocal < golesVisitante) return '2';
  return 'X';
}

/**
 * Calcula los puntos de un pronóstico de partido.
 * Máximo: 8 pts (signo 1 + resultado exacto 4 + goleador 3).
 *
 * @param {object} pred   - { sign, golesLocal, golesVisitante, firstScorer }
 * @param {object} result - { golesLocal, golesVisitante, firstScorer, realSign }
 * @returns {object} { sign, exacto, firstScorer, total }
 */
function calcMatchPoints(pred, result) {
  const signPts  = (pred.sign === result.realSign) ? 1 : 0;
  const exactoPts = (
    pred.golesLocal     != null && pred.golesLocal     === result.golesLocal &&
    pred.golesVisitante != null && pred.golesVisitante === result.golesVisitante
  ) ? 4 : 0;

  let firstScorerPts = 0;
  const predScorer   = pred.firstScorer || '';
  const realScorer   = result.firstScorer || '';

  if (realScorer === '' && predScorer === '') {
    firstScorerPts = 3;
  } else if (realScorer !== '' && predScorer === realScorer) {
    firstScorerPts = 3;
  }

  return {
    sign:        signPts,
    exacto:      exactoPts,
    firstScorer: firstScorerPts,
    total:       signPts + exactoPts + firstScorerPts
  };
}

/**
 * Calcula los puntos de un pronóstico de clasificación de grupo.
 * 1 punto por cada posición acertada exactamente. Máximo: 4 pts.
 *
 * @param {Array} userPred  - Predicción usuario (4 equipos)
 * @param {Array} realOrder - Clasificación real (4 equipos)
 * @returns {object} { pos1, pos2, pos3, pos4, total }
 */
function calcGroupPoints(userPred, realOrder) {
  const result = { pos1: 0, pos2: 0, pos3: 0, pos4: 0, total: 0 };
  for (let i = 0; i < 4; i++) {
    const key = `pos${i + 1}`;
    if (userPred[i] && realOrder[i] && userPred[i] === realOrder[i]) {
      result[key]   = 1;
      result.total += 1;
    }
  }
  return result;
}

/* ═══════════════════════════════════════════════════════════
   PROCESADO DE PARTIDO — ASYNC (Supabase)
   ═══════════════════════════════════════════════════════════ */

/**
 * Procesa el resultado de un partido:
 * 1. Calcula puntos para cada jugador (usando predicciones de DB).
 * 2. Escribe en Supabase: match_results, predictions (con puntos), player_points.
 * 3. Soporta re-evaluación: resta puntos previos antes de añadir nuevos.
 *
 * @param {string} matchId - ID del partido ("A-0")
 * @param {object} result  - { golesLocal, golesVisitante, firstScorer }
 * @returns {Array} rowData para renderResultsTable()
 */
async function processMatch(matchId, result) {
  const realSign   = calcRealSign(result.golesLocal, result.golesVisitante);
  const fullResult = { ...result, realSign };

  // Cargar predicciones de este partido y puntos actuales de todos los jugadores en paralelo
  const [predsResult, ptsResult] = await Promise.all([
    sb.from('predictions').select('*').eq('match_id', matchId),
    sb.from('player_points').select('*')
  ]);

  const existingPreds = {};
  (predsResult.data || []).forEach(r => { existingPreds[r.player_id] = r; });

  const existingPts = {};
  (ptsResult.data || []).forEach(r => { existingPts[r.player_id] = r.total || 0; });

  const predUpserts = [];
  const ptsUpserts  = [];
  const rowData     = [];

  for (const player of PLAYERS) {
    const slug        = nameToSlug(player);
    const existingRow = existingPreds[slug];
    const pred        = existingRow ? {
      sign:           existingRow.sign,
      golesLocal:     existingRow.goles_local,
      golesVisitante: existingRow.goles_visitante,
      firstScorer:    existingRow.first_scorer,
      points:         existingRow.points
    } : {};

    // Si el jugador no guardó ningún pronóstico, 0 puntos en todo
    const breakdown = existingRow ? calcMatchPoints(pred, fullResult) : { sign: 0, exacto: 0, firstScorer: 0, total: 0 };
    let total = existingPts[slug] || 0;

    // Restar puntos previos si el partido ya había sido evaluado
    if (pred.points?.total) total -= pred.points.total;
    total += breakdown.total;
    if (total < 0) total = 0;

    predUpserts.push({
      player_id:       slug,
      match_id:        matchId,
      sign:            pred.sign          ?? null,
      goles_local:     pred.golesLocal    ?? null,
      goles_visitante: pred.golesVisitante ?? null,
      first_scorer:    pred.firstScorer   ?? null,
      points:          breakdown
    });

    ptsUpserts.push({ player_id: slug, total });

    rowData.push({
      player,
      pred,
      breakdown,
      totalAfter: total,
      wasReeval:  !!pred.points
    });
  }

  // Escritura en paralelo
  await Promise.all([
    sb.from('match_results').upsert({
      match_id:        matchId,
      goles_local:     result.golesLocal,
      goles_visitante: result.golesVisitante,
      first_scorer:    result.firstScorer || null
    }, { onConflict: 'match_id' }),
    sb.from('predictions').upsert(predUpserts, { onConflict: 'player_id,match_id' }),
    sb.from('player_points').upsert(ptsUpserts, { onConflict: 'player_id' })
  ]);

  return rowData;
}

/* ═══════════════════════════════════════════════════════════
   PROCESADO DE GRUPO — ASYNC (Supabase)
   ═══════════════════════════════════════════════════════════ */

/**
 * Procesa el cierre de un grupo:
 * 1. Calcula puntos de clasificación para cada jugador.
 * 2. Escribe en Supabase: group_results, group_predictions (con puntos), player_points.
 * 3. Soporta re-evaluación.
 *
 * @param {string} grupo     - Letra del grupo ("A")
 * @param {Array}  realOrder - Array de 4 equipos en orden real
 * @returns {Array} rowData para renderGroupResultsTable()
 */
async function processGroup(grupo, realOrder) {
  const [grpPredsResult, ptsResult] = await Promise.all([
    sb.from('group_predictions').select('*').eq('grupo', grupo),
    sb.from('player_points').select('*')
  ]);

  const existingGrpPreds = {};
  (grpPredsResult.data || []).forEach(r => { existingGrpPreds[r.player_id] = r; });

  const existingPts = {};
  (ptsResult.data || []).forEach(r => { existingPts[r.player_id] = r.total || 0; });

  const grpUpserts = [];
  const ptsUpserts = [];
  const rowData    = [];

  for (const player of PLAYERS) {
    const slug        = nameToSlug(player);
    const existingRow = existingGrpPreds[slug];
    const userPred    = existingRow?.positions || [];
    const prevPoints  = existingRow?.points;

    const breakdown = calcGroupPoints(userPred, realOrder);
    let total = existingPts[slug] || 0;

    // Restar puntos previos si ya había sido evaluado
    if (prevPoints?.total) total -= prevPoints.total;
    total += breakdown.total;
    if (total < 0) total = 0;

    grpUpserts.push({
      player_id: slug,
      grupo,
      positions: existingRow?.positions || [],
      points:    breakdown,
      evaluated: true
    });

    ptsUpserts.push({ player_id: slug, total });

    rowData.push({
      player,
      userPred,
      breakdown,
      totalAfter: total,
      wasReeval:  !!prevPoints
    });
  }

  await Promise.all([
    sb.from('group_results').upsert({ grupo, positions: realOrder }, { onConflict: 'grupo' }),
    sb.from('group_predictions').upsert(grpUpserts, { onConflict: 'player_id,grupo' }),
    sb.from('player_points').upsert(ptsUpserts, { onConflict: 'player_id' })
  ]);

  return rowData;
}

/* ═══════════════════════════════════════════════════════════
   MODAL DE CONFIRMACIÓN
   ═══════════════════════════════════════════════════════════ */

function showConfirmModal(matchId, result) {
  const match    = allMatchesSorted.find(m => m.id === matchId);
  const existing = storedResultsCache[matchId];
  const preview  = document.getElementById('modal-match-preview');
  const scorer   = result.firstScorer || 'Sin goles';

  preview.innerHTML = `
    <strong>${flag(match.local)} ${match.local} ${result.golesLocal} – ${result.golesVisitante} ${match.visitante} ${flag(match.visitante)}</strong>
    Primer goleador: ${scorer}
    ${existing ? '<br><em style="color:var(--warning);font-size:12px">⚠️ Este partido ya fue evaluado. Se recalcularán los puntos.</em>' : ''}
  `;

  pendingMatchId = matchId;
  pendingResult  = result;

  document.getElementById('confirm-modal').classList.remove('hidden');
}

function hideConfirmModal() {
  document.getElementById('confirm-modal').classList.add('hidden');
  pendingMatchId   = null;
  pendingResult    = null;
  pendingGrupo     = null;
  pendingRealOrder = null;
}

/**
 * Ejecutado al confirmar en el modal: procesa partido o grupo según el contexto.
 */
async function confirmProcess() {
  const confirmBtn = document.getElementById('btn-modal-confirm');
  confirmBtn.disabled = true;

  // Capturar los valores ANTES de que hideConfirmModal los ponga a null
  const matchId = pendingMatchId;
  const result  = pendingResult;
  const grupo   = pendingGrupo;
  const order   = pendingRealOrder;

  hideConfirmModal();

  try {
    if (grupo && order) {
      const rowData = await processGroup(grupo, order);
      await refreshAdminData();
      renderGroupResultsTable(grupo, order, rowData);
      populateGroupSelect();
      renderGroupHistory();
      showToast(`¡Grupo ${grupo} cerrado y puntos repartidos!`, 'success');
    } else if (matchId && result) {
      const rowData = await processMatch(matchId, result);
      await refreshAdminData();
      renderResultsTable(matchId, { ...result, realSign: calcRealSign(result.golesLocal, result.golesVisitante) }, rowData);
      populateMatchSelect();
      renderHistory();
      showToast('¡Puntos repartidos correctamente!', 'success');
    }
  } catch (err) {
    console.error('Error:', err);
    showToast('Error al procesar. Revisa la consola.', 'error');
  } finally {
    confirmBtn.disabled = false;
    document.querySelector('#confirm-modal h3').textContent = '¿Confirmar acción?';
    document.querySelector('#confirm-modal p:first-of-type').innerHTML =
      'Esto repartirá puntos a todos los participantes y marcará el partido como <strong>Finalizado</strong>.';
  }
}

/* ═══════════════════════════════════════════════════════════
   HANDLER DEL BOTÓN PRINCIPAL (partidos)
   ═══════════════════════════════════════════════════════════ */

function handleProcessClick() {
  const matchId       = document.getElementById('match-select').value;
  const golesLocalStr = document.getElementById('goals-local').value;
  const golesVisStr   = document.getElementById('goals-visitor').value;
  const firstScorer   = document.getElementById('first-scorer').value;

  if (!matchId) {
    showToast('Selecciona un partido primero.', 'error');
    return;
  }
  if (golesLocalStr === '' || golesVisStr === '') {
    showToast('Introduce el marcador completo (puede ser 0).', 'error');
    return;
  }

  const golesLocal     = parseInt(golesLocalStr, 10);
  const golesVisitante = parseInt(golesVisStr, 10);

  if (isNaN(golesLocal) || isNaN(golesVisitante) || golesLocal < 0 || golesVisitante < 0) {
    showToast('Los goles deben ser números positivos.', 'error');
    return;
  }

  if (golesLocal === 0 && golesVisitante === 0 && firstScorer !== '') {
    showToast('Aviso: marcas 0-0 pero hay goleador seleccionado. Revisa.', 'error');
    return;
  }

  const result = { golesLocal, golesVisitante, firstScorer };
  showConfirmModal(matchId, result);
}

/* ═══════════════════════════════════════════════════════════
   RECALCULAR TODOS LOS PARTIDOS (nueva fórmula)
   ═══════════════════════════════════════════════════════════ */

async function recalcularTodosPartidos() {
  const btn = document.getElementById('btn-recalcular-todo');
  btn.disabled = true;
  btn.textContent = '⏳ Recalculando…';

  try {
    const { data: results, error } = await sb.from('match_results').select('*');
    if (error) throw error;

    if (!results || results.length === 0) {
      showToast('No hay partidos procesados todavía.', 'error');
      return;
    }

    for (const r of results) {
      await processMatch(r.match_id, {
        golesLocal:     r.goles_local,
        golesVisitante: r.goles_visitante,
        firstScorer:    r.first_scorer || ''
      });
    }

    // Recargar caches y UI
    await refreshAdminData();
    renderHistory();
    showToast(`✅ ${results.length} partido(s) recalculados con la nueva fórmula.`, 'success');
  } catch (err) {
    console.error('Error recalculando partidos:', err);
    showToast('Error al recalcular. Revisa la consola.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '🔄 Recalcular todos los partidos';
  }
}

/* ═══════════════════════════════════════════════════════════
   HANDLER DEL BOTÓN DE GRUPOS
   ═══════════════════════════════════════════════════════════ */

function handleGroupProcessClick() {
  const grupo = document.getElementById('group-select').value;
  if (!grupo) { showToast('Selecciona un grupo primero.', 'error'); return; }

  const realOrder = [1, 2, 3, 4].map(i => document.getElementById(`pos-${i}`).value);

  if (realOrder.some(v => !v)) {
    showToast('Completa los 4 puestos antes de continuar.', 'error');
    return;
  }

  if (new Set(realOrder).size !== 4) {
    showToast('No puede haber equipos repetidos en los puestos.', 'error');
    return;
  }

  const existing = storedGroupResultsCache[grupo];
  const podium   = ['1º', '2º', '3º', '4º'];
  const preview  = document.getElementById('modal-match-preview');

  preview.innerHTML = `
    <strong>Grupo ${grupo}</strong><br>
    ${realOrder.map((t, i) => `${podium[i]}: ${flag(t)} ${t}`).join(' · ')}
    ${existing ? '<br><em style="color:var(--warning);font-size:12px">⚠️ Este grupo ya fue cerrado. Se recalcularán los puntos.</em>' : ''}
  `;

  pendingGrupo     = grupo;
  pendingRealOrder = realOrder;

  document.querySelector('#confirm-modal h3').textContent = '¿Cerrar clasificación del grupo?';
  document.querySelector('#confirm-modal p:first-of-type').innerHTML =
    `Esto repartirá puntos del <strong>Grupo ${grupo}</strong> a todos los participantes.`;

  document.getElementById('confirm-modal').classList.remove('hidden');
}

/* ═══════════════════════════════════════════════════════════
   INTERFAZ: TABLA DE RESULTADOS DE PARTIDO
   ═══════════════════════════════════════════════════════════ */

function renderResultsTable(matchId, result, rowData) {
  const match   = allMatchesSorted.find(m => m.id === matchId);
  const card    = document.getElementById('results-card');
  const summary = document.getElementById('results-summary');

  const scorerText = result.firstScorer
    ? `⚡ Primer goleador: ${result.firstScorer}`
    : 'Sin goles';

  const signLabel = result.realSign === '1'
    ? `Gana ${match.local}`
    : result.realSign === '2'
    ? `Gana ${match.visitante}`
    : 'Empate';

  summary.innerHTML = `
    <div class="match-result-info">
      <strong>${flag(match.local)} ${match.local} ${result.golesLocal} – ${result.golesVisitante} ${match.visitante} ${flag(match.visitante)}</strong>
      Signo: <strong>${result.realSign}</strong> (${signLabel}) &nbsp;·&nbsp; ${scorerText}
    </div>
    <div class="results-table-wrap">
      <table class="results-table">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Su pronóstico</th>
            <th>Signo</th>
            <th>Exacto</th>
            <th>Goleador</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${rowData.map(row => {
            const p        = row.pred;
            const b        = row.breakdown;
            const predSign = p.sign || '—';
            const predLoc  = p.golesLocal      != null ? p.golesLocal      : '—';
            const predVis  = p.golesVisitante  != null ? p.golesVisitante  : '—';
            const predScore = `${predLoc}–${predVis}`;
            const predGoal  = p.firstScorer || 'Ninguno';
            const color     = playerColor(row.player);
            const initial   = getInitial(row.player);
            return `
              <tr>
                <td>
                  <div class="player-cell">
                    <div class="player-av" style="background:${color}">${initial}</div>
                    <span>${row.player}</span>
                  </div>
                </td>
                <td style="color:var(--text-muted);font-size:12px">${predSign} · ${predScore} · ${predGoal}</td>
                <td><span class="${b.sign        ? 'check-icon' : 'cross-icon'}">${b.sign        ? '✅' : '❌'} +${b.sign}</span></td>
                <td><span class="${b.exacto      ? 'check-icon' : 'cross-icon'}">${b.exacto      ? '✅' : '❌'} +${b.exacto}</span></td>
                <td><span class="${b.firstScorer ? 'check-icon' : 'cross-icon'}">${b.firstScorer ? '✅' : '❌'} +${b.firstScorer}</span></td>
                <td><span class="pts-badge">+${b.total} pts</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  card.classList.remove('hidden');
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═══════════════════════════════════════════════════════════
   INTERFAZ: TABLA DE RESULTADOS DE GRUPO
   ═══════════════════════════════════════════════════════════ */

function renderGroupResultsTable(grupo, realOrder, rowData) {
  const card    = document.getElementById('group-results-card');
  const summary = document.getElementById('group-results-summary');

  const podium  = ['🥇', '🥈', '🥉', '4️⃣'];
  const realHtml = realOrder.map((t, i) => `${podium[i]} ${flag(t)} ${t}`).join(' &nbsp;·&nbsp; ');

  summary.innerHTML = `
    <div class="match-result-info">
      <strong>Grupo ${grupo} — Clasificación oficial:</strong><br>
      ${realHtml}
    </div>
    <div class="results-table-wrap">
      <table class="results-table">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Su predicción</th>
            <th>🥇</th><th>🥈</th><th>🥉</th><th>4️⃣</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${rowData.map(row => {
            const b  = row.breakdown;
            const up = row.userPred;
            const hit = (ok) => ok ? '✅' : '❌';
            const predHtml = up.length
              ? up.map((t, i) => `${podium[i]} ${t}`).join('<br>')
              : '<em style="color:var(--text-muted)">Sin predicción</em>';
            return `
              <tr>
                <td>
                  <div class="player-cell">
                    <div class="player-av" style="background:${playerColor(row.player)}">${getInitial(row.player)}</div>
                    <span>${row.player}</span>
                  </div>
                </td>
                <td style="font-size:11px;color:var(--text-muted)">${predHtml}</td>
                <td>${hit(b.pos1)}</td>
                <td>${hit(b.pos2)}</td>
                <td>${hit(b.pos3)}</td>
                <td>${hit(b.pos4)}</td>
                <td><span class="pts-badge">+${b.total} pts</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  card.classList.remove('hidden');
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═══════════════════════════════════════════════════════════
   HISTORIAL DE PARTIDOS — lee desde caches Supabase
   ═══════════════════════════════════════════════════════════ */

function renderHistory() {
  const container = document.getElementById('history-list');
  const ids       = Object.keys(storedResultsCache);

  if (ids.length === 0) {
    container.innerHTML = `
      <div class="empty-history">
        <div class="empty-icon">📭</div>
        <p>Aún no hay partidos finalizados.</p>
      </div>`;
    return;
  }

  // Ordenar por fecha del partido
  ids.sort((a, b) => {
    const mA = allMatchesSorted.find(m => m.id === a);
    const mB = allMatchesSorted.find(m => m.id === b);
    if (!mA || !mB) return 0;
    return mA.date - mB.date;
  });

  container.innerHTML = ids.map(matchId => {
    const r     = storedResultsCache[matchId];
    const match = allMatchesSorted.find(m => m.id === matchId);
    if (!match) return '';

    const scorer = r.firstScorer ? `⚡ ${r.firstScorer}` : 'Sin goles';

    const innerRows = PLAYERS.map(player => {
      const slug = nameToSlug(player);
      const row  = allPredictionsCache.find(p => p.player_id === slug && p.match_id === matchId);
      const b    = row?.points || { sign: 0, exacto: 0, firstScorer: 0, total: 0 };
      return `
        <tr>
          <td>
            <div class="player-cell">
              <div class="player-av" style="background:${playerColor(player)};width:22px;height:22px;font-size:10px">${getInitial(player)}</div>
              <span>${player}</span>
            </div>
          </td>
          <td style="text-align:center">${b.sign        ? '✅' : '❌'}</td>
          <td style="text-align:center">${b.exacto      ? '✅' : '❌'}</td>
          <td style="text-align:center">${b.firstScorer ? '✅' : '❌'}</td>
          <td style="text-align:right;font-weight:700;color:var(--accent)">${b.total} pts</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="history-item" id="hist-${matchId}">
        <div class="history-item-header" onclick="toggleHistoryItem('hist-${matchId}')">
          <div class="history-match-info">
            <span class="history-group-badge">Grupo ${match.grupo}</span>
            <span class="history-teams">${flag(match.local)} ${match.local} vs ${match.visitante} ${flag(match.visitante)}</span>
            <span class="history-score">${r.golesLocal}–${r.golesVisitante}</span>
            <span class="history-scorer-info">${scorer}</span>
          </div>
          <span class="history-chevron">▼</span>
        </div>
        <div class="history-item-body">
          <table class="history-mini-table">
            <thead>
              <tr>
                <th>Jugador</th>
                <th style="text-align:center">Signo</th>
                <th style="text-align:center">Exacto</th>
                <th style="text-align:center">Gol.</th>
                <th style="text-align:right">Pts</th>
              </tr>
            </thead>
            <tbody>${innerRows}</tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════
   HISTORIAL DE GRUPOS — lee desde caches Supabase
   ═══════════════════════════════════════════════════════════ */

function renderGroupHistory() {
  const container = document.getElementById('group-history-list');
  const grupos    = Object.keys(storedGroupResultsCache).sort();

  if (grupos.length === 0) {
    container.innerHTML = `
      <div class="empty-history">
        <div class="empty-icon">📭</div>
        <p>Aún no hay grupos cerrados.</p>
      </div>`;
    return;
  }

  const podium = ['🥇', '🥈', '🥉', '4️⃣'];

  container.innerHTML = grupos.map(grupo => {
    const realOrder = storedGroupResultsCache[grupo];

    const innerRows = PLAYERS.map(player => {
      const slug = nameToSlug(player);
      const row  = allGroupPredsCache.find(p => p.player_id === slug && p.grupo === grupo);
      const userPred = row?.positions || [];
      const b        = row?.points    || { pos1: 0, pos2: 0, pos3: 0, pos4: 0, total: 0 };
      return `
        <tr>
          <td>
            <div class="player-cell">
              <div class="player-av" style="background:${playerColor(player)};width:22px;height:22px;font-size:10px">${getInitial(player)}</div>
              <span>${player}</span>
            </div>
          </td>
          <td style="font-size:11px;color:var(--text-muted)">${userPred.join(' → ') || '—'}</td>
          <td style="text-align:center">${b.pos1 ? '✅' : '❌'}</td>
          <td style="text-align:center">${b.pos2 ? '✅' : '❌'}</td>
          <td style="text-align:center">${b.pos3 ? '✅' : '❌'}</td>
          <td style="text-align:center">${b.pos4 ? '✅' : '❌'}</td>
          <td style="text-align:right;font-weight:700;color:var(--accent)">${b.total} pts</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="history-item" id="hist-grp-${grupo}">
        <div class="history-item-header" onclick="toggleHistoryItem('hist-grp-${grupo}')">
          <div class="history-match-info">
            <span class="history-group-badge">Grupo ${grupo}</span>
            <span class="history-teams">${realOrder.map((t, i) => `${podium[i]} ${flag(t)} ${t}`).join(' · ')}</span>
          </div>
          <span class="history-chevron">▼</span>
        </div>
        <div class="history-item-body">
          <table class="history-mini-table">
            <thead>
              <tr>
                <th>Jugador</th><th>Predicción</th>
                <th style="text-align:center">🥇</th>
                <th style="text-align:center">🥈</th>
                <th style="text-align:center">🥉</th>
                <th style="text-align:center">4º</th>
                <th style="text-align:right">Pts</th>
              </tr>
            </thead>
            <tbody>${innerRows}</tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════
   ACORDEÓN DEL HISTORIAL
   ═══════════════════════════════════════════════════════════ */

function toggleHistoryItem(id) {
  const item = document.getElementById(id);
  if (item) item.classList.toggle('open');
}

/* ═══════════════════════════════════════════════════════════
   ESPECIALES — ADMIN (repartir puntos al final del torneo)
   ═══════════════════════════════════════════════════════════ */

const SPECIAL_FIELDS_ADMIN = [
  { key: 'mvp',                 type: 'player' },
  { key: 'top_scorer',          type: 'player' },
  { key: 'top_assister',        type: 'player' },
  { key: 'golden_glove',        type: 'player' },
  { key: 'revelation_team',     type: 'team'   },
  { key: 'disappointment_team', type: 'team'   }
];

function toggleEspecialesAdmin() {
  const body    = document.getElementById('especiales-admin-body');
  const chevron = document.getElementById('especiales-chevron');
  const hidden  = body.style.display === 'none';
  body.style.display = hidden ? 'block' : 'none';
  chevron.textContent = hidden ? '▲' : '▼';
  if (hidden) populateEspecialesSelects();
}

function getAllTeamsSortedAdmin() {
  const teams = new Set();
  Object.values(matchesData?.grupos || {}).forEach(matches =>
    matches.forEach(m => { teams.add(m.local); teams.add(m.visitante); })
  );
  return [...teams].sort((a, b) => a.localeCompare(b, 'es'));
}

function populateEspecialesSelects() {
  const teams    = getAllTeamsSortedAdmin();
  const teamOpts = '<option value="">— Selección —</option>' +
    teams.map(t => `<option value="${t}">${t}</option>`).join('');

  SPECIAL_FIELDS_ADMIN.forEach(f => {
    if (f.type === 'team') {
      const sel = document.getElementById(`adm-esp-sel-${f.key}`);
      if (sel) {
        sel.innerHTML = teamOpts;
        if (storedSpecialResults?.[f.key]) sel.value = storedSpecialResults[f.key];
      }
    } else {
      const teamSel = document.getElementById(`adm-esp-team-${f.key}`);
      if (teamSel) {
        teamSel.innerHTML = teamOpts;
        if (storedSpecialResults?.[f.key]) {
          const savedPlayer = storedSpecialResults[f.key];
          for (const t of teams) {
            const players = getPlayersForTeam(t);
            if (players.some(p => `${p.nombre} ${p.apellido}` === savedPlayer)) {
              teamSel.value = t;
              adminSpecialTeamChange(f.key, savedPlayer);
              break;
            }
          }
        }
      }
    }
  });
}

function adminSpecialTeamChange(fieldKey, preselectPlayer = null) {
  const teamSel   = document.getElementById(`adm-esp-team-${fieldKey}`);
  const playerSel = document.getElementById(`adm-esp-sel-${fieldKey}`);
  if (!teamSel || !playerSel) return;
  const team    = teamSel.value;
  const players = team ? getPlayersForTeam(team) : [];
  playerSel.innerHTML = '<option value="">— Jugador —</option>' +
    players.map(p => {
      const full = `${p.nombre} ${p.apellido}`;
      return `<option value="${full}" ${preselectPlayer === full ? 'selected' : ''}>${full}</option>`;
    }).join('');
  playerSel.disabled = players.length === 0;
}

async function processSpeciales() {
  const btn = document.getElementById('btn-especiales-process');
  btn.disabled = true;
  btn.textContent = '⏳ Procesando…';

  const results = {};
  SPECIAL_FIELDS_ADMIN.forEach(f => {
    const sel = document.getElementById(`adm-esp-sel-${f.key}`);
    results[f.key] = sel?.value || null;
  });

  if (Object.values(results).every(v => !v)) {
    showToast('Completa al menos un campo antes de guardar', 'error');
    btn.disabled = false;
    btn.textContent = '🌟 Guardar Resultados y Repartir Puntos';
    return;
  }

  const { error: resErr } = await sb.from('special_results')
    .upsert({ id: 'final', ...results }, { onConflict: 'id' });
  if (resErr) {
    showToast('Error guardando resultados: ' + resErr.message, 'error');
    btn.disabled = false;
    btn.textContent = '🌟 Guardar Resultados y Repartir Puntos';
    return;
  }
  storedSpecialResults = results;

  const [specPredsRes, ptsRes] = await Promise.all([
    sb.from('special_predictions').select('*'),
    sb.from('player_points').select('*')
  ]);

  const allSpecPreds = specPredsRes.data || [];
  const ptsMap = {};
  (ptsRes.data || []).forEach(r => { ptsMap[r.player_id] = r; });

  const ptsUpserts = [];
  const rowData    = [];

  PLAYERS.forEach(name => {
    const slug    = nameToSlug(name);
    const pred    = allSpecPreds.find(r => r.player_id === slug) || {};
    const current = ptsMap[slug] || { total: 0, special_total: 0 };

    let specialPts = 0;
    SPECIAL_FIELDS_ADMIN.forEach(f => {
      if (results[f.key] && pred[f.key] && pred[f.key] === results[f.key]) specialPts += 3;
    });

    ptsUpserts.push({ player_id: slug, total: current.total || 0, special_total: specialPts });
    rowData.push({ name, specialPts });
  });

  const { error: ptsErr } = await sb.from('player_points')
    .upsert(ptsUpserts, { onConflict: 'player_id' });
  if (ptsErr) {
    showToast('Error actualizando puntos: ' + ptsErr.message, 'error');
    btn.disabled = false;
    btn.textContent = '🌟 Guardar Resultados y Repartir Puntos';
    return;
  }

  const LABELS = {
    mvp: '🏅 MVP', top_scorer: '⚽ Máx. Goleador', top_assister: '🎯 Máx. Asistente',
    golden_glove: '🧤 Guante Oro', revelation_team: '🌟 Revelación', disappointment_team: '😞 Decepción'
  };

  const card    = document.getElementById('especiales-results-card');
  const summary = document.getElementById('especiales-results-summary');
  card.classList.remove('hidden');
  summary.innerHTML = `
    <div class="esp-admin-results">
      <h4 style="margin:0 0 12px;color:var(--accent)">Ganadores registrados</h4>
      ${SPECIAL_FIELDS_ADMIN.map(f => results[f.key]
        ? `<div class="esp-admin-result-row"><span>${LABELS[f.key]}</span><strong>${results[f.key]}</strong></div>`
        : '').join('')}
    </div>
    <h4 style="margin:16px 0 10px">Puntos especiales por jugador</h4>
    <div class="esp-admin-pts-list">
      ${rowData.sort((a, b) => b.specialPts - a.specialPts).map(r => `
        <div class="esp-admin-pts-row">
          <div class="player-av-sm" style="background:${playerColor(r.name)}">${getInitial(r.name)}</div>
          <span class="esp-admin-pts-name">${r.name}</span>
          <span class="esp-admin-pts-val ${r.specialPts > 0 ? 'has-pts' : ''}">${r.specialPts} pts</span>
        </div>`).join('')}
    </div>`;

  showToast('✅ Puntos especiales guardados correctamente', 'success');
  btn.disabled = false;
  btn.textContent = '🌟 Guardar Resultados y Repartir Puntos';
}

/* ═══════════════════════════════════════════════════════════
   TAB JUGADORES — apuestas finalizadas por jugador
   ═══════════════════════════════════════════════════════════ */

function renderJugadoresTab() {
  const container = document.getElementById('jugadores-list');
  if (!container) return;

  // Partidos con resultado registrado, ordenados por fecha
  const finishedMatches = allMatchesSorted.filter(m => storedResultsCache[m.id]);

  if (finishedMatches.length === 0) {
    container.innerHTML = `
      <div class="empty-history">
        <div class="empty-icon">📭</div>
        <p>Aún no hay partidos finalizados.</p>
      </div>`;
    return;
  }

  // Ordenar jugadores por puntos totales (desc)
  const playersRanked = [...PLAYERS].sort((a, b) => {
    const slugA = nameToSlug(a);
    const slugB = nameToSlug(b);
    const ptsA  = allPredictionsCache
      .filter(r => r.player_id === slugA && storedResultsCache[r.match_id])
      .reduce((s, r) => s + (r.points?.total || 0), 0);
    const ptsB  = allPredictionsCache
      .filter(r => r.player_id === slugB && storedResultsCache[r.match_id])
      .reduce((s, r) => s + (r.points?.total || 0), 0);
    return ptsB - ptsA;
  });

  container.innerHTML = playersRanked.map(player => {
    const slug  = nameToSlug(player);
    const color = playerColor(player);

    // Predicciones finalizadas de este jugador
    const playerPreds = {};
    allPredictionsCache
      .filter(r => r.player_id === slug && storedResultsCache[r.match_id])
      .forEach(r => { playerPreds[r.match_id] = r; });

    const totalPts = Object.values(playerPreds)
      .reduce((s, r) => s + (r.points?.total || 0), 0);

    const matchRows = finishedMatches.map(m => {
      const result = storedResultsCache[m.id];
      const pred   = playerPreds[m.id];
      const b      = pred?.points || { sign: 0, exacto: 0, firstScorer: 0, total: 0 };

      const predStr = pred
        ? `${pred.sign || '—'} · ${pred.goles_local ?? '—'}–${pred.goles_visitante ?? '—'} · ${pred.first_scorer || 'Ninguno'}`
        : '—';

      const hit = ok => ok ? '✅' : '❌';

      return `
        <tr>
          <td style="font-size:11px;color:var(--text-muted)">
            <span class="history-group-badge" style="font-size:10px">Gr.${m.grupo}</span>
            ${flag(m.local)} ${m.local} ${result.golesLocal}–${result.golesVisitante} ${m.visitante} ${flag(m.visitante)}
          </td>
          <td style="font-size:11px;color:var(--text-muted)">${predStr}</td>
          <td style="text-align:center">${hit(b.sign)}</td>
          <td style="text-align:center">${hit(b.exacto)}</td>
          <td style="text-align:center">${hit(b.firstScorer)}</td>
          <td style="text-align:right;font-weight:700;color:${b.total > 0 ? 'var(--accent)' : 'var(--text-muted)'}">${b.total}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="history-item" id="jug-${slug}">
        <div class="history-item-header" onclick="toggleHistoryItem('jug-${slug}')">
          <div class="history-match-info" style="gap:10px">
            <div class="player-av" style="background:${color};width:28px;height:28px;font-size:13px;flex-shrink:0">${getInitial(player)}</div>
            <span class="history-teams">${player}</span>
            <span class="history-scorer-info" style="margin-left:auto">${finishedMatches.length} partidos finalizados</span>
            <span class="history-score" style="min-width:60px;text-align:right">${totalPts} pts</span>
          </div>
          <span class="history-chevron">▼</span>
        </div>
        <div class="history-item-body">
          <table class="history-mini-table">
            <thead>
              <tr>
                <th>Partido</th>
                <th>Tu apuesta</th>
                <th style="text-align:center">1/X/2</th>
                <th style="text-align:center">Exacto</th>
                <th style="text-align:center">Gol.</th>
                <th style="text-align:right">Pts</th>
              </tr>
            </thead>
            <tbody>${matchRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="5" style="text-align:right;font-weight:600;padding-top:8px">Total</td>
                <td style="text-align:right;font-weight:700;color:var(--accent);padding-top:8px">${totalPts} pts</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════
   TOAST DE NOTIFICACIÓN
   ═══════════════════════════════════════════════════════════ */

function showToast(msg, type = '') {
  const el       = document.getElementById('toast');
  el.textContent = msg;
  el.className   = `toast ${type}`;
  void el.offsetWidth; // forzar reflow para reiniciar transición
  el.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 3500);
}

/* ═══════════════════════════════════════════════════════════
   INICIALIZACIÓN
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  checkSession();

  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('btn-logout').addEventListener('click', handleLogout);

  document.getElementById('match-select').addEventListener('change', handleMatchSelect);
  document.getElementById('btn-process').addEventListener('click', handleProcessClick);

  document.getElementById('group-select').addEventListener('change', handleGroupSelect);
  document.getElementById('btn-group-process').addEventListener('click', handleGroupProcessClick);

  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab));
  });

  document.getElementById('btn-especiales-process').addEventListener('click', processSpeciales);

  document.getElementById('btn-modal-cancel').addEventListener('click', hideConfirmModal);
  document.getElementById('btn-modal-confirm').addEventListener('click', confirmProcess);

  document.getElementById('confirm-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('confirm-modal')) hideConfirmModal();
  });
});
