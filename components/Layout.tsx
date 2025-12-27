import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="animate-fade-in">
      <header className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif tracking-tight">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-3 text-sm md:text-base font-light leading-relaxed">{subtitle}</p>}
      </header>
      <div className="bg-white rounded-xl">
        {children}
      </div>
    </div>
  );
};

export default Layout;