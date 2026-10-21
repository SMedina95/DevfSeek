import { useForm } from "react-hook-form";

function App() {
    // Configuramos React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    // Función que se ejecuta al enviar el formulario (válido)
    const onSubmit = (data) => {
        console.log("Mensaje enviado:", data.mensaje);
        // Aquí irá la lógica para enviar el mensaje a la IA en la siguiente parte
        alert(`Mensaje: "${data.mensaje}" (Simulación, la IA se conectará en la Parte 2)`);
        reset(); // Limpiar el input
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <div className="w-full max-w-3xl">
                {/* Título */}
                <h1 className="text-4xl font-bold text-center mb-2 text-emerald-400">
                    DevfSeek
                </h1>
                <p className="text-center text-gray-400 mb-8">
                    Tu asistente de IA personal (Parte 1: Configuración y Formularios)
                </p>

                {/* Formulario */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700"
                >
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Escribe tu mensaje aquí..."
                                {...register("mensaje", {
                                    required: "El mensaje no puede estar vacío",
                                    minLength: {
                                        value: 3,
                                        message: "El mensaje debe tener al menos 3 caracteres",
                                    },
                                })}
                                className={`w-full p-3 rounded-lg bg-gray-700 border ${
                                    errors.mensaje ? "border-red-500" : "border-gray-600"
                                } text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500`}
                                autoComplete="off"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            Enviar
                        </button>
                    </div>

                    {/* Mostrar errores de validación */}
                    {errors.mensaje && (
                        <p className="text-red-400 text-sm mt-2">
                            ⚠️ {errors.mensaje.message}
                        </p>
                    )}
                </form>

                {/* Mensaje de éxito (opcional) */}
                {isSubmitting && (
                    <p className="text-emerald-400 text-center mt-4 animate-pulse">
                        Enviando mensaje...
                    </p>
                )}

                <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700 text-gray-400 text-sm">
                    <p className="mb-2 font-semibold text-gray-200">✅ Parte 1 completada:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Proyecto configurado con Vite y React.</li>
                        <li>Tailwind CSS integrado para los estilos.</li>
                        <li>React Hook Form configurado para validar el input.</li>
                        <li>Input básico creado y validado (mín. 3 caracteres).</li>
                        <li>¡Listo para la Parte 2 (Conexión con IA)!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;