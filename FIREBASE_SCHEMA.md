# Diseño de Base de Datos - ApañaUC (Firestore)

Este documento detalla la estructura NoSQL sugerida para implementar la lógica de ApañaUC en Firebase Firestore.

## Colecciones Principales

### 1. `users` (Colección)
Almacena el perfil, saldo y estadísticas del estudiante.

```json
{
  "uid": "string (Auth ID)",
  "email": "string",
  "displayName": "string",
  "photoURL": "string",
  "major": "string", // Carrera
  "faculty": "string", // Facultad (usado para cálculo de bonos)
  
  // Economía
  "karmaBalance": number,      // Saldo disponible para gastar
  "escrowedKarma": number,     // Saldo bloqueado en solicitudes activas

  // Gamificación
  "level": number,
  "currentXp": number,
  "nextLevelXp": number,
  "streakDays": number,
  "lastHelpDate": "timestamp", // Para calcular la racha
  "totalHelps": number,
  
  // Arrays
  "skills": ["string"],
  "interests": ["string"],
  "badges": [
    {
      "badgeId": "string",
      "unlockedAt": "timestamp"
    }
  ],
  
  "createdAt": "timestamp"
}
```

---

### 2. `requests` (Colección)
Solicitudes de ayuda publicadas en el mapa/feed.

```json
{
  "id": "auto-id",
  "requesterId": "string (Ref: users)",
  "requesterName": "string",
  "requesterAvatar": "string", // Desnormalizado para lectura rápida
  "requesterMajor": "string",
  
  // Detalles de la solicitud
  "topic": "string",
  "description": "string",
  "location": "string", // Ej: "Biblioteca - Piso 2"
  "coordinates": { "lat": number, "lng": number }, // Opcional para mapa real
  
  // Economía de la solicitud
  "offerDisplay": "string", // Ej: "50 Pts"
  "karmaValue": number,     // Valor numérico en garantía (Escrow)
  
  // Metadatos
  "tags": ["string"],       // Generados por Gemini
  "preferredMajor": "string",
  
  // Estado
  "status": "PENDING" | "MATCHED" | "COMPLETED" | "CANCELLED",
  "helperId": "string (Ref: users)" | null,
  
  "createdAt": "timestamp",
  "matchedAt": "timestamp" | null,
  "completedAt": "timestamp" | null
}
```

---

### 3. `chats` (Colección)
Mensajería en tiempo real. Se recomienda usar el ID de la `request` como el ID del documento de chat para vincularlos 1:1 fácilmente.

**Documento:** `chats/{requestId}`
```json
{
  "participants": ["requesterId", "helperId"],
  "lastMessage": "string",
  "lastMessageTimestamp": "timestamp",
  "isActive": boolean
}
```

**Sub-colección:** `chats/{requestId}/messages`
```json
{
  "id": "auto-id",
  "senderId": "string",
  "text": "string",
  "timestamp": "timestamp",
  "readBy": ["string"]
}
```

---

### 4. `transactions` (Colección)
Ledger (libro mayor) para auditoría de puntos Karma. Vital para integridad financiera.

```json
{
  "id": "auto-id",
  "userId": "string",        // Quién fue afectado
  "type": "EARN" | "SPEND" | "ESCROW_LOCK" | "ESCROW_RELEASE" | "REFUND",
  "amount": number,          // Positivo o negativo
  "relatedRequestId": "string" | null,
  "relatedItemId": "string" | null, // Si fue compra en tienda
  "description": "string",   // Ej: "Recompensa por tutoría Física I"
  "timestamp": "timestamp"
}
```

---

### 5. `knowledge_base` (Colección)
Almacena el conocimiento generado por la IA (Cerebro Colectivo) al finalizar chats.

```json
{
  "id": "auto-id",
  "requestId": "string",
  "topic": "string",
  "tags": ["string"],
  "questionSummary": "string", // Generado por Gemini
  "solutionSummary": "string", // Generado por Gemini
  "contributors": ["helperId", "requesterId"],
  "upvotes": number,
  "createdAt": "timestamp"
}
```

---

### 6. `shop_items` (Colección)
Catálogo de productos canjeables.

```json
{
  "id": "string", // Ej: "coffee_01"
  "name": "string",
  "description": "string",
  "cost": number,
  "stock": number,
  "icon": "string",
  "category": "food" | "supplies" | "entertainment"
}
```

---

## 🔒 Reglas de Seguridad (Firestore Rules - Concepto)

1.  **Users:** Un usuario solo puede editar su propio documento (`request.auth.uid == userId`), excepto `karmaBalance` que solo debe ser modificado por Cloud Functions (backend) para seguridad.
2.  **Requests:** 
    *   Cualquiera autenticado puede leer.
    *   Solo se puede crear si `user.karmaBalance >= karmaValue`.
    *   Solo el `requester` puede marcar como `COMPLETED`.
    *   Solo un usuario distinto al `requester` puede marcarse como `helper` (update `helperId`).
3.  **Chats:** Solo los `participants` pueden leer y escribir mensajes.
