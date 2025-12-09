<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Maestro - Asistente de IA para Seminario de Inteligencia Energética

Asistente de inteligencia artificial especializado en el contenido completo del **Seminario Internacional de Inteligencia Energética**. Esta aplicación proporciona una experiencia interactiva para aprender y practicar técnicas de regulación emocional, procesamiento de memorias y transformación personal a lo largo de todo el seminario.

## 📋 Descripción

**Maestro** es una aplicación web interactiva que actúa como tutor personal de IA, diseñada para acompañar a los participantes del seminario en su proceso de aprendizaje completo. La aplicación incluye contenido estructurado para todos los días del seminario (Día 1, Día 2 y Día 3), ejercicios guiados, y una interfaz de chat y voz para interactuar con el asistente. El maestro se adapta automáticamente al día seleccionado, proporcionando respuestas contextualizadas y conocimiento especializado según el contenido del día.

## ✨ Características Principales

### 🎓 Contenido Completo del Seminario
Maestro cubre todo el contenido del Seminario Internacional de Inteligencia Energética:
- **Día 1**: Neurobiología de la Regulación, Ventana de Tolerancia, Técnicas de Regulación, Las 4 Palancas del Estado, Neuroplasticidad, Recursos Personales y Rituales de Consolidación
- **Día 2**: TRSB (Técnica de Reprocesamiento Somato-Cognitivo Bilateral), PONS (Procesamiento Ocular del Sistema Nervioso), Context Engineering y técnicas avanzadas de procesamiento
- **Día 3**: Contenido avanzado de integración, procesamiento profundo y consolidación del aprendizaje

### 💬 Interfaz de Chat
- Conversación natural con el asistente de IA
- Respuestas contextualizadas basadas en el día seleccionado
- Formato de texto enriquecido con markdown

### 🎤 Interfaz de Voz en Vivo
- Conversación por voz en tiempo real
- Reconocimiento de voz integrado
- Respuestas de audio del asistente

### 📚 Recursos de Aprendizaje
- **Temas**: Lista completa de temas con subtemas para cada día
- **Ejercicios Guiados**: Ejercicios prácticos con prompts predefinidos
- **Base de Conocimiento**: Documentación detallada cargada desde archivos Markdown

### 💾 Gestión de Conversaciones
- Guardar y recuperar conversaciones anteriores
- Historial de interacciones
- Organización por fecha y día

### ⚙️ Configuración Avanzada
- Límites de sesión configurables
- Advertencias de límite de uso
- Tema claro/oscuro
- Almacenamiento local persistente

## 🚀 Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Clave API de Google Gemini** ([obtener aquí](https://makersuite.google.com/app/apikey))

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/4ailabs/APP-MAESTRO-D-A-1-.git
   cd APP-MAESTRO-D-A-1-
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env.local` en la raíz del proyecto:
   ```env
   VITE_GEMINI_API_KEY=tu_clave_api_aqui
   ```

4. **Ejecutar la aplicación en modo desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

## 🏛️ Estructura del Proyecto

```
maestro-día-1/
├── components/          # Componentes React
│   ├── ChatInterface.tsx
│   ├── LiveVoiceInterface.tsx
│   ├── DayOverview.tsx
│   ├── TopicList.tsx
│   ├── ExerciseList.tsx
│   └── ...
├── services/            # Servicios de lógica de negocio
│   ├── geminiService.ts      # Integración con Gemini AI
│   ├── knowledgeBaseService.ts # Gestión de base de conocimiento
│   ├── sessionLimitService.ts # Control de límites de sesión
│   └── storageService.ts      # Almacenamiento local
├── hooks/              # Custom React Hooks
│   ├── useLiveSession.ts
│   └── useToast.ts
├── contexts/           # React Contexts
│   └── ThemeContext.tsx
├── utils/              # Utilidades
│   └── audioUtils.ts
├── knowledge-base/     # Archivos Markdown de conocimiento
│   ├── dia-2.md
│   └── dia-3.md
├── constants.ts        # Constantes y configuración
├── types.ts            # Definiciones de tipos TypeScript
└── App.tsx             # Componente principal
```

## 🛠️ Tecnologías Utilizadas

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Google Gemini AI** - Motor de IA conversacional
- **Lucide React** - Iconos
- **LocalStorage API** - Persistencia de datos

## 📖 Uso

### Seleccionar un Día del Seminario
Usa el selector de día en la parte superior para cambiar entre Día 1, Día 2 y Día 3. **Maestro** ajustará automáticamente su conocimiento y respuestas según el día seleccionado, proporcionando información especializada y contextualizada para cada fase del seminario.

### Explorar Temas
Navega por la lista de temas para ver los subtemas disponibles. Puedes hacer clic en cualquier tema para iniciar una conversación sobre él.

### Realizar Ejercicios
Accede a los ejercicios guiados desde el menú. Cada ejercicio tiene un prompt predefinido que te guiará paso a paso.

### Chat por Texto
Escribe tus preguntas en el chat y recibe respuestas contextualizadas del asistente.

### Chat por Voz
Activa la interfaz de voz para conversar con el asistente usando tu micrófono.

### Guardar Conversaciones
Tus conversaciones se guardan automáticamente. Puedes acceder a ellas desde el menú de conversaciones guardadas.

## 🔒 Configuración de Límites de Sesión

La aplicación incluye un sistema de límites de sesión para controlar el uso de la API. Puedes configurar:
- Número máximo de mensajes por sesión
- Duración máxima de sesión
- Advertencias personalizadas

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno `VITE_GEMINI_API_KEY` en el dashboard de Vercel
3. Despliega automáticamente en cada push

Ver [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) para más detalles.

### Build Manual

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/` y pueden ser servidos por cualquier servidor web estático.

## 📝 Notas Importantes

- La aplicación requiere una clave API de Gemini válida
- El contenido completo del seminario (Día 1, Día 2 y Día 3) está integrado en la aplicación
- El contenido de los días 2 y 3 se carga dinámicamente desde archivos Markdown en `knowledge-base/`
- Las conversaciones se almacenan localmente en el navegador
- La interfaz de voz requiere permisos de micrófono
- **Maestro** se adapta automáticamente al día seleccionado, proporcionando respuestas especializadas para cada fase del seminario

## 🔗 Enlaces

- **AI Studio**: [Ver en AI Studio](https://ai.studio/apps/drive/1ObhD7hobmSKy90g4ho8fB7GKzfsqgvHO)
- **Repositorio**: [GitHub](https://github.com/4ailabs/APP-MAESTRO-D-A-1-)

## 📄 Licencia

Este proyecto es privado y está destinado para uso en el contexto del Seminario Internacional de Inteligencia Energética.

## 👥 Contribuidores

Desarrollado por 4AI Labs para el Seminario Internacional de Inteligencia Energética.

---

**Nota**: Esta aplicación es un asistente educativo y no reemplaza la guía profesional. Siempre consulta con profesionales calificados para asuntos de salud mental y bienestar.
