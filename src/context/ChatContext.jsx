// src/context/ChatContext.jsx
// ============================================
// CONTEXTO GLOBAL: ChatContext (Parte 3)
// Maneja historial, estado de carga y errores
// ============================================

import { createContext, useReducer, useContext, useState } from 'react';

const ChatContext = createContext();

const initialState = {
  messages: [],
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: Date.now(), role: 'user', content: action.payload },
        ],
      };
    case 'ADD_ASSISTANT_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: Date.now() + 1, role: 'assistant', content: action.payload || '' },
        ],
      };
    case 'UPDATE_LAST_ASSISTANT_MESSAGE':
      const updatedMessages = [...state.messages];
      const lastIndex = updatedMessages.length - 1;
      if (lastIndex >= 0 && updatedMessages[lastIndex].role === 'assistant') {
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          content: updatedMessages[lastIndex].content + action.payload,
        };
      }
      return { ...state, messages: updatedMessages };
    case 'CLEAR_HISTORY':
      return initialState;
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  
  // Estados globales de la IA (evitamos prop drilling)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función global para enviar un mensaje a Ollama
  const sendMessage = async (prompt) => {
    setLoading(true);
    setError(null);
    dispatch({ type: 'ADD_USER_MESSAGE', payload: prompt });
    dispatch({ type: 'ADD_ASSISTANT_MESSAGE', payload: '' });

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-r1:1.5b',
          prompt: prompt,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) throw new Error('Respuesta inválida de Ollama');

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
              // Actualizamos el último mensaje del asistente en tiempo real
              dispatch({ type: 'UPDATE_LAST_ASSISTANT_MESSAGE', payload: parsed.response });
            }
          } catch (err) {
            console.warn('Error parseando JSON', err);
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con Ollama');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ state, dispatch, loading, error, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat debe usarse dentro de un ChatProvider');
  return context;
}