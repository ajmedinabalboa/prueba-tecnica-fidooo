# 🚀 Backend - Chat con ChatGPT

Backend desarrollado en **NestJS** que proporciona autenticación con Firebase y integración con OpenAI ChatGPT para un sistema de chat en tiempo real.

## 🛠️ Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **Firebase Admin SDK** - Autenticación
- **OpenAI API** - Integración con ChatGPT
- **TypeScript** - Lenguaje de programación
- **Class Validator** - Validación de datos


## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── app.module.ts              # Módulo principal
│   ├── main.ts                    # Punto de entrada
│   ├── auth/                      # Módulo de autenticación
│   │   ├── auth.module.ts
│   │   ├── auth.guard.ts
│   │   └── firebase-auth.strategy.ts
│   ├── gpt/                       # Módulo de ChatGPT
│   │   ├── gpt.module.ts
│   │   ├── gpt.controller.ts
│   │   ├── gpt.service.ts
│   │   └── dto/
│   │       └── message.dto.ts
│   └── common/
│       └── decorators/
│           └── user.decorator.ts
├── .env                           # Variables de entorno
├── package.json
└── README.md
```

## ⚙️ Configuración

### 1. **Clonar el repositorio**
```bash
cd d:\prueba-tecnica-fidooo\backend
```

### 2. **Instalar dependencias**
```bash
npm install
```

### 3. **Configurar variables de entorno**
Crear archivo `.env` en la raíz del proyecto:

```env
# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com

# OpenAI
OPENAI_API_KEY=sk-proj-your_openai_api_key

# App Configuration
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

### 4. **Obtener credenciales de Firebase**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Configuración del proyecto → Cuentas de servicio
4. Generar nueva clave privada
5. Descargar el archivo JSON y extraer los valores

### 5. **Obtener API Key de OpenAI**
1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. API Keys → Create new secret key
3. Copia la clave que empieza con `sk-`

## 🚀 Ejecución

### **Desarrollo**
```bash
npm run start:dev
```

### **Producción**
```bash
npm run build
npm run start:prod
```

### **Logs esperados al iniciar:**
```
🚀 === INICIANDO APLICACIÓN ===
🔍 Verificando variables de entorno...
PORT: 3001
FIREBASE_PROJECT_ID: your_project_id
OPENAI_API_KEY: CONFIGURADO ✅
✅ CORS configurado
✅ Validación global configurada
🚀 Inicializando servicio ChatGPT...
🔑 API Key encontrada: sk-proj-9m...YjUA
✅ Cliente OpenAI inicializado correctamente
🎮 Controlador GPT inicializado
🎉 === APLICACIÓN INICIADA EXITOSAMENTE ===
🌍 Servidor corriendo en: http://localhost:3001/api
```

## 📡 Endpoints

### **POST /api/gpt/message**
Envía un mensaje a ChatGPT y retorna la respuesta.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Body:**
```json
{
  "text": "Hola ChatGPT, ¿cómo estás?"
}
```

**Response:**
```json
{
  "text": "¡Hola! Estoy muy bien, gracias por preguntar...",
  "timestamp": "2025-01-05T10:30:00.000Z",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 32,
    "total_tokens": 77
  }
}
```

## 🔐 Autenticación

El backend utiliza **Firebase Admin SDK** para validar tokens JWT enviados desde el frontend.

### **Flujo de autenticación:**
1. Frontend obtiene token con `firebase.auth().currentUser.getIdToken()`
2. Frontend envía token en header `Authorization: Bearer <token>`
3. Backend valida token con Firebase Admin
4. Si es válido, permite acceso a las rutas protegidas

## 🛡️ Seguridad

- **Validación de datos:** Usando class-validator
- **CORS configurado** para el frontend específico
- **Tokens JWT verificados** en cada request

## 🔧 Scripts Disponibles

```bash
npm run start          # Iniciar en modo producción
npm run start:dev      # Iniciar en modo desarrollo
npm run start:debug    # Iniciar con debugger
npm run build          # Compilar TypeScript
npm run test           # Ejecutar tests
npm run test:watch     # Tests en modo watch
npm run lint           # Verificar código con ESLint
```

## 📝 Notas de Desarrollo

- Los logs están configurados para development
- El rate limiting se puede ajustar en `gpt.controller.ts`
- Las reglas de validación están en `message.dto.ts`
- Los errores de OpenAI incluyen fallbacks automáticos

---

## 👨‍💻 Desarrollado por

Alvaro Javier Medina Balboa

**Stack:** NestJS + Firebase Auth + OpenAI API