# Estimación de Costos - Sesión de Audio en Vivo

**Modelo:** `gemini-2.5-flash-native-audio-preview-09-2025`  
**Duración:** 15 minutos  
**Fecha:** Enero 2025

---

## 📊 Análisis del Uso de Audio

### Configuración Actual

- **Input Audio (Usuario → Gemini):**
  - Sample Rate: 16,000 Hz (16 kHz)
  - Formato: PCM
  - Canal: Mono (1 canal)
  - Procesamiento: En tiempo real (chunks de 4096 muestras)

- **Output Audio (Gemini → Usuario):**
  - Sample Rate: 24,000 Hz (24 kHz)
  - Formato: PCM
  - Canal: Mono (1 canal)

### Volumen de Datos Estimado

Para una sesión de **15 minutos**:

**Input Audio (Usuario hablando):**
- Asumiendo que el usuario habla ~50% del tiempo (7.5 minutos)
- 7.5 minutos × 16,000 muestras/segundo = 7,200,000 muestras
- ≈ 14.4 MB de datos de audio (sin comprimir)

**Output Audio (Gemini respondiendo):**
- Asumiendo que Gemini responde ~50% del tiempo (7.5 minutos)
- 7.5 minutos × 24,000 muestras/segundo = 10,800,000 muestras
- ≈ 21.6 MB de datos de audio (sin comprimir)

---

## 💰 Estimación de Costos

### ⚠️ Nota Importante

El modelo `gemini-2.5-flash-native-audio-preview-09-2025` es un **modelo en preview/preview**, lo que significa:

1. **Puede tener precios diferentes** a los modelos estables
2. **Puede estar en período de prueba gratuita** o con precios promocionales
3. **Los precios pueden cambiar** cuando salga de preview

### Estimación Basada en Precios Típicos de Gemini API

#### Opción 1: Si se cobra por minuto de audio (más común)

**Precios estimados (basados en APIs similares):**
- **Input Audio:** $0.01 - $0.05 por minuto
- **Output Audio:** $0.01 - $0.05 por minuto
- **Procesamiento del modelo:** Incluido o $0.001 - $0.01 por minuto

**Cálculo para 15 minutos:**
```
Input:  7.5 min × $0.02/min = $0.15
Output: 7.5 min × $0.02/min = $0.15
Procesamiento: 15 min × $0.002/min = $0.03
─────────────────────────────────────────
TOTAL ESTIMADO: $0.33 - $1.50
```

#### Opción 2: Si se cobra por tokens (menos común para audio)

Si Gemini convierte audio a tokens:
- **Input:** ~1,000-2,000 tokens por minuto de audio
- **Output:** ~1,000-2,000 tokens por minuto de audio
- **Precio:** $0.075 - $0.15 por 1M tokens (Gemini Flash típico)

**Cálculo para 15 minutos:**
```
Input tokens:  7.5 min × 1,500 tokens/min = 11,250 tokens
Output tokens: 7.5 min × 1,500 tokens/min = 11,250 tokens
Total: 22,500 tokens = 0.0225M tokens

Costo: 0.0225M × $0.10/1M = $0.00225
─────────────────────────────────────────
TOTAL ESTIMADO: $0.002 - $0.01
```

#### Opción 3: Modelo Preview (Posiblemente Gratis o Muy Barato)

Si el modelo está en preview, podría ser:
- **Gratis** durante el período de preview
- **Muy barato** ($0.001 - $0.01 por sesión completa)
- **Con límites** (ej: 100 sesiones gratis al mes)

---

## 🎯 Estimación Final Recomendada

### Escenario Conservador (Alto)
**$0.50 - $2.00 por sesión de 15 minutos**

### Escenario Realista (Medio)
**$0.10 - $0.50 por sesión de 15 minutos**

### Escenario Optimista (Bajo - Preview)
**$0.00 - $0.10 por sesión de 15 minutos**

---

## 📈 Costos Mensuales Estimados

Basado en diferentes niveles de uso:

| Sesiones/Mes | Costo Mensual (Conservador) | Costo Mensual (Realista) | Costo Mensual (Optimista) |
|--------------|----------------------------|---------------------------|---------------------------|
| 10 sesiones  | $5.00 - $20.00            | $1.00 - $5.00            | $0.00 - $1.00            |
| 50 sesiones  | $25.00 - $100.00           | $5.00 - $25.00           | $0.00 - $5.00            |
| 100 sesiones | $50.00 - $200.00           | $10.00 - $50.00          | $0.00 - $10.00           |
| 200 sesiones | $100.00 - $400.00          | $20.00 - $100.00         | $0.00 - $20.00           |

---

## 🔍 Cómo Verificar el Costo Real

### 1. Revisar la Consola de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Navega a **APIs & Services** → **Dashboard**
3. Busca **Gemini API** o **Generative AI API**
4. Revisa el uso y facturación

### 2. Revisar la Documentación Oficial

- [Google AI Studio](https://ai.google.dev/)
- [Google Cloud Pricing](https://cloud.google.com/pricing)
- Documentación específica del modelo `gemini-2.5-flash-native-audio`

### 3. Monitorear el Uso en Tiempo Real

Agrega logging en tu aplicación para rastrear:
- Duración de cada sesión
- Cantidad de audio enviado/recibido
- Número de requests

```typescript
// Ejemplo de logging (agregar en useLiveSession.ts)
const sessionStartTime = Date.now();
const audioInputDuration = 0; // Acumular tiempo de input
const audioOutputDuration = 0; // Acumular tiempo de output

// Al finalizar la sesión:
const totalDuration = (Date.now() - sessionStartTime) / 1000 / 60; // minutos
console.log(`Sesión: ${totalDuration.toFixed(2)} minutos`);
```

---

## 💡 Recomendaciones para Optimizar Costos

### 1. Implementar Límites de Sesión
```typescript
const MAX_SESSION_DURATION = 30; // minutos
// Desconectar automáticamente después de X minutos
```

### 2. Detección de Silencio
- Pausar el envío de audio cuando no hay habla
- Reducir el volumen de datos enviados

### 3. Compresión de Audio
- Si la API lo permite, usar compresión
- Reducir sample rate si es posible sin perder calidad

### 4. Caché de Respuestas
- Guardar respuestas comunes
- Reutilizar para preguntas similares

### 5. Monitoreo y Alertas
- Configurar alertas cuando se alcance cierto umbral
- Implementar límites diarios/mensuales

---

## 📝 Notas Adicionales

1. **Facturación de Google Cloud:**
   - Los costos se facturan mensualmente
   - Puedes configurar límites de presupuesto
   - Recibirás alertas cuando se alcancen ciertos umbrales

2. **Período de Prueba:**
   - Google Cloud ofrece créditos gratuitos ($300) para nuevos usuarios
   - Puedes usar estos créditos para probar el servicio

3. **Modelo Preview:**
   - Los modelos en preview pueden tener:
     - Precios promocionales
     - Límites de uso
     - Cambios en precios cuando salgan de preview

4. **Factores que Afectan el Costo:**
   - Duración real de la conversación
   - Cantidad de interrupciones
   - Complejidad de las respuestas
   - Región geográfica (algunos servicios tienen precios regionales)

---

## 🔗 Recursos

- [Google AI Studio](https://ai.google.dev/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)

---

## ⚠️ Disclaimer

**Estas son estimaciones basadas en información general de APIs de audio y modelos de IA.** Los precios reales pueden variar significativamente dependiendo de:

- Precios específicos del modelo preview
- Promociones o descuentos activos
- Región geográfica
- Volumen de uso
- Cambios en la política de precios de Google

**Se recomienda encarecidamente verificar los precios actuales en la documentación oficial de Google Cloud o contactar con el soporte de Google Cloud para obtener información precisa sobre precios.**

---

**Última actualización:** Enero 2025

