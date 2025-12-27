import React, { useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { GeminiService } from '../services/geminiService';

const Interpellation: React.FC = () => {
  const [speech, setSpeech] = useState('');
  const [loading, setLoading] = useState(false);
  const [critique, setCritique] = useState<string | null>(null);

  // Estados para la respuesta del delegado
  const [reply, setReply] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Estado para sugerencia de IA
  const [suggestingDefense, setSuggestingDefense] = useState(false);

  const handleInterpellation = async () => {
    if (!speech.trim()) return;
    setLoading(true);
    setCritique(null);
    setFeedback(null);
    setReply('');
    try {
      const result = await GeminiService.interpellateSpeech(speech);
      setCritique(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestDefense = async () => {
    if (!critique || !speech) return;
    setSuggestingDefense(true);
    try {
      const defenseSuggestion = await GeminiService.generateInterpellationDefense(speech, critique);
      setReply(defenseSuggestion); // Rellena el cuadro de texto con la sugerencia
    } catch (error) {
      console.error(error);
    } finally {
      setSuggestingDefense(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!reply.trim() || !critique || !speech) return;
    setReplyLoading(true);
    try {
        const result = await GeminiService.evaluateInterpellationReply(speech, critique, reply);
        setFeedback(result);
    } catch (error) {
        console.error(error);
    } finally {
        setReplyLoading(false);
    }
  };

  return (
    <Layout title="Sala de Interpelación" subtitle="Pon a prueba tu discurso ante un delegado hostil.">
      <div className="grid grid-cols-1 gap-8">
        {/* Paso 1: Input del Discurso */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tu Discurso Inicial</label>
          <textarea
            className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-y text-sm text-gray-800 bg-gray-50 focus:bg-white transition-colors"
            placeholder="Pega aquí tu discurso para recibir una interpelación..."
            value={speech}
            onChange={(e) => setSpeech(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button
                onClick={handleInterpellation}
                disabled={loading || !speech}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-blue-500/30"
            >
                {loading ? 'Analizando...' : 'Generar Interpelación'}
            </button>
          </div>
        </div>

        {loading && <Spinner />}

        {/* Paso 2: La Pregunta de To' Revuelto */}
        {critique && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 md:p-8 relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <h3 className="text-lg font-serif font-bold text-red-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                    Interpelación de To' Revuelto
                </h3>
                <div className="prose prose-red max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed mb-6">
                    {critique}
                </div>

                {/* Paso 3: Input de Respuesta del Delegado */}
                <div className="mt-6 pt-6 border-t border-red-200">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-red-900">Tu Respuesta / Defensa</label>
                        <button 
                            onClick={handleSuggestDefense}
                            disabled={suggestingDefense}
                            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-sm"
                        >
                            {suggestingDefense ? (
                                <span className="animate-pulse">Pensando...</span>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                    Sugerir Respuesta con IA
                                </>
                            )}
                        </button>
                    </div>
                    <textarea
                        className="w-full min-h-[100px] p-4 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-y text-sm text-gray-800 bg-white"
                        placeholder="Escribe tu defensa o usa el botón de sugerencia..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleReplySubmit}
                            disabled={replyLoading || !reply}
                            className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-all disabled:opacity-50 shadow-md"
                        >
                            {replyLoading ? 'Evaluando...' : 'Responder a la Mesa'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Paso 4: Feedback de la Mesa */}
        {replyLoading && <Spinner />}
        
        {feedback && (
            <div className="bg-gray-800 text-white border border-gray-700 rounded-xl p-6 md:p-8 relative overflow-hidden animate-fade-in shadow-xl">
                <h3 className="text-lg font-serif font-bold text-gray-200 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                    Veredicto de la Mesa
                </h3>
                <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                    {feedback}
                </div>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default Interpellation;