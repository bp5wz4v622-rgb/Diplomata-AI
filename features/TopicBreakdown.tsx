import React, { useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { GeminiService } from '../services/geminiService';

const TopicBreakdown: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [breakdown, setBreakdown] = useState<string | null>(null);

  const handleBreakdown = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await GeminiService.breakdownTopic(topic);
      setBreakdown(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Desglose de Tópico" subtitle="Genera una guía de investigación estratégica para tu tema.">
      <div className="mb-10">
        <form onSubmit={handleBreakdown} className="flex gap-3 items-center bg-white p-2 rounded-full border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Crisis de refugiados en Europa..."
            className="flex-1 pl-5 py-3 rounded-full outline-none text-gray-700 bg-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {loading ? '...' : 'Desglosar'}
          </button>
        </form>
      </div>

      {loading && <Spinner />}

      {breakdown && (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Guía de Investigación</h3>
          </div>
          <div className="prose prose-blue max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
            {breakdown}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TopicBreakdown;