// src/context/ChatContext.jsx
// ============================================
// CONTEXTO GLOBAL: ChatContext
// Maneja el historial de mensajes con useReducer
// ============================================

import { createContext, useReducer, useContext } from 'react';

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
          {
            id: Date.now(),
            role: 'user',
            content: action.payload,
          },
        ],
      };

    case 'ADD_ASSISTANT_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: action.payload || '',
          },
        ],
      };

    case 'UPDATE_LAST_ASSISTANT_MESSAGE':
      const updatedMessages = [...state.messages];
      const lastIndex = updatedMessages.length - 1;
      if (lastIndex >= 0 && updatedMessages[lastIndex].role === 'assistant') {
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          content: action.payload,
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

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de un ChatProvider');
  }
  return context;
}