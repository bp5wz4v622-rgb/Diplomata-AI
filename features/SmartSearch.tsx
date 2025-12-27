import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { GeminiService } from '../services/geminiService';
import { SearchResult } from '../types';

interface SmartSearchProps {
  initialQuery: string;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ initialQuery }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [lastSearched, setLastSearched] = useState('');

  useEffect(() => {
    const performSearch = async () => {
      if (!initialQuery.trim() || initialQuery === lastSearched) return;
      
      setLoading(true);
      setResult(null);
      try {
        const data = await GeminiService.searchResources(initialQuery);
        setResult(data);
        setLastSearched(initialQuery);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [initialQuery]);

  return (
    <Layout title="Búsqueda Diplomática" subtitle="Encuentra fuentes oficiales .org, .gov y ONU ordenadas por fecha. Usa la barra inferior para comenzar.">
      
      {!initialQuery && !loading && (
         <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
           <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
             </svg>
           </div>
           <p className="text-gray-500 text-lg font-medium">Esperando consulta...</p>
           <p className="text-gray-400 text-sm mt-1">Escribe tu tema en la barra inferior</p>
         </div>
      )}

      {loading && <Spinner />}

      {result && (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="prose prose-blue max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
                {result.text}
            </div>
            
            {result.sources && result.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Fuentes Verificadas</h4>
                <ul className="space-y-3">
                    {result.sources.map((source, idx) => (
                    <li key={idx}>
                        <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
                        >
                        <div className="mt-1 w-2 h-2 bg-blue-400 rounded-full group-hover:bg-blue-600 flex-shrink-0"></div>
                        <div>
                            <p className="text-sm font-medium text-blue-700 group-hover:underline decoration-blue-300 underline-offset-2">{source.title || 'Fuente sin título'}</p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{source.uri}</p>
                        </div>
                        </a>
                    </li>
                    ))}
                </ul>
                </div>
            )}
            </div>
        </div>
      )}
    </Layout>
  );
};

export default SmartSearch;