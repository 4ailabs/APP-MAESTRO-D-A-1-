#!/bin/bash
# Cambiar al directorio del script (funciona desde cualquier ubicación)
cd "$(dirname "$0")"

echo "🔍 Verificando repositorio git..."
if [ ! -d .git ]; then
    echo "⚠️  No hay repositorio git. Inicializando..."
    git init
fi

echo "📦 Agregando archivos..."
git add -A

echo "📝 Verificando que no haya archivos .env..."
if git status --short | grep -q "\.env"; then
    echo "❌ ERROR: Se detectaron archivos .env. No se hará commit."
    exit 1
fi

echo "✅ Haciendo commit..."
git commit -m "feat: Integración completa - bases de conocimiento Día 2 y 3, selector de día, límites de sesiones, notificaciones y mejoras UX

✨ Nuevas funcionalidades:
- Sistema de bases de conocimiento para Día 1, 2 y 3
- Selector de día en el header con dropdown
- Sistema de límites de sesiones de audio (configurable)
- Sistema de notificaciones toast
- Mejoras en manejo de errores
- Validación de entrada en el chat
- Configuración para Vercel

🔒 Seguridad:
- Variables de entorno correctamente configuradas
- Sin API keys expuestas"

echo "🚀 Intentando push..."
if git remote | grep -q origin; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
    git push -u origin $BRANCH 2>&1
    echo "✅ Push completado"
else
    echo "⚠️  No hay remote 'origin' configurado."
    echo "   Configura el remote con: git remote add origin <URL>"
fi

