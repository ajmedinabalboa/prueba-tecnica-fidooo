# 🎨 Frontend - Chat con ChatGPT

Frontend desarrollado en **Next.js 14** con **TypeScript** y **Material-UI** que proporciona una interfaz de chat en tiempo real con autenticación Firebase y integración con ChatGPT.

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Lenguaje de programación
- **Material-UI (MUI)** - Biblioteca de componentes
- **Firebase SDK** - Autenticación y Firestore
- **Zustand** - Gestión de estado
- **React Hooks** - Lógica de componentes

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                       # App Router de Next.js
│   │   ├── page.tsx               # Página de login
│   │   ├── chat/
│   │   │   └── page.tsx           # Página de chat
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/                # Componentes React
│   │   ├── auth/
│   │   │   ├── AuthForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── chat/
│   │   │   ├── ChatBox.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── TypingIndicator.tsx
│   │   └── ui/
│   │       └── LoadingSpinner.tsx
│   ├── hooks/                     # Custom Hooks
│   │   ├── useAuthGuard.ts
│   │   └── useChatService.ts
│   ├── lib/                       # Configuraciones
│   │   ├── firebase.ts
│   │   └── theme.ts
│   ├── services/                  # Servicios API
│   │   ├── chatService.ts
│   │   └── types.ts
│   ├── store/                     # Gestión de estado
│   │   ├── authStore.ts
│   │   └── chatStore.ts
│   └── types/                     # Definiciones TypeScript
│       └── chat.ts
├── .env.local                     # Variables de entorno
├── package.json
└── README.md
```

## ⚙️ Configuración

### 1. **Clonar el repositorio**
```bash
cd d:\prueba-tecnica-fidooo\frontend
```

### 2. **Instalar dependencias**
```bash
npm install
```

### 3. **Configurar variables de entorno**
Crear archivo `.env.local` en la raíz del proyecto:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. **Configurar Firebase**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Configuración del proyecto → Configuración general
4. Agrega una app web y copia las credenciales

### 5. **Configurar reglas de Firestore**
En Firebase Console → Firestore Database → Reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Ejecución

### **Desarrollo**
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000)

### **Producción**
```bash
npm run build
npm start
```

### **Logs esperados al iniciar:**
```
✅ Firebase inicializado correctamente
👂 [FIRESTORE] Configurando listener de mensajes...
📨 [FIRESTORE] Nuevos mensajes recibidos: 0
💬 [FIRESTORE] Mensajes procesados: 0
```

## 🎯 Funcionalidades

### **✅ Autenticación**
- Registro de usuarios con email/contraseña
- Inicio de sesión
- Cierre de sesión
- Protección de rutas
- Persistencia de sesión

### **✅ Chat en Tiempo Real**
- Envío y recepción de mensajes
- Sincronización automática con Firestore
- Orden cronológico de mensajes
- Indicador de usuarios conectados
- Scroll automático al último mensaje

### **✅ Integración ChatGPT**
- Respuestas automáticas de ChatGPT
- Indicador de "escribiendo"
- Manejo de errores de API
- Fallbacks en caso de fallo

### **✅ Interfaz de Usuario**
- Diseño responsive con Material-UI
- Burbujas de chat diferenciadas
- Avatares por tipo de usuario
- Animaciones suaves
- Loading states

## 🎨 Componentes Principales

### **AuthForm.tsx**
Formulario de autenticación con registro e inicio de sesión.

### **ChatBox.tsx**
Componente principal del chat que maneja:
- Conexión a Firestore
- Envío de mensajes
- Integración con ChatGPT
- Estados de carga y errores

### **MessageBubble.tsx**
Renderiza las burbujas de mensajes con:
- Colores diferenciados por usuario
- Timestamps
- Avatares
- Animaciones

### **MessageInput.tsx**
Input para escribir mensajes con:
- Validación
- Estados de carga
- Envío con Enter

## 🔄 Gestión de Estado

### **authStore.ts (Zustand)**
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}
```

### **chatStore.ts (Zustand)**
```typescript
interface ChatState {
  messages: Message[];
  isTyping: boolean;
  connectedUsers: number;
  setMessages: (messages: Message[]) => void;
  setIsTyping: (typing: boolean) => void;
  setConnectedUsers: (count: number) => void;
}
```

## 🌐 Servicios API

### **chatService.ts**
Servicio para comunicación con el backend:

```typescript
class ChatService {
  async sendMessage(text: string): Promise<ChatGPTResponse>;
  async healthCheck(): Promise<HealthCheckResponse>;
}
```

### **Tipos de datos:**
```typescript
interface ChatGPTResponse {
  text: string;
  timestamp: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

## 🔐 Autenticación y Rutas

### **Rutas protegidas:**
- `/chat` - Requiere autenticación
- `/` - Página pública de login

### **ProtectedRoute.tsx**
HOC que protege rutas verificando autenticación:
- Redirige a `/` si no está autenticado
- Redirige a `/chat` si ya está autenticado

## 🧪 Testing

### **Probar autenticación:**
1. Ir a `http://localhost:3000`
2. Registrar un nuevo usuario
3. Verificar redirección automática a `/chat`

### **Probar chat:**
1. Enviar mensaje: "Hola ChatGPT"
2. Verificar que aparece inmediatamente
3. Esperar respuesta automática de ChatGPT
4. Verificar sincronización en tiempo real

### **Probar múltiples usuarios:**
1. Abrir ventana normal e incógnito
2. Registrar usuarios diferentes
3. Enviar mensajes desde ambas ventanas
4. Verificar que ambas ven todos los mensajes

## 📱 Responsive Design

El frontend está optimizado para:
- **Desktop:** Experiencia completa de chat
- **Tablet:** Layout adaptado
- **Mobile:** Interfaz táctil optimizada

### **Breakpoints:**
- `xs`: 0px-600px (móvil)
- `sm`: 600px-960px (tablet)
- `md`: 960px+ (desktop)

## 🎨 Theming

### **Colores principales:**
- **Primary:** #1976d2 (azul)
- **Secondary:** #dc004e (rosa)
- **Usuario actual:** Primary
- **ChatGPT:** Secondary light
- **Sistema:** Warning light

### **Tipografía:**
- **Font:** Roboto
- **Mensajes:** body1 (0.95rem)
- **Nombres:** caption (weight 500)

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Verificar código con ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 📊 Performance

### **Optimizaciones implementadas:**
- **Code splitting** automático de Next.js
- **Lazy loading** de componentes
- **Memoización** con React.memo
- **Debounce** en inputs
- **Virtualization** para listas largas de mensajes


## 📝 Notas de Desarrollo

- Los componentes usan **TypeScript estricto**
- Los estados se manejan con **Zustand** para simplicidad
- Los estilos usan **sx prop** de Material-UI
- Los hooks personalizados encapsulan lógica compleja
- El routing usa **App Router** de Next.js 14

---

## 👨‍💻 Desarrollado por

Alvaro Javier Medina Balboa

**Stack:** Next.js 14 + TypeScript + Material-UI + Firebase + Zustand