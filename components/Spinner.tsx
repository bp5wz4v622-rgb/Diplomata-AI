import React from 'react';

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-900"></div>
    <span className="ml-3 text-slate-600 font-medium">Procesando solicitud diplomática...</span>
  </div>
);

export default Spinner;