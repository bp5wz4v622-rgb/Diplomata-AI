import React, { useState, useEffect, useRef } from 'react';
import { FeatureId, NavItem } from './types';
import { Icons } from './constants';
import SmartSearch from './features/SmartSearch';
import Interpellation from './features/Interpellation';
import SpeechCorrection from './features/SpeechCorrection';
import TopicBreakdown from './features/TopicBreakdown';
import PositionPaperReview from './features/PositionPaperReview';
import SpeechGenerator from './features/SpeechGenerator';

const NAV_ITEMS: NavItem[] = [
  { id: FeatureId.SEARCH, label: 'Búsqueda Diplomática', icon: Icons.Search, description: '' },
  { id: FeatureId.SPEECH_GENERATOR, label: 'Generador de Discursos', icon: Icons.Pencil, description: '' },
  { id: FeatureId.INTERPELLATION, label: 'Interpelación', icon: Icons.Gavel, description: '' },
  { id: FeatureId.SPEECH_CORRECTION, label: 'Corrección de discursos', icon: Icons.Microphone, description: '' },
  { id: FeatureId.TOPIC_BREAKDOWN, label: 'Desglose de tópico', icon: Icons.List, description: '' },
  { id: FeatureId.POSITION_PAPER, label: 'Corrección de Documento de posición', icon: Icons.DocumentCheck, description: '' },
];

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureId>(FeatureId.SEARCH);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [footerInputValue, setFooterInputValue] = useState('');
  
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleFooterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (footerInputValue.trim()) {
      setSearchQuery(footerInputValue);
      setActiveFeature(FeatureId.SEARCH);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const renderFeature = () => {
    switch (activeFeature) {
      case FeatureId.SEARCH: 
        return <SmartSearch initialQuery={searchQuery} />;
      case FeatureId.SPEECH_GENERATOR:
        return <SpeechGenerator />;
      case FeatureId.INTERPELLATION: 
        return <Interpellation />;
      case FeatureId.SPEECH_CORRECTION: 
        return <SpeechCorrection />;
      case FeatureId.TOPIC_BREAKDOWN: 
        return <TopicBreakdown />;
      case FeatureId.POSITION_PAPER: 
        return <PositionPaperReview />;
      default: 
        return <SmartSearch initialQuery={searchQuery} />;
    }
  };

  return (
    <div className={`min-h-screen bg-white text-black pt-16 ${activeFeature === FeatureId.SEARCH ? 'pb-20' : 'pb-4'}`}>
      {/* 1. ENCABEZADO FIJO (TOP) */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-20 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo e Identificador */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveFeature(FeatureId.SEARCH)}>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            </div>
            <h1 className="text-xl font-black text-blue-600 tracking-wide truncate">
              To' Revuelto's IA
            </h1>
          </div>

          {/* Botón de Menú Redondo */}
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-3 rounded-full bg-blue-600 text-white shadow-xl transition-all duration-300 hover:bg-blue-700 active:scale-95 ${isMenuOpen ? 'rotate-90' : ''}`}
            aria-label="Abrir menú de opciones"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>
      </header>

      {/* Menú Desplegable */}
      <div
        ref={menuRef}
        className={`fixed top-16 right-4 z-30 w-72 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-top-right transform ${
          isMenuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="p-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveFeature(item.id);
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors flex items-center gap-3 ${
                activeFeature === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={activeFeature === item.id ? 'text-blue-600' : 'text-gray-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="max-w-3xl mx-auto p-4 min-h-[calc(100vh-9rem)]">
        {renderFeature()}
      </main>

      {/* 3. BARRA DE BÚSQUEDA FIJA (BOTTOM) - SOLO EN BÚSQUEDA */}
      {activeFeature === FeatureId.SEARCH && (
        <footer className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
          <div className="max-w-7xl mx-auto p-4">
            <form onSubmit={handleFooterSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={footerInputValue}
                onChange={(e) => setFooterInputValue(e.target.value)}
                placeholder="Escribe tu consulta aquí para investigar..."
                className="flex-grow p-3 pl-5 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-600 transition-colors text-black bg-gray-50 focus:bg-white shadow-inner placeholder-gray-400"
                aria-label="Campo de entrada de búsqueda"
              />
              <button
                type="submit"
                className="p-3 rounded-full bg-blue-600 text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 active:scale-95 flex-shrink-0"
                aria-label="Buscar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;