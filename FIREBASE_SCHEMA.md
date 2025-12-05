# Guía de Implementación en Firebase - ApañaUC

Este documento detalla no solo el esquema de datos, sino la **Estrategia de Implementación** para llevar el prototipo actual a producción utilizando Firebase.

---

## 🚀 Paso 1: Configuración del Proyecto

1.  Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2.  Habilita **Firestore Database** (modo producción).
3.  Habilita **Authentication** (Google Sign-In y Email/Password).
4.  (Opcional) Habilita **Storage** si planeas subir avatares reales o fotos en el chat.

---

## 💾 Paso 2: Esquema de Datos (Firestore)

A continuación, la estructura JSON que debes replicar.

### 1. Colección `users`
Almacena el perfil y la economía del estudiante.

```json
{
  "uid": "user_123",            // ID del Auth
  "email": "student@uc.cl",
  "displayName": "Alex Rivera",
  "photoURL": "https://...",
  "major": "Ingeniería Civil",  // Carrera
  "faculty": "ingenieria",      // CRÍTICO: Usado para calcular Bonos Interdisciplinarios
  
  // Economía (Ledger)
  "karmaBalance": 250,          // Saldo disponible
  "escrowedKarma": 50,          // Saldo bloqueado en solicitudes pendientes

  // Gamificación
  "level": 5,
  "currentXp": 850,
  "nextLevelXp": 1200,
  "streakDays": 4,
  "lastHelpDate": "2023-10-25T14:30:00Z",
  "totalHelps": 23,
  
  "badges": [ "badge_id_1", "badge_id_2" ] // Array de IDs de medallas desbloqueadas
}
```

### 2. Colección `requests`
**IMPORTANTE - Integración con Mapas:**
El campo `location` debe coincidir (fuzzy match) con los nombres provenientes de `uc-maps-seeds` (ej: "Biblioteca", "Casino", "Aulas A").

```json
{
  "id": "req_auto_id",
  "requesterId": "user_123",
  "requesterName": "Alex Rivera", // Desnormalizado para evitar lecturas extra
  "requesterAvatar": "...",
  "requesterMajor": "Ingeniería Civil",
  
  // Contenido
  "topic": "Cálculo II",
  "description": "Necesito ayuda con integrales triples",
  "tags": ["Matemáticas", "Cálculo"], // Tags generados por Gemini
  
  // Ubicación (Crucial para el Mapa)
  "location": "Biblioteca - Piso 3", // String libre, pero debe contener la palabra clave del edificio
  
  // Economía
  "offerDisplay": "50 Pts",
  "karmaValue": 50,
  
  // Estado
  "status": "PENDING", // PENDING -> MATCHED -> COMPLETED
  "helperId": null,    // Se llena cuando alguien acepta
  
  "createdAt": "timestamp",
  "expiresAt": "timestamp" // TTL sugerido: 2 horas
}
```

### 3. Colección `chats`
Vinculada 1:1 con `requests`. ID del documento = ID de la solicitud.

**Doc:** `chats/{requestId}`
```json
{
  "participants": ["user_requester", "user_helper"],
  "lastMessage": "Voy para allá",
  "updatedAt": "timestamp"
}
```

**Sub-colección:** `chats/{requestId}/messages`
```json
{
  "senderId": "user_helper",
  "text": "Voy para allá",
  "timestamp": "timestamp",
  "type": "text" // futuro: image, location
}
```

### 4. Colección `transactions` (Ledger)
Historial inmutable de movimientos de puntos.

```json
{
  "userId": "user_123",
  "amount": -50,
  "type": "ESCROW_LOCK", // EARN, SPEND, ESCROW_RELEASE, REFUND
  "referenceId": "req_auto_id", // ID de solicitud o item de tienda
  "timestamp": "timestamp"
}
```

### 5. Colección `knowledge_base` (Cerebro Colectivo)
Resultados generados por Gemini al finalizar una tutoría.

```json
{
  "requestId": "req_auto_id",
  "topic": "Cálculo II",
  "questionSummary": "¿Cómo resolver integrales triples en coordenadas esféricas?",
  "solutionSummary": "Se explicó el cambio de variable y el cálculo del jacobiano.",
  "tags": ["Cálculo", "Integrales"],
  "upvotes": 0
}
```

---

## 🛡️ Paso 3: Reglas de Seguridad (Firestore Rules)

Copia y pega esto en la pestaña "Rules" de Firestore.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function
    function isSignedIn() {
      return request.auth != null;
    }

    // USERS: Solo el dueño puede editar su perfil
    // EXCEPCIÓN: karmaBalance no debe ser editable por el cliente (usar Cloud Functions)
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId 
                   && request.resource.data.karmaBalance == resource.data.karmaBalance; // Protege el saldo
    }

    // REQUESTS: 
    // - Crear: Solo si tienes saldo (validación real en backend, aquí básica)
    // - Update: Solo participantes pueden cambiar estado
    match /requests/{requestId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (
        resource.data.requesterId == request.auth.uid || 
        resource.data.helperId == request.auth.uid ||
        resource.data.helperId == null // Permitir aceptar si no tiene helper
      );
    }

    // CHATS: Solo participantes leen/escriben
    match /chats/{chatId} {
      allow read, write: if isSignedIn() && request.auth.uid in resource.data.participants;
      
      match /messages/{messageId} {
        allow read, write: if isSignedIn(); // Simplificado, idealmente heredar validación padre
      }
    }
    
    // TRANSACTIONS: Solo lectura, escritura solo por Backend (Admin SDK)
    match /transactions/{txnId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if false; // Solo Cloud Functions
    }
  }
}
```

---

## ⚡ Paso 4: Lógica de Backend (Cloud Functions)

Para que el sistema sea seguro, ciertas acciones no deben ocurrir en el frontend (React), sino en el backend.

1.  **`createRequest`**:
    *   Verifica saldo real del usuario.
    *   Resta `karmaValue` de `karmaBalance`.
    *   Suma `karmaValue` a `escrowedKarma`.
    *   Crea el documento en `requests`.
    *   Crea registro en `transactions`.

2.  **`completeRequest`**:
    *   Recibe `requestId`.
    *   Libera el `escrowedKarma` del solicitante.
    *   Calcula bonos (Base + Interdisciplinario + IA).
    *   Suma el total al `karmaBalance` del Helper.
    *   Actualiza estadísticas de XP y Rachas.

---

## 🗺️ Paso 5: Consistencia de Mapas

Para que el "Fork" de datos funcione con Firebase:

1.  En tu frontend (`CreateRequestModal`), asegúrate de que el selector de ubicación (`<select>`) use valores estandarizados.
2.  Si usas los datos de `uc-maps-seeds`, intenta que los `value` del selector coincidan con los `names` de los edificios del JSON externo.
3.  **Estrategia Fuzzy:** Como los nombres pueden variar ("Biblioteca" vs "Biblioteca Central"), el componente `CampusMap.tsx` ya incluye una lógica de `includes()` (contiene) para emparejar los datos. Mantén los nombres simples en Firebase ("Biblioteca", "Casino", "Hall").
