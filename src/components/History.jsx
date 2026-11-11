// src/components/History.jsx
// ============================================
// COMPONENTE: History
// Muestra el historial de consultas previas
// ============================================

import { useChat } from '../context/ChatContext';

function History() {
  const { state, dispatch } = useChat();

  if (state.messages.length === 0) {
    return (
      <div className="text-gray-400 text-center p-4 text-sm">
        No hay consultas previas. ¡Empieza a chatear!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-emerald-400">Historial</h2>
        <button
          onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}
          className="text-red-400 hover:text-red-300 text-xs transition-colors"
          title="Limpiar historial"
        >
          🗑️ Limpiar
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {state.messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg text-sm ${
              msg.role === 'user'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-800 text-gray-200'
            }`}
          >
            <p className="text-xs text-gray-400 mb-1 font-semibold">
              {msg.role === 'user' ? '👤 Tú' : '🤖 DevfSeek'}
            </p>
            <p className="whitespace-pre-wrap break-words">
              {msg.content || '...'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;