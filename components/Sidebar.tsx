
import React, { useState } from 'react';
import { System, User } from '../types';
import { THEME_COLORS } from '../constants';
import { Button } from './Button';
import { useAppContext } from '../contexts/AppContext';
import { ThemeSwitcher } from './ThemeSwitcher';

interface SidebarProps {
  user: User;
  systems: System[];
  currentSystemId: string | null;
  onSelectSystem: (id: string) => void;
  onCreateSystem: () => void;
  onDeleteSystem: (id: string) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onOpenSettings: () => void;
  currentView: string;
  onGoToDashboard: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  systems, 
  currentSystemId, 
  onSelectSystem, 
  onCreateSystem,
  onDeleteSystem,
  onLogout,
  onDeleteAccount,
  onOpenSettings,
  currentView,
  onGoToDashboard
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, globalTheme } = useAppContext();

  // Header is now dark (nb-white) to let the Accent-colored Theme Switcher pop.
  // We use the theme color for the mobile toggle and the bottom border of the header.
  const themeBorder = `border-${globalTheme}-500`; // Dynamically using tailwind class might be risky if not safelisted, but we use css vars generally.
  // Actually let's use the border-nb-theme class via THEME_COLORS style if possible, or just border-nb-theme (which is accent).
  
  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-40 flex items-center gap-2">
        <Button size="sm" onClick={() => setIsOpen(!isOpen)} themeColor={THEME_COLORS[globalTheme]}>
          {isOpen ? '✕' : '☰'}
        </Button>
      </div>

      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-nb-white border-r-2 border-nb-black transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col rounded-r-lg md:rounded-r-none
      `}>
        {/* Header - Now Dark Background to contrast with buttons */}
        <div className={`p-6 border-b-4 border-nb-black bg-nb-white transition-colors duration-300 relative`} style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex justify-between items-center mb-6">
             <ThemeSwitcher />
             <button 
               onClick={onOpenSettings} 
               className="p-2 rounded-lg bg-nb-bg border-2 border-nb-black hover:bg-black/20 transition-colors shadow-nb-sm active:translate-y-0.5 active:shadow-none"
               title={t('nav.settings')}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <circle cx="12" cy="12" r="3"></circle>
                 <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
               </svg>
             </button>
          </div>

          {/* User Profile Summary */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-nb-black bg-nb-bg mb-3 overflow-hidden flex items-center justify-center shadow-nb">
                {user.avatar ? (
                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                    <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
            </div>
            
            <h2 className="text-xl font-black font-sans text-nb-text mb-1 px-2 rounded">
              {user.name || 'Asig'}
            </h2>
            
            <div className="flex gap-2 mt-3 w-full">
                <Button variant="danger" size="sm" className="flex-1 font-bold text-xs" onClick={onLogout}>
                    {t('nav.logout')}
                </Button>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Dashboard Link */}
          <button
             onClick={() => {
                 onGoToDashboard();
                 setIsOpen(false);
             }}
             className={`
                w-full text-left px-4 py-3 font-bold border-2 border-nb-black shadow-nb-sm transition-all rounded-lg
                hover:-translate-y-1 hover:translate-x-1 hover:shadow-nb 
                ${currentView === 'dashboard' ? `${THEME_COLORS[globalTheme] || 'bg-nb-white'} shadow-nb text-nb-inverse` : 'bg-nb-white text-nb-text'}
             `}
          >
             🏠 {t('nav.dashboard')}
          </button>

          <div className="space-y-2 pt-2 border-t-2 border-nb-black/10">
            <h3 className="font-mono text-xs font-bold text-gray-500 uppercase px-2">{t('nav.systems')}</h3>
            {systems.map(sys => {
               const isActive = sys.id === currentSystemId && currentView === 'system';
               const btnClass = isActive 
                  ? `${THEME_COLORS[globalTheme]} shadow-nb text-nb-inverse` 
                  : 'bg-nb-white text-nb-text';
                  
               return (
                 <div key={sys.id} className="relative group">
                  <button
                    onClick={() => {
                      onSelectSystem(sys.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 font-bold border-2 border-nb-black shadow-nb-sm transition-all rounded-lg
                      hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-nb pr-10 text-sm
                      ${btnClass}
                    `}
                  >
                    <span className="mr-2">{sys.type === 'vocab' ? '📖' : sys.type === 'algo' ? '💻' : '⚡'}</span>
                    <span className="truncate">{sys.name}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSystem(sys.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-opacity"
                    title="Delete System"
                  >
                    🗑
                  </button>
                 </div>
               )
            })}
          </div>

          <Button 
            onClick={onCreateSystem} 
            className="w-full border-dashed border-2 hover:border-solid rounded-lg text-sm"
            variant="secondary"
          >
            {t('nav.newSystem')}
          </Button>
        </nav>
      </div>
    </>
  );
};
