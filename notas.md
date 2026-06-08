# 🏆 Prototipo Web: Kiniela Mundial

## 1. Visión General
**Kiniela Mundial** es una plataforma web interactiva diseñada para que los usuarios compitan entre sí pronosticando los resultados del Mundial de Fútbol. La plataforma combina la emoción del día a día (partido a partido) con una visión estratégica a medio plazo (clasificación de la fase de grupos).

---

## 2. Sistema de Puntuación y Mecánicas de Juego

El núcleo de la aplicación se basa en dos modalidades de pronóstico que suman puntos a una clasificación general de usuarios.

### 2.1. Pronósticos por Partido (Fase de Grupos)
Para cada partido del torneo, el usuario deberá rellenar una papeleta virtual. Cada acierto suma puntos independientes, permitiendo a los usuarios sumar puntos incluso si no aciertan el resultado exacto.

* **País ganador o Empate:** `1 punto` (Se debe acertar el signo del partido: 1, X, o 2).
* **Goles exactos del equipo Local (Equipo A):** `3 puntos`.
* **Goles exactos del equipo Visitante (Equipo B):** `3 puntos`.
* **Primer goleador del partido:** `2 puntos` (Seleccionable desde un menú desplegable con las plantillas de ambos equipos, o la opción "Ninguno/Sin goles").

> **Ejemplo Práctico:** > En el partido *España (Local) vs. Brasil (Visitante)*.  
> *Pronóstico del usuario:* Gana España, España 2 - 1 Brasil, Primer gol: Morata.  
> *Resultado real:* Gana España, España 2 - 0 Brasil, Primer gol: Morata.  
> *Puntos obtenidos:* 1 pt (Ganador acertado) + 3 pts (Goles España acertados) + 0 pts (Goles Brasil fallados) + 2 pts (Primer goleador acertado) = **6 puntos en total**.
> *(Máximo posible por partido: 9 puntos).*

### 2.2. Pronóstico de Clasificación Final de Grupos
Esta es una apuesta a largo plazo que evalúa la capacidad del usuario para predecir el rendimiento general de los equipos en la primera fase.

* **Dinámica:** El usuario debe ordenar del 1º al 4º puesto a los integrantes de cada grupo.
* **Puntuación:** `1 punto` por cada posición exacta acertada.
* **Puntos máximos:** 4 puntos por grupo.

---

## 3. Reglas de Cierre y Tiempos Límite (Deadlines)

Para garantizar la justicia y el correcto funcionamiento del juego, el sistema debe implementar bloqueos automáticos (lock-outs) estrictos.

### 3.1. Cierre de la Clasificación de Grupos
* **Fecha Límite:** Todos los pronósticos de la fase de grupos quedarán bloqueados permanentemente el **11 de junio de 2026 a las 21:00 (Hora Local)**.
* **Comportamiento UI:** A partir de esa hora exacta, los botones de "Guardar" de esta sección se desactivarán, y la vista pasará a modo "Solo lectura".

### 3.2. Cierre de Partidos Individuales
* **Límite de Tiempo:** Las quinielas de cada partido se cerrarán automáticamente **30 minutos antes del pitido inicial** programado oficialmente.
* **Comportamiento UI:** Cada tarjeta de partido mostrará una cuenta atrás dinámica (Ej: *"Cierra en 2h 15m"*). Al llegar a los 30 minutos previos, el formulario se bloquea y muestra un estado de *"Cerrado"*.

---

## 4. Arquitectura de Pantallas (UI/UX)

La plataforma debe ser _Mobile First_, ya que los usuarios entrarán principalmente desde sus teléfonos para hacer los pronósticos rápidos.

### 4.1. Pantalla de Inicio (Dashboard)
* **Resumen de Usuario:** Avatar, posición actual en el ranking global y puntos totales acumulados.
* **Próximos Partidos (Carrusel):** Tarjetas deslizables con los partidos de hoy y mañana, destacando los que están a punto de cerrar.
* **Alertas:** Avisos si faltan pronósticos por rellenar (Ej: *"⚠️ Tienes 3 partidos de hoy sin pronosticar"*).

### 4.2. Sección: Partidos (La Quiniela Diaria)
* Navegación por fechas (Calendario horizontal superior).
* **Tarjeta de Partido (Formulario):**
    * Banderas y nombres de los equipos.
    * Selector de ganador (Botones de radio o selección de escudo).
    * Campos numéricos (`+` y `-`) para los goles de cada equipo.
    * Buscador autocompletable para "Primer goleador".
    * Estado del partido: *Abierto, Cerrado, En Juego, Finalizado*.

### 4.3. Sección: Grupos (El Pronóstico Global)
* Lista de todos los grupos (A, B, C...).
* Interfaz de **Drag and Drop (Arrastrar y Soltar)** para que el usuario ordene visualmente a los equipos del 1º al 4º puesto.
* Banner superior fijo indicando la fecha de cierre: *"⏳ Tienes hasta el 11/06/2026 a las 21:00 para guardar tus grupos"*.

### 4.4. Sección: Ranking Global
* Tabla de clasificación en tiempo real de todos los participantes.
* Desglose de puntos al hacer clic en un usuario (para ver dónde ha ganado sus puntos y garantizar transparencia).

---

## 5. Requisitos Técnicos y Base de Datos (Backend)

* **Modelo de Datos:**
    * `Users`: ID, Nombre, Email, Puntos_Totales.
    * `Matches`: ID, Equipo_Local, Equipo_Visitante, Fecha_Hora_Inicio, Resultado_Local, Resultado_Visitante, Primer_Goleador, Estado.
    * `Match_Predictions`: User_ID, Match_ID, Pred_Ganador, Pred_Goles_L, Pred_Goles_V, Pred_Goleador.
    * `Group_Predictions`: User_ID, Group_ID, Pos_1, Pos_2, Pos_3, Pos_4.
* **Automatización (Cron Jobs):**
    * **Evaluador de Cierres:** Un script que se ejecute cada minuto revisando qué partidos empiezan en 30 minutos para cambiar su estado en la base de datos a `locked = true`.
    * **Calculador de Puntos:** Un script que se active al marcar un partido como "Finalizado" por el administrador, calculando y repartiendo los puntos (1, 3, 3, 2) a todos los usuarios correspondientes al instante.