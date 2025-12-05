# ApañaUC 🎓🚀

**Eslogan:** "El apañe que necesitas, al toque."

## 📖 Descripción General
ApañaUC es una plataforma de **economía colaborativa académica** diseñada para estudiantes universitarios. No es solo una app de tutorías; es un ecosistema gamificado donde el conocimiento es la moneda de cambio.

La app conecta a estudiantes que necesitan ayuda inmediata ("requesters") con compañeros dispuestos a ayudar ("helpers") a cambio de **Karma Points**, los cuales pueden ser canjeados por beneficios reales (café, impresiones, entradas, etc.).

---

## 📱 Módulos y Funcionalidades

### 1. Radar (Feed Principal)
*   **Vista de Mapa:** Visualización geoespacial de solicitudes de ayuda en el campus (ej. Biblioteca, Cafetería).
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
*   **Arquitectura:** Single Page Application (SPA).
*   **Mock Data:** Actualmente utiliza datos simulados en memoria para demostración.

## 🛡 Moderación y Seguridad
*   Filtro de palabras clave para prevenir transacciones ilegales o contenido no académico.
*   Validación de saldo antes de publicar solicitudes.
