// src/hooks/useOllama.js
// ============================================
// CUSTOM HOOK: useOllama
// Conecta con el modelo DeepSeek R1 local
// ============================================

import { useState } from 'react';

function useOllama() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (_prompt) => {
    setLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-r1:1.5b',
          prompt: _prompt,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Respuesta inválida de Ollama');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              setResponse((prev) => prev + parsed.response);
            }
          } catch (err) {
            console.warn('Error parseando línea JSON', err);
          }
        }
      }
    } catch (err) {
      console.error('Error en streaming:', err);
      setError(err.message || 'Error al conectar con Ollama');
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, response, error, loading };
}

export default useOllama;