/* ============================================================
   KINIELA MUNDIAL 2026 — admin.js
   Panel de administración: autenticación, carga de datos,
   cálculo de puntos y gestión de resultados.

   ⚠️  SOLO PROTOTIPO — Las credenciales están en texto plano.
       Esto NO es seguro para producción. En un entorno real,
       la autenticación debe hacerse en el servidor con hashing
       de contraseñas y tokens de sesión seguros.
   ============================================================ */

'use strict';

/* ── Credenciales (SOLO PROTOTIPO — ver advertencia arriba) ── */
const ADMIN_EMAIL    = 'ggarmendiabalmana@gmail.com';
const ADMIN_PASSWORD = 'kiniela2026';

/* ── Jugadores de la kiniela ─────────────────────────────── */
const PLAYERS = [
  'Cole Garmer', 'Luisgarrincha', 'Alex Casadinho', 'Guisermo Casadinho',
  'AnsuFigui', 'DaniTwangy', 'Dudu', 'XaviCarbu', 'MarkusRashford', 'BusiCusi'
];

const PLAYER_COLORS = [
  '#e63946','#f5c518','#2ecc71','#3498db','#9b59b6',
  '#e67e22','#1abc9c','#e91e63','#00bcd4','#ff5722'
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

/* ── Estado del módulo ───────────────────────────────────── */
let matchesData    = null;   // datos de matches.json
let playersData    = null;   // datos de players.json
let playersByEnglish = {};   // { "Spain": [{nombre, apellido}, ...] }
let allMatchesSorted = [];   // lista plana de partidos ordenada por fecha

// Referencia al partido pendiente de confirmar en el modal
let pendingMatchId = null;
let pendingResult  = null;

/* ═══════════════════════════════════════════════════════════
   AUTENTICACIÓN
   ═══════════════════════════════════════════════════════════ */

/**
 * Comprueba sessionStorage al cargar la página.
 * Si ya hay sesión activa, muestra el panel directamente.
 */
function checkSession() {
  if (sessionStorage.getItem('adminAuthenticated') === 'true') {
    showPanel();
  }
}

/**
 * Intenta autenticar con las credenciales del formulario.
 * Si coinciden, guarda la sesión y muestra el panel.
 */
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

/**
 * Cierra la sesión: elimina sessionStorage y vuelve al login.
 */
function handleLogout() {
  sessionStorage.removeItem('adminAuthenticated');
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('login-section').classList.remove('hidden');
  // Limpiar campos por seguridad
  document.getElementById('login-email').value    = '';
  document.getElementById('login-password').value = '';
}

/**
 * Muestra el panel admin y oculta el formulario de login.
 * Carga datos si aún no están cargados.
 */
function showPanel() {
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('admin-panel').classList.remove('hidden');
  if (!matchesData) {
    loadData();
  } else {
    populateMatchSelect();
    populateGroupSelect();
    renderHistory();
    renderGroupHistory();
  }
}

/* ═══════════════════════════════════════════════════════════
   CARGA DE DATOS
   ═══════════════════════════════════════════════════════════ */

/**
 * Carga matches.json y players.json en paralelo.
 * Una vez disponibles, construye los mapas y rellena la UI.
 */
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
    populateMatchSelect();
    populateGroupSelect();
    renderHistory();
    renderGroupHistory();
  } catch (err) {
    console.error('Error cargando datos:', err);
    showToast('Error al cargar datos JSON. ¿Está corriendo el servidor?', 'error');
  }
}

/**
 * Construye el mapa playersByEnglish:
 * { "Spain": [{nombre:"Álvaro", apellido:"Morata"}, ...], ... }
 * Clave: nombre en inglés (como aparece en players.json → "seleccion").
 */
function buildPlayersMap() {
  playersByEnglish = {};
  playersData.forEach(team => {
    playersByEnglish[team.seleccion] = team.jugadores;
  });
}

/**
 * Construye la lista plana de todos los partidos ordenada por fecha/hora.
 * Cada entrada tiene: { grupo, idx, id, local, visitante, fecha, hora, date }
 */
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
   HELPERS DE FECHA Y BANDERAS
   ═══════════════════════════════════════════════════════════ */

const MONTH_MAP = {
  'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
  'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
};

function parseMatchDate(fecha, hora) {
  const parts = fecha.split(' ');
  const day   = parseInt(parts[0], 10);
  const month = MONTH_MAP[parts[1].toLowerCase()] ?? 5;
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

/**
 * Devuelve la lista de jugadores de un equipo por nombre en español.
 */
function getPlayersForTeam(spanishName) {
  const en = TEAM_NAME_MAP[spanishName];
  return playersByEnglish[en] || [];
}

/* ═══════════════════════════════════════════════════════════
   SELECTOR DE PARTIDOS
   ═══════════════════════════════════════════════════════════ */

/**
 * Rellena el <select id="match-select"> con todos los partidos
 * ordenados por fecha. Los ya finalizados llevan prefijo ✅.
 */
function populateMatchSelect() {
  const sel = document.getElementById('match-select');
  const results = getStoredResults();

  sel.innerHTML = '<option value="">— Selecciona un partido —</option>';

  allMatchesSorted.forEach(m => {
    const isFinished = !!results[m.id];
    const prefix     = isFinished ? '✅ ' : '';
    const label      = `${prefix}Grupo ${m.grupo}: ${m.local} vs ${m.visitante} (${m.fecha}, ${m.hora})`;
    const opt        = document.createElement('option');
    opt.value        = m.id;
    opt.textContent  = label;
    sel.appendChild(opt);
  });

  // Habilitar botón solo cuando hay un partido seleccionado
  document.getElementById('btn-process').disabled = true;
}

/**
 * Reacciona al cambio de partido en el selector:
 * - Actualiza las etiquetas de los equipos en las entradas de goles.
 * - Rellena el dropdown de primer goleador con ambos planteles.
 * - Si el partido ya tiene resultado guardado, pre-rellena los campos.
 */
function handleMatchSelect() {
  const matchId = document.getElementById('match-select').value;
  const btnProcess = document.getElementById('btn-process');

  if (!matchId) {
    resetScoreInputs();
    btnProcess.disabled = true;
    return;
  }

  btnProcess.disabled = false;

  const match = allMatchesSorted.find(m => m.id === matchId);
  if (!match) return;

  // Actualizar etiquetas locales/visitante
  document.getElementById('label-local').textContent   = `${flag(match.local)} ${match.local}`;
  document.getElementById('label-visitor').textContent = `${flag(match.visitante)} ${match.visitante}`;

  // Pre-rellenar si existe resultado previo
  const results = getStoredResults();
  const prev    = results[matchId];
  if (prev) {
    document.getElementById('goals-local').value   = prev.golesLocal;
    document.getElementById('goals-visitor').value = prev.golesVisitante;
  } else {
    document.getElementById('goals-local').value   = '';
    document.getElementById('goals-visitor').value = '';
  }

  // Rellenar dropdown de primer goleador
  populateScorerDropdown(match, prev ? prev.firstScorer : '');
}

/**
 * Rellena el <select id="first-scorer"> con los jugadores de ambos equipos,
 * agrupados por equipo con <optgroup>.
 * @param {object} match   - objeto de partido { local, visitante, ... }
 * @param {string} current - valor pre-seleccionado (si hay resultado previo)
 */
function populateScorerDropdown(match, current = '') {
  const sel = document.getElementById('first-scorer');
  sel.innerHTML = '';

  // Opción "ninguno"
  const noneOpt = document.createElement('option');
  noneOpt.value       = '';
  noneOpt.textContent = 'Ninguno (0-0 o sin goles)';
  sel.appendChild(noneOpt);

  const addGroup = (teamName) => {
    const players = getPlayersForTeam(teamName);
    if (players.length === 0) return;
    const group = document.createElement('optgroup');
    group.label = `${flag(teamName)} ${teamName}`;
    players.forEach(p => {
      const full = `${p.nombre} ${p.apellido}`;
      const opt  = document.createElement('option');
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
   ALGORITMO DE PUNTUACIÓN
   ═══════════════════════════════════════════════════════════ */

/**
 * ALGORITMO DE PUNTUACIÓN
 * =======================
 * Evalúa la quiniela de un jugador contra el resultado real.
 * Los puntos son independientes y completamente acumulables.
 * Máximo posible: 9 puntos por partido.
 *
 * Reglas:
 *
 *  1. SIGNO (1 punto)
 *     El jugador debe acertar el signo del resultado:
 *       "1" → gana el equipo local
 *       "X" → empate
 *       "2" → gana el equipo visitante
 *     Solo se compara el signo (quién gana / empate), no el marcador exacto.
 *
 *  2. GOLES LOCAL (3 puntos)
 *     El jugador debe pronosticar el número exacto de goles marcados
 *     por el equipo local. Parcial: no hay puntos intermedios.
 *
 *  3. GOLES VISITANTE (3 puntos)
 *     Igual que goles local pero para el equipo visitante.
 *
 *  4. PRIMER GOLEADOR (2 puntos)
 *     El jugador debe pronosticar exactamente el nombre completo del
 *     primer jugador en marcar en el partido.
 *     Caso especial: si el partido termina 0-0 (sin goles) y el jugador
 *     eligió "Ninguno" (valor vacío ""), también obtiene los 2 puntos.
 *
 * @param {object} pred   - Predicción del jugador:
 *                          { sign, golesLocal, golesVisitante, firstScorer }
 * @param {object} result - Resultado real:
 *                          { golesLocal, golesVisitante, firstScorer, realSign }
 * @returns {object} Desglose: { sign, golesLocal, golesVisitante, firstScorer, total }
 *                   Cada campo es 0 o el valor máximo posible (1/3/3/2).
 */
function calcMatchPoints(pred, result) {
  // ── 1. Puntos por signo ───────────────────────────────────────
  // Comparamos el signo pronosticado contra el signo real del resultado.
  const signPts = (pred.sign === result.realSign) ? 1 : 0;

  // ── 2. Puntos por goles del equipo local ─────────────────────
  // El pronóstico debe ser exactamente igual al resultado (número entero).
  // Si el jugador no hizo pronóstico (null/undefined), no suma.
  const golesLocalPts = (pred.golesLocal != null && pred.golesLocal === result.golesLocal) ? 3 : 0;

  // ── 3. Puntos por goles del equipo visitante ─────────────────
  // Mismo criterio que goles local.
  const golesVisitantePts = (pred.golesVisitante != null && pred.golesVisitante === result.golesVisitante) ? 3 : 0;

  // ── 4. Puntos por primer goleador ────────────────────────────
  // Caso A — partido con goles: comparación exacta de nombre completo.
  // Caso B — partido 0-0: si el resultado no tiene goleador ("") y el
  //           jugador eligió "Ninguno" (firstScorer vacío o nulo), suma.
  let firstScorerPts = 0;
  const predScorer   = pred.firstScorer || '';
  const realScorer   = result.firstScorer || '';

  if (realScorer === '' && predScorer === '') {
    // Partido sin goles y el jugador apostó por "Ninguno" → ✅
    firstScorerPts = 2;
  } else if (realScorer !== '' && predScorer === realScorer) {
    // Partido con goles y el jugador acertó el nombre exacto → ✅
    firstScorerPts = 2;
  }
  // En cualquier otro caso (ej: eligió a alguien y no marcó primero) → 0

  return {
    sign:           signPts,           // 0 ó 1
    golesLocal:     golesLocalPts,     // 0 ó 3
    golesVisitante: golesVisitantePts, // 0 ó 3
    firstScorer:    firstScorerPts,    // 0 ó 2
    total:          signPts + golesLocalPts + golesVisitantePts + firstScorerPts
  };
}

/**
 * Determina el signo real de un partido a partir de los goles.
 * @param {number} golesLocal     - Goles del equipo local
 * @param {number} golesVisitante - Goles del equipo visitante
 * @returns {'1'|'X'|'2'}
 */
function calcRealSign(golesLocal, golesVisitante) {
  if (golesLocal > golesVisitante) return '1';
  if (golesLocal < golesVisitante) return '2';
  return 'X';
}

/* ═══════════════════════════════════════════════════════════
   PROCESADO DEL PARTIDO
   ═══════════════════════════════════════════════════════════ */

/**
 * Procesa el resultado de un partido:
 * 1. Calcula el signo real (1/X/2) a partir de los goles.
 * 2. Para cada jugador:
 *    a. Lee su pronóstico de localStorage.
 *    b. Calcula los puntos con calcMatchPoints().
 *    c. Si el partido ya había sido evaluado antes (re-corrección),
 *       resta los puntos anteriores del acumulado del jugador.
 *    d. Añade los nuevos puntos al acumulado.
 *    e. Guarda el desglose en el pronóstico (pred.points, pred.evaluated).
 *    f. Persiste todo en localStorage.
 * 3. Guarda el resultado en kiniela_results.
 * 4. Devuelve un array con el desglose por jugador para mostrar en tabla.
 *
 * @param {string} matchId - ID del partido (ej: "A-0")
 * @param {object} result  - { golesLocal, golesVisitante, firstScorer }
 * @returns {Array} rowData para renderResultsTable()
 */
function processMatch(matchId, result) {
  // ── Paso 1: calcular signo real ───────────────────────────────
  const realSign = calcRealSign(result.golesLocal, result.golesVisitante);
  const fullResult = { ...result, realSign, estado: 'finalizado' };

  // ── Paso 2: cargar resultados previos para detectar re-evaluación ─
  const storedResults = getStoredResults();
  const previousResult = storedResults[matchId] || null; // null si es primera vez

  const rowData = [];

  // ── Paso 3: iterar sobre todos los jugadores ──────────────────
  PLAYERS.forEach(player => {
    // a. Leer pronóstico del jugador
    let preds = {};
    try {
      preds = JSON.parse(localStorage.getItem(`kiniela_predictions_${player}`) || '{}');
    } catch { preds = {}; }

    const pred = preds[matchId] || {};

    // b. Calcular puntos para este partido
    const breakdown = calcMatchPoints(pred, fullResult);

    // c. Manejar re-evaluación: restar puntos previos si existían ─
    //    Esto permite corregir errores del admin sin acumular doble.
    let currentTotal = parseInt(localStorage.getItem(`kiniela_total_points_${player}`) || '0', 10);

    if (pred.evaluated && pred.points) {
      // El partido ya había sido procesado: restar los puntos anteriores
      currentTotal -= (pred.points.total || 0);
    }

    // d. Sumar los nuevos puntos al acumulado
    currentTotal += breakdown.total;
    if (currentTotal < 0) currentTotal = 0; // nunca negativo

    // e. Guardar el desglose dentro del pronóstico del jugador
    preds[matchId] = {
      ...pred,
      points:    breakdown,  // desglose: { sign, golesLocal, golesVisitante, firstScorer, total }
      evaluated: true        // marca que este partido ya fue evaluado
    };

    // f. Persistir pronóstico actualizado y puntos totales
    localStorage.setItem(`kiniela_predictions_${player}`, JSON.stringify(preds));
    localStorage.setItem(`kiniela_total_points_${player}`, String(currentTotal));

    // Guardar fila para la tabla de resultados
    rowData.push({
      player,
      pred,         // pronóstico original (antes de añadir .points)
      breakdown,
      totalAfter: currentTotal,
      wasReeval: pred.evaluated === true // ¿era una re-evaluación?
    });
  });

  // ── Paso 4: guardar resultado del partido en kiniela_results ──
  storedResults[matchId] = fullResult;
  localStorage.setItem('kiniela_results', JSON.stringify(storedResults));

  return rowData;
}

/* ═══════════════════════════════════════════════════════════
   HELPERS DE localStorage
   ═══════════════════════════════════════════════════════════ */

function getStoredResults() {
  try {
    return JSON.parse(localStorage.getItem('kiniela_results') || '{}');
  } catch {
    return {};
  }
}

function getStoredGroupResults() {
  try {
    return JSON.parse(localStorage.getItem('kiniela_group_results') || '{}');
  } catch {
    return {};
  }
}

/* ═══════════════════════════════════════════════════════════
   TAB SWITCHING (ADMIN)
   ═══════════════════════════════════════════════════════════ */

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tabName)
  );
  document.querySelectorAll('.admin-tab-content').forEach(c =>
    c.classList.toggle('active', c.id === `admin-tab-${tabName}`)
  );
  if (tabName === 'grupos') renderGroupHistory();
}

/* ═══════════════════════════════════════════════════════════
   SECCIÓN: GRUPOS — SELECTOR Y PUESTOS
   ═══════════════════════════════════════════════════════════ */

/**
 * Rellena el selector de grupos (A–L) al arrancar el panel.
 * Los grupos ya cerrados llevan prefijo ✅.
 */
function populateGroupSelect() {
  if (!matchesData) return;
  const sel     = document.getElementById('group-select');
  const results = getStoredGroupResults();
  const grupos  = Object.keys(matchesData.grupos).sort();

  sel.innerHTML = '<option value="">— Selecciona un grupo —</option>';
  grupos.forEach(g => {
    const done = !!results[g];
    const opt  = document.createElement('option');
    opt.value       = g;
    opt.textContent = `${done ? '✅ ' : ''}Grupo ${g}`;
    sel.appendChild(opt);
  });

  document.getElementById('group-positions').classList.add('hidden');
}

/**
 * Devuelve los 4 equipos de un grupo (deduplicados, en orden de aparición).
 */
function getGroupTeams(grupo) {
  const matches = matchesData.grupos[grupo] || [];
  const seen    = [];
  matches.forEach(m => {
    if (!seen.includes(m.local))     seen.push(m.local);
    if (!seen.includes(m.visitante)) seen.push(m.visitante);
  });
  return seen.slice(0, 4);
}

/**
 * Al seleccionar un grupo, muestra los 4 selectores de puesto
 * con los equipos de ese grupo. Pre-rellena si ya está cerrado.
 */
function handleGroupSelect() {
  const grupo     = document.getElementById('group-select').value;
  const posDiv    = document.getElementById('group-positions');
  const btnGroup  = document.getElementById('btn-group-process');

  if (!grupo) { posDiv.classList.add('hidden'); return; }

  const teams   = getGroupTeams(grupo);
  const results = getStoredGroupResults();
  const prev    = results[grupo] || []; // array de 4 equipos ya guardado

  // Rellenar cada selector de puesto con los 4 equipos del grupo
  [1, 2, 3, 4].forEach(pos => {
    const sel = document.getElementById(`pos-${pos}`);
    sel.innerHTML = '<option value="">— Equipo —</option>';
    teams.forEach(team => {
      const opt = document.createElement('option');
      opt.value       = team;
      opt.textContent = `${flag(team)} ${team}`;
      if (prev[pos - 1] === team) opt.selected = true;
      sel.appendChild(opt);
    });
  });

  posDiv.classList.remove('hidden');
  btnGroup.disabled = false;
}

/* ═══════════════════════════════════════════════════════════
   ALGORITMO DE PUNTUACIÓN DE GRUPOS
   ═══════════════════════════════════════════════════════════ */

/**
 * ALGORITMO DE PUNTUACIÓN DE GRUPOS
 * ===================================
 * Compara la predicción de clasificación de un grupo con el orden real.
 * Se otorga 1 punto por cada posición exactamente acertada.
 * Máximo: 4 puntos por grupo (1 por cada puesto acertado).
 *
 * Ejemplo:
 *   Predicción usuario: ["España", "Brasil", "Cabo Verde", "Arabia Saudí"]
 *   Resultado real:     ["Brasil", "España", "Cabo Verde", "Arabia Saudí"]
 *   → 1º: ❌ | 2º: ❌ | 3º: ✅ +1 | 4º: ✅ +1 → 2 puntos
 *
 * @param {Array} userPred  - Predicción: array de 4 nombres de equipo
 * @param {Array} realOrder - Clasificación real: array de 4 nombres de equipo
 * @returns {Object} { pos1, pos2, pos3, pos4, total }
 */
function calcGroupPoints(userPred, realOrder) {
  const result = { pos1: 0, pos2: 0, pos3: 0, pos4: 0, total: 0 };

  for (let i = 0; i < 4; i++) {
    const key = `pos${i + 1}`;
    // Solo puntúa si el usuario hizo una predicción Y coincide exactamente
    if (userPred[i] && realOrder[i] && userPred[i] === realOrder[i]) {
      result[key]   = 1;
      result.total += 1;
    }
  }

  return result;
}

/* ═══════════════════════════════════════════════════════════
   PROCESADO DEL GRUPO
   ═══════════════════════════════════════════════════════════ */

/**
 * Procesa el cierre de un grupo:
 * 1. Para cada jugador, lee su predicción de grupo.
 * 2. Calcula puntos con calcGroupPoints().
 * 3. Si el grupo ya había sido evaluado (re-corrección),
 *    resta los puntos anteriores antes de añadir los nuevos.
 * 4. Guarda el desglose y actualiza el total del jugador.
 * 5. Persiste el resultado real en kiniela_group_results.
 *
 * @param {string} grupo     - Letra del grupo (ej: "A")
 * @param {Array}  realOrder - Array de 4 equipos en orden real [1º,2º,3º,4º]
 * @returns {Array} rowData para renderGroupResultsTable()
 */
function processGroup(grupo, realOrder) {
  const storedGroupResults = getStoredGroupResults();
  const wasEvaluated       = !!storedGroupResults[grupo];

  const rowData = [];

  PLAYERS.forEach(player => {
    // Leer predicción de grupos del jugador
    let groupPreds = {};
    try {
      groupPreds = JSON.parse(localStorage.getItem(`kiniela_groups_${player}`) || '{}');
    } catch { groupPreds = {}; }

    const userPred = groupPreds[grupo] || [];

    // Calcular puntos
    const breakdown = calcGroupPoints(userPred, realOrder);

    // Manejar re-evaluación: restar puntos previos si los había
    let currentTotal = parseInt(localStorage.getItem(`kiniela_total_points_${player}`) || '0', 10);
    const prevBreakdown = groupPreds[`${grupo}_points`];
    if (prevBreakdown) {
      currentTotal -= (prevBreakdown.total || 0);
    }

    // Sumar nuevos puntos
    currentTotal += breakdown.total;
    if (currentTotal < 0) currentTotal = 0;

    // Guardar desglose en el objeto de predicciones de grupos
    groupPreds[`${grupo}_points`]    = breakdown; // { pos1,pos2,pos3,pos4,total }
    groupPreds[`${grupo}_evaluated`] = true;

    localStorage.setItem(`kiniela_groups_${player}`, JSON.stringify(groupPreds));
    localStorage.setItem(`kiniela_total_points_${player}`, String(currentTotal));

    rowData.push({ player, userPred, breakdown, totalAfter: currentTotal, wasReeval: wasEvaluated });
  });

  // Guardar resultado real del grupo
  storedGroupResults[grupo] = realOrder;
  localStorage.setItem('kiniela_group_results', JSON.stringify(storedGroupResults));

  return rowData;
}

/* ═══════════════════════════════════════════════════════════
   INTERFAZ: TABLA DE RESULTADOS DE GRUPOS
   ═══════════════════════════════════════════════════════════ */

function renderGroupResultsTable(grupo, realOrder, rowData) {
  const card    = document.getElementById('group-results-card');
  const summary = document.getElementById('group-results-summary');

  const podium = ['🥇', '🥈', '🥉', '4️⃣'];
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
   INTERFAZ: HISTORIAL DE GRUPOS
   ═══════════════════════════════════════════════════════════ */

function renderGroupHistory() {
  const container = document.getElementById('group-history-list');
  const results   = getStoredGroupResults();
  const grupos    = Object.keys(results).sort();

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
    const realOrder = results[grupo];

    const innerRows = PLAYERS.map(player => {
      let groupPreds = {};
      try { groupPreds = JSON.parse(localStorage.getItem(`kiniela_groups_${player}`) || '{}'); } catch {}
      const userPred  = groupPreds[grupo] || [];
      const b         = groupPreds[`${grupo}_points`] || { pos1:0, pos2:0, pos3:0, pos4:0, total:0 };
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
   HANDLER DEL BOTÓN DE GRUPOS
   ═══════════════════════════════════════════════════════════ */

/**
 * Variables de estado para el modal de grupos.
 */
let pendingGrupo     = null;
let pendingRealOrder = null;

function handleGroupProcessClick() {
  const grupo = document.getElementById('group-select').value;
  if (!grupo) { showToast('Selecciona un grupo primero.', 'error'); return; }

  const teams     = getGroupTeams(grupo);
  const realOrder = [1, 2, 3, 4].map(i => document.getElementById(`pos-${i}`).value);

  // Validar que todos los puestos estén rellenos
  if (realOrder.some(v => !v)) {
    showToast('Completa los 4 puestos antes de continuar.', 'error');
    return;
  }

  // Validar que no haya equipos repetidos
  if (new Set(realOrder).size !== 4) {
    showToast('No puede haber equipos repetidos en los puestos.', 'error');
    return;
  }

  const existing = getStoredGroupResults()[grupo];
  const podium   = ['1º', '2º', '3º', '4º'];
  const preview  = document.getElementById('modal-match-preview');

  preview.innerHTML = `
    <strong>Grupo ${grupo}</strong><br>
    ${realOrder.map((t, i) => `${podium[i]}: ${flag(t)} ${t}`).join(' · ')}
    ${existing ? '<br><em style="color:var(--warning);font-size:12px">⚠️ Este grupo ya fue cerrado. Se recalcularán los puntos.</em>' : ''}
  `;

  pendingGrupo     = grupo;
  pendingRealOrder = realOrder;

  // Reuse the same confirm modal with adapted text
  document.querySelector('#confirm-modal h3').textContent    = '¿Cerrar clasificación del grupo?';
  document.querySelector('#confirm-modal p:first-of-type').innerHTML =
    `Esto repartirá puntos del <strong>Grupo ${grupo}</strong> a todos los participantes.`;

  document.getElementById('confirm-modal').classList.remove('hidden');
}

/* ═══════════════════════════════════════════════════════════
   INTERFAZ: TABLA DE RESULTADOS
   ═══════════════════════════════════════════════════════════ */

/**
 * Renderiza la tabla de puntos repartidos tras procesar un partido.
 * @param {string} matchId  - ID del partido procesado
 * @param {object} result   - Resultado real { golesLocal, golesVisitante, firstScorer, realSign }
 * @param {Array}  rowData  - Array devuelto por processMatch()
 */
function renderResultsTable(matchId, result, rowData) {
  const match    = allMatchesSorted.find(m => m.id === matchId);
  const card     = document.getElementById('results-card');
  const summary  = document.getElementById('results-summary');

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
            <th>G. Local</th>
            <th>G. Visit.</th>
            <th>Goleador</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${rowData.map(row => {
            const p = row.pred;
            const b = row.breakdown;
            const predSign  = p.sign || '—';
            const predLocal = p.golesLocal  != null ? p.golesLocal  : '—';
            const predVis   = p.golesVisitante != null ? p.golesVisitante : '—';
            const predScore = `${predLocal}–${predVis}`;
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
                <td><span class="${b.sign    ? 'check-icon' : 'cross-icon'}">${b.sign    ? '✅' : '❌'} +${b.sign}</span></td>
                <td><span class="${b.golesLocal     ? 'check-icon' : 'cross-icon'}">${b.golesLocal     ? '✅' : '❌'} +${b.golesLocal}</span></td>
                <td><span class="${b.golesVisitante ? 'check-icon' : 'cross-icon'}">${b.golesVisitante ? '✅' : '❌'} +${b.golesVisitante}</span></td>
                <td><span class="${b.firstScorer    ? 'check-icon' : 'cross-icon'}">${b.firstScorer    ? '✅' : '❌'} +${b.firstScorer}</span></td>
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
   INTERFAZ: HISTORIAL
   ═══════════════════════════════════════════════════════════ */

/**
 * Renderiza la sección de historial con todos los partidos finalizados.
 * Cada item es un acordeón que muestra el desglose de puntos por jugador.
 */
function renderHistory() {
  const container = document.getElementById('history-list');
  const results   = getStoredResults();
  const ids       = Object.keys(results);

  if (ids.length === 0) {
    container.innerHTML = `
      <div class="empty-history">
        <div class="empty-icon">📭</div>
        <p>Aún no hay partidos finalizados.</p>
      </div>
    `;
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
    const r     = results[matchId];
    const match = allMatchesSorted.find(m => m.id === matchId);
    if (!match) return '';

    const scorer = r.firstScorer ? `⚡ ${r.firstScorer}` : 'Sin goles';

    // Tabla interna con los puntos de cada jugador
    const innerRows = PLAYERS.map(player => {
      let preds = {};
      try { preds = JSON.parse(localStorage.getItem(`kiniela_predictions_${player}`) || '{}'); } catch {}
      const pred = preds[matchId] || {};
      const b    = pred.points || { sign: 0, golesLocal: 0, golesVisitante: 0, firstScorer: 0, total: 0 };
      return `
        <tr>
          <td>
            <div class="player-cell">
              <div class="player-av" style="background:${playerColor(player)};width:22px;height:22px;font-size:10px">${getInitial(player)}</div>
              <span>${player}</span>
            </div>
          </td>
          <td style="text-align:center">${b.sign    ? '✅' : '❌'}</td>
          <td style="text-align:center">${b.golesLocal     ? '✅' : '❌'}</td>
          <td style="text-align:center">${b.golesVisitante ? '✅' : '❌'}</td>
          <td style="text-align:center">${b.firstScorer    ? '✅' : '❌'}</td>
          <td style="text-align:right;font-weight:700;color:var(--accent)">${b.total} pts</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="history-item" id="hist-${matchId}">
        <div class="history-item-header" onclick="toggleHistoryItem('${matchId}')">
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
                <th style="text-align:center">G.L.</th>
                <th style="text-align:center">G.V.</th>
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

/**
 * Abre o cierra un elemento del historial (acordeón).
 */
function toggleHistoryItem(id) {
  const item = document.getElementById(id) || document.getElementById(`hist-${id}`);
  if (item) item.classList.toggle('open');
}

/* ═══════════════════════════════════════════════════════════
   MODAL DE CONFIRMACIÓN
   ═══════════════════════════════════════════════════════════ */

/**
 * Muestra el modal de confirmación antes de procesar.
 * Guarda los datos pendientes en variables de módulo.
 */
function showConfirmModal(matchId, result) {
  const match    = allMatchesSorted.find(m => m.id === matchId);
  const existing = getStoredResults()[matchId];

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
  pendingMatchId = null;
  pendingResult  = null;
}

/**
 * Ejecutado al confirmar en el modal: procesa partido o grupo según el contexto.
 */
function confirmProcess() {
  hideConfirmModal();

  try {
    // ¿Es un grupo pendiente o un partido?
    if (pendingGrupo && pendingRealOrder) {
      const grupo   = pendingGrupo;
      const rowData = processGroup(grupo, pendingRealOrder);
      renderGroupResultsTable(grupo, pendingRealOrder, rowData);
      populateGroupSelect();
      renderGroupHistory();
      showToast(`¡Grupo ${grupo} cerrado y puntos repartidos!`, 'success');
    } else if (pendingMatchId && pendingResult) {
      const rowData = processMatch(pendingMatchId, pendingResult);
      renderResultsTable(pendingMatchId, { ...pendingResult, realSign: calcRealSign(pendingResult.golesLocal, pendingResult.golesVisitante) }, rowData);
      populateMatchSelect();
      renderHistory();
      showToast('¡Puntos repartidos correctamente!', 'success');
    }
  } catch (err) {
    console.error('Error al procesar:', err);
    showToast('Error al procesar. Revisa la consola.', 'error');
  } finally {
    pendingMatchId   = null;
    pendingResult    = null;
    pendingGrupo     = null;
    pendingRealOrder = null;
    // Restaurar texto original del modal
    document.querySelector('#confirm-modal h3').textContent    = '¿Confirmar acción?';
    document.querySelector('#confirm-modal p:first-of-type').innerHTML =
      'Esto repartirá puntos a todos los participantes y marcará el partido como <strong>Finalizado</strong>.';
  }
}

/* ═══════════════════════════════════════════════════════════
   TOAST DE NOTIFICACIÓN
   ═══════════════════════════════════════════════════════════ */

let toastTimer = null;

function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = `toast ${type}`;
  // Forzar reflow para reiniciar la transición si ya había un toast
  void el.offsetWidth;
  el.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 3500);
}

/* ═══════════════════════════════════════════════════════════
   HANDLER DEL BOTÓN PRINCIPAL
   ═══════════════════════════════════════════════════════════ */

/**
 * Recoge los valores del formulario, valida, y abre el modal de confirmación.
 */
function handleProcessClick() {
  const matchId       = document.getElementById('match-select').value;
  const golesLocalStr = document.getElementById('goals-local').value;
  const golesVisStr   = document.getElementById('goals-visitor').value;
  const firstScorer   = document.getElementById('first-scorer').value;

  // Validaciones básicas
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

  // Si firstScorer está relleno pero goles son 0-0, advertir (pero no bloquear)
  if (golesLocal === 0 && golesVisitante === 0 && firstScorer !== '') {
    showToast('Aviso: marcas 0-0 pero hay goleador seleccionado. Revisa.', 'error');
    return;
  }

  const result = { golesLocal, golesVisitante, firstScorer };
  showConfirmModal(matchId, result);
}

/* ═══════════════════════════════════════════════════════════
   INICIALIZACIÓN
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Verificar sesión al cargar
  checkSession();

  // Login
  document.getElementById('login-form').addEventListener('submit', handleLogin);

  // Logout
  document.getElementById('btn-logout').addEventListener('click', handleLogout);

  // Cambio de partido en el selector
  document.getElementById('match-select').addEventListener('change', handleMatchSelect);

  // Botón principal (partidos)
  document.getElementById('btn-process').addEventListener('click', handleProcessClick);

  // Selector de grupo y botón de grupos
  document.getElementById('group-select').addEventListener('change', handleGroupSelect);
  document.getElementById('btn-group-process').addEventListener('click', handleGroupProcessClick);

  // Tabs del admin
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab));
  });

  // Modal — botones
  document.getElementById('btn-modal-cancel').addEventListener('click', hideConfirmModal);
  document.getElementById('btn-modal-confirm').addEventListener('click', confirmProcess);

  // Cerrar modal al hacer clic en el overlay (fuera del box)
  document.getElementById('confirm-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('confirm-modal')) hideConfirmModal();
  });
});
