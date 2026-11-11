// src/App.jsx
import { useForm } from 'react-hook-form';
import { ChatProvider, useChat } from './context/ChatContext';
import History from './components/History';

function ChatApp() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  // Consumimos el estado global directamente
  const { loading, error, sendMessage } = useChat();

  const onSubmit = async (data) => {
    await sendMessage(data.mensaje);
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gray-800 rounded-xl p-4 border border-gray-700">
          <History />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-center mb-2 text-emerald-400">
            DevfSeek
          </h1>
          <p className="text-center text-gray-400 mb-8 text-sm">
            Tu asistente de IA personal (Parte 3: useContext)
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Escribe tu mensaje aquí..."
                  {...register('mensaje', {
                    required: 'El mensaje no puede estar vacío',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                  })}
                  className={`w-full p-3 rounded-lg bg-gray-700 border ${
                    errors.mensaje ? 'border-red-500' : 'border-gray-600'
                  } text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500`}
                  autoComplete="off"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Pensando...' : 'Enviar'}
              </button>
            </div>

            {errors.mensaje && <p className="text-red-400 text-sm mt-2">⚠️ {errors.mensaje.message}</p>}
            {error && <p className="text-red-400 text-sm mt-2">⚠️ Error: {error}</p>}
          </form>

          {loading && <p className="text-emerald-400 text-center mt-4 animate-pulse text-sm">La IA está pensando...</p>}

          <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700 text-gray-400 text-sm">
            <p className="mb-2 font-semibold text-gray-200">✅ Parte 3 completada:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Contexto global expandido con <code>loading</code>, <code>error</code> y <code>sendMessage</code>.</li>
              <li>Uso de <code>useContext</code> para evitar <em>prop drilling</em>.</li>
              <li><code>App.jsx</code> simplificado.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
}

export default App;