import React, { useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { GeminiService } from '../services/geminiService';

const SpeechGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [country, setCountry] = useState('');
  const [timeSeconds, setTimeSeconds] = useState<string>('60');
  const [loading, setLoading] = useState(false);
  const [generatedSpeech, setGeneratedSpeech] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() || !country.trim() || !timeSeconds) return;
    
    const seconds = parseInt(timeSeconds);
    if (isNaN(seconds) || seconds <= 10) {
        alert("Por favor ingresa un tiempo válido mayor a 10 segundos.");
        return;
    }

    setLoading(true);
    setGeneratedSpeech(null);
    try {
      const result = await GeminiService.generateSpeech(topic, country, seconds);
      setGeneratedSpeech(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Generador de Discursos" subtitle="Crea discursos estructurados ajustados a tu tiempo (-10 seg de seguridad).">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5 h-fit">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tópico / Tema</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 focus:bg-white transition-all"
                placeholder="Ej: Ciberseguridad en infraestructuras críticas"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delegación (País)</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 focus:bg-white transition-all"
                placeholder="Ej: República Dominicana"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tiempo Total (Segundos)</label>
              <div className="relative">
                <input
                    type="number"
                    min="20"
                    step="10"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 focus:bg-white transition-all"
                    value={timeSeconds}
                    onChange={(e) => setTimeSeconds(e.target.value)}
                />
                <div className="absolute right-3 top-3 text-gray-400 text-sm">segundos</div>
              </div>
              <p className="text-xs text-gray-400 mt-2">La IA generará un discurso para {parseInt(timeSeconds) - 10} segundos.</p>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading || !topic || !country}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 mt-4"
            >
                {loading ? 'Escribiendo discurso...' : 'Generar Discurso'}
            </button>
        </div>

        {/* Output Section */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 min-h-[400px] flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex justify-between">
                <span>Resultado</span>
                {generatedSpeech && <span className="text-blue-600">Listo para leer</span>}
            </h3>
            
            {loading && (
                <div className="flex-1 flex items-center justify-center">
                    <Spinner />
                </div>
            )}

            {!loading && !generatedSpeech && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 opacity-30">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <p>Ingresa los datos para generar tu discurso diplomático.</p>
                </div>
            )}

            {generatedSpeech && (
                <div className="flex-1 prose prose-blue max-w-none whitespace-pre-wrap text-gray-800 font-serif leading-loose text-lg bg-white p-6 rounded-lg border border-gray-100 shadow-sm overflow-y-auto max-h-[600px]">
                    {generatedSpeech}
                </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default SpeechGenerator;