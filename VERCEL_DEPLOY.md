# Guía de Despliegue en Vercel

## 📋 Pasos para Desplegar

### 1. Preparación Local

Asegúrate de que tu código esté listo:
```bash
# Verificar que el build funciona
npm run build

# Probar el build localmente
npm run preview
```

### 2. Subir a GitHub

Si aún no lo has hecho:
```bash
git add .
git commit -m "Preparado para Vercel"
git push
```

### 3. Desplegar en Vercel

#### Opción A: Desde el Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Click en "Add New Project"
4. Importa tu repositorio de GitHub
5. Vercel detectará automáticamente que es un proyecto Vite

#### Opción B: Desde la CLI

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Desplegar
vercel

# Para producción
vercel --prod
```

### 4. Configurar Variables de Entorno

**IMPORTANTE:** Debes configurar la variable de entorno en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Tu API Key de Google Gemini
   - **Environment:** Production, Preview, Development (marca todas)

### 5. Verificar el Despliegue

Después del despliegue:
- ✅ Verifica que la app carga correctamente
- ✅ Prueba el selector de día
- ✅ Verifica que los archivos de conocimiento se cargan desde `/knowledge-base/`
- ✅ Prueba enviar un mensaje al chat

## 🔧 Configuración de Vercel

El archivo `vercel.json` ya está configurado con:
- Build command: `npm run build`
- Output directory: `dist`
- Rewrites para SPA (Single Page Application)
- Headers para archivos markdown

## 📝 Variables de Entorno Necesarias

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `GEMINI_API_KEY` | API Key de Google Gemini | [Google AI Studio](https://ai.google.dev/) |

## 🐛 Solución de Problemas

### Error: "API Key not found"
- Verifica que agregaste `GEMINI_API_KEY` en las variables de entorno de Vercel
- Asegúrate de que está marcada para todos los ambientes (Production, Preview, Development)

### Error: "Cannot find module"
- Verifica que `npm install` se ejecutó correctamente
- Revisa que todas las dependencias están en `package.json`

### Los archivos markdown no cargan
- Verifica que los archivos están en `public/knowledge-base/`
- Revisa la consola del navegador para errores de fetch

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Vite en Vercel](https://vercel.com/guides/deploying-vite-with-vercel)

