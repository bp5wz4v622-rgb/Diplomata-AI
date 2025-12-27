import React, { useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { GeminiService } from '../services/geminiService';

const SpeechCorrection: React.FC = () => {
  const [speech, setSpeech] = useState('');
  const [loading, setLoading] = useState(false);
  const [correction, setCorrection] = useState<string | null>(null);

  const handleCorrection = async () => {
    if (!speech.trim()) return;
    setLoading(true);
    try {
      const result = await GeminiService.correctSpeech(speech);
      setCorrection(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Corrección de Discursos" subtitle="Análisis: Introducción (Mundial) -> Desarrollo (Nacional) -> Conclusión (Propuestas).">
      <div className="space-y-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Borrador del Discurso</label>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
            placeholder="Honorable mesa y delegados..."
            value={speech}
            onChange={(e) => setSpeech(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
             <button
              onClick={handleCorrection}
              disabled={loading || !speech}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-blue-500/30"
            >
              {loading ? 'Analizando...' : 'Corregir Estructura'}
            </button>
          </div>
        </div>

        {loading && <Spinner />}

        {correction && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                Análisis del Asesor
            </h3>
            <div className="prose prose-green max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
              {correction}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SpeechCorrection;