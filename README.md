# ApañaUC 🎓🚀

**Eslogan:** "El apañe que necesitas, al toque."

---

## 🦈 El Pitch (La Visión)

> **"La universidad tiene un problema de logística invisible: Hay miles de cerebros brillantes, pero están desconectados. Tenemos una oferta de ayuda masiva y una demanda de ayuda masiva, pero no hacen 'match' en tiempo real."**

Nosotros somos **Apaña!**, una plataforma de economía colaborativa on-demand que resuelve esto con tres innovaciones que nadie más tiene:

1.  ⚡ **Inmediatez:** Reducimos el tiempo de ayuda de 3 días (correo a profesor) a **5 minutos** (peer-to-peer).
2.  🤝 **Romper Silos:** Nuestro algoritmo paga un **bono extra** si un Ingeniero cruza el campus para ayudar a un Humanista.
3.  ☕ **Economía Circular:** Transformamos capital intelectual en bienestar físico. **Tu conocimiento paga tu almuerzo.**

### 📍 El "Waze" del Conocimiento
Hemos creado una app que funciona como un **Waze del conocimiento dentro del campus**. Conectamos al que tiene la duda con el que tiene la respuesta en menos de 5 minutos, y recompensamos esa ayuda con café real en el casino.

**"Porque nadie debería reprobar por vergüenza a preguntar."**

---

## 📖 Descripción Técnica General
ApañaUC es un ecosistema gamificado donde el conocimiento es la moneda de cambio. La app conecta a estudiantes que necesitan ayuda inmediata ("requesters") con compañeros dispuestos a ayudar ("helpers") a cambio de **Karma Points**, los cuales pueden ser canjeados por beneficios reales.

---

## 🗺️ Integración de Mapas Vivos (Nuevo)
El sistema utiliza una arquitectura híbrida para el **Radar del Campus**:

1.  **Geometría Vectorial (Local):** SVG optimizados para renderizado rápido de las zonas del campus (San Joaquín).
2.  **Metadatos Externos (API):** Conexión en tiempo real con el repositorio [uc-maps-seeds](https://github.com/almapp/uc-maps-seeds) para obtener nombres oficiales, coordenadas precisas y metadatos de los edificios.
3.  **Fusión de Datos (Hot Zones):** El frontend cruza la información de:
    *   *Geometría* (¿Dónde dibujo el edificio?)
    *   *Datos Externos* (¿Cómo se llama realmente el edificio?)
    *   *Firebase* (¿Cuántas solicitudes hay ahí?)
    
    Esto permite generar mapas de calor ("Hot Zones") dinámicos que vibran y cambian de color según la demanda académica en tiempo real.

---

## 📱 Módulos y Funcionalidades

### 1. Radar (Feed Principal)
*   **Vista de Mapa:** Visualización geoespacial de solicitudes de ayuda.
    *   *Sincronización:* Se conecta a `almapp.github.io` para validar ubicaciones.
    *   *Hot Zones:* Indicadores visuales (fuego) cuando hay mucha demanda en una zona.
*   **Vista de Lista:** Tarjetas detalladas de las solicitudes con filtros por etiquetas y ubicación.
*   **Filtros Inteligentes:** Filtrado por ubicación específica o etiquetas académicas.

### 2. Sistema de Solicitudes (Economy Core)
*   **Creación con IA:** Al escribir una solicitud, **Gemini AI** analiza el texto para asignar etiquetas académicas automáticas.
*   **Modelo de Escrow (Garantía):**
    *   Al publicar, el usuario selecciona una recompensa (ej. 50 Pts).
    *   Estos puntos se **descuentan inmediatamente** de su saldo y quedan en "custodia" (Escrow) hasta que se completa la ayuda.
    *   Esto garantiza que el ayudante siempre recibirá su pago.

### 3. Match & Chat Activo
*   **Chat en Tiempo Real:** Comunicación directa entre estudiantes.
*   **Icebreakers IA:** Gemini sugiere frases para romper el hielo basadas en el tema.
*   **Cerebro Colectivo (RAG):** Al finalizar, la IA analiza el chat y extrae un resumen "Pregunta/Solución" para nutrir una base de conocimiento futura, otorgando bonos de XP extra.

### 4. Dashboard de Canje y Gamificación
*   **Perfil de Usuario:**
    *   **Nivel:** Basado en XP acumulada.
    *   **Racha (Streak):** Días consecutivos ayudando.
    *   **Medallas:** Logros desbloqueables (ej. "Primeros Pasos", "Salvavidas").
*   **Tienda (Marketplace):**
    *   Catálogo de recompensas reales.
    *   Validación de saldo disponible para canje.
*   **Historial:** Visualización de Karma ganado y gastado.

---

## 🎮 Lógica de Gamificación y Finanzas

### Calculadora de Recompensas
El pago final al ayudante se compone de:
1.  **Oferta Base:** Lo que el solicitante puso en garantía (ej. 50 Pts).
2.  **Bono Interdisciplinario:** El sistema inyecta puntos extra si la ayuda ocurre entre facultades diferentes (ej. Ingeniería ayuda a Arte) para romper burbujas sociales.
3.  **Bono IA:** Puntos extra por permitir que la IA documente la solución.

### Sistema de Niveles
*   **XP (Experiencia):** Se gana al completar ayudas y usar la app.
*   **Karma (Moneda):** Se gana ayudando, se gasta pidiendo ayuda o en la tienda.

---

## 🛠 Tech Stack
*   **Frontend:** React 19, Tailwind CSS, Lucide React.
*   **AI:** Google Gemini API (Multimodal: Texto, Tags, Resumen).
*   **Data:** Integration w/ almapp/uc-maps-seeds.
*   **Arquitectura:** Single Page Application (SPA).