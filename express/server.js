// express/server.js
// ============================================
// SERVIDOR BÁSICO CON EXPRESS
// Parte 4: Hola Mundo
// ============================================

const express = require('express');
const app = express();
const PORT = 3000;

// Ruta principal que responde "Hola Mundo"
app.get('/', (req, res) => {
  res.send('Hola Mundo desde Express! 🚀');
});

// Ruta de prueba adicional (opcional)
app.get('/api/saludo', (req, res) => {
  res.json({
    mensaje: '¡Hola desde el backend de DevfSeek!',
    timestamp: new Date().toISOString(),
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});