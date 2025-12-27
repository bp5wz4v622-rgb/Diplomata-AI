import React, { useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { GeminiService } from '../services/geminiService';
import { PositionPaperData } from '../types';

const PositionPaperReview: React.FC = () => {
  const [data, setData] = useState<PositionPaperData>({
    topic: '',
    committee: '',
    delegation: '',
    delegateName: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<string | null>(null);

  const handleChange = (field: keyof PositionPaperData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleReview = async () => {
    if (!data.content || !data.topic) return;
    setLoading(true);
    try {
      const result = await GeminiService.reviewPositionPaper(data);
      setReview(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = data.content.split(/\s+/).filter(w => w.length > 0).length;
  const isCountValid = wordCount >= 500 && wordCount <= 800;

  return (
    <Layout title="Revisión de Documento de Posición" subtitle="Auditoría técnica y diplomática (500-800 palabras).">
      <div className="flex flex-col gap-8">
        {/* Input Section */}
        <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tópico</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 focus:bg-white transition-all"
                value={data.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Comisión</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 focus:bg-white transition-all"
                value={data.committee}
                onChange={(e) => handleChange('committee', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Delegación (País)</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 focus:bg-white transition-all"
                value={data.delegation}
                onChange={(e) => handleChange('delegation', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Delegado</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 focus:bg-white transition-all"
                value={data.delegateName}
                onChange={(e) => handleChange('delegateName', e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Contenido
                </label>
                <span className={`text-xs font-bold px-2 py-1 rounded ${isCountValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {wordCount} palabras {isCountValid ? '✓' : '(Req: 500-800)'}
                </span>
            </div>
            <textarea
              className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm leading-relaxed font-serif bg-gray-50 focus:bg-white transition-all"
              placeholder="Escribe o pega tu documento de posición aquí..."
              value={data.content}
              onChange={(e) => handleChange('content', e.target.value)}
            />
          </div>

          <button
            onClick={handleReview}
            disabled={loading || !data.content}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-blue-500/25 transition-all disabled:opacity-50 transform active:scale-[0.99]"
          >
            {loading ? 'Auditando...' : 'Auditar Documento'}
          </button>
        </div>

        {/* Result Section */}
        {(loading || review) && (
            <div className="bg-yellow-50 border border-yellow-100 p-6 md:p-8 rounded-xl shadow-sm">
                {loading ? <Spinner /> : (
                    <>
                        <h3 className="font-bold text-yellow-900 mb-4 text-lg border-b border-yellow-200 pb-3">Informe de Corrección</h3>
                        <div className="prose prose-yellow max-w-none whitespace-pre-wrap text-gray-800">
                        {review}
                        </div>
                    </>
                )}
            </div>
        )}
      </div>
    </Layout>
  );
};

export default PositionPaperReview;