import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePath }) => {
  return (
    <div className="flex h-screen bg-[#fcfbf7] overflow-hidden font-sans">
      <Sidebar activePath={activePath} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};