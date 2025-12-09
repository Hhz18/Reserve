import React, { useState, useEffect } from 'react';
import { User, System, ThemeColor } from './types';
import { login, register, getSystems, createSystem, deleteSystem, login as refreshLogin, getAllReviewItems } from './services/dataService';
import { Sidebar } from './components/Sidebar';
import { VocabSystem } from './pages/VocabSystem';
import { AlgoSystem } from './pages/AlgoSystem';
import { UserProfile } from './pages/UserProfile';
import { EditProfile } from './pages/EditProfile';
import { Dashboard } from './pages/Dashboard';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { SettingsModal } from './components/SettingsModal';
import { Logo } from './components/Logo';
import { CornerCube } from './components/CornerCube';
import { LoopConnections } from './components/LoopConnections'; 
import { Planet } from './components/Planet';
import { THEME_COLORS, ICONS, PALETTES } from './constants';
import { AppProvider, useAppContext } from './contexts/AppContext';

const DEFAULT_EMAIL = '2307567045@qq.com';
const DEFAULT_PASS = 'jfbkn681';

// Typewriter Component for the effect
const TypewriterText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50); // Speed
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="font-mono">
      {displayed}
      <span className="animate-pulse">_</span>
    </span>
  );
};

const AppContent: React.FC = () => {
  const { t, globalTheme } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systems, setSystems] = useState<System[]>([]);
  const [currentSystemId, setCurrentSystemId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'system' | 'profile' | 'edit-profile'>('dashboard');
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASS);
  const [authError, setAuthError] = useState('');
  
  // UI Interaction States
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCube, setActiveCube] = useState<string | null>(null);

  // Create System State
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newSystemName, setNewSystemName] = useState('');
  const [newSystemType, setNewSystemType] = useState<'vocab' | 'algo' | 'custom'>('custom');
  const [newSystemTheme, setNewSystemTheme] = useState<ThemeColor>('amber');

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialization & Auto-login
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Strategy: Try Login First. 
        // If it succeeds, the user exists. 
        // If it fails, try Register (auto-create the demo user).
        try {
          const u = await login(DEFAULT_EMAIL, DEFAULT_PASS);
          setUser(u);
          refreshSystems(u.id);
          setCurrentView('dashboard');
          setIsLoading(false);
          return;
        } catch (loginError) {
          // console.log("Auto-login failed, attempting registration...");
        }

        // Login failed, try to register
        try {
          const u = await register(DEFAULT_EMAIL, DEFAULT_PASS);
          setUser(u);
          refreshSystems(u.id);
          setCurrentView('dashboard');
        } catch (regError: any) {
          console.warn("Auto-registration failed:", regError.message);
          // If both fail, user remains null and sees login screen
        }
      } catch (err) {
        console.error("Critical Auth Init Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const refreshSystems = (userId: string) => {
    const sys = getSystems(userId);
    setSystems(sys);
  };

  const handleRefreshUser = async () => {
      if (user) {
        try {
            const u = await refreshLogin(user.email, user.password!); 
            setUser(u);
        } catch (e) {
            console.error("Failed to refresh user", e);
        }
      }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      // Simulate API Pulse/Computation
      await new Promise(r => setTimeout(r, 1200));

      let u: User;
      if (authMode === 'login') {
        u = await login(email, password);
      } else {
        u = await register(email, password);
      }
      setUser(u);
      refreshSystems(u.id);
      setCurrentView('dashboard');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSystem = () => {
    if (!user) return;
    const sys = createSystem({
      userId: user.id,
      name: newSystemName,
      type: newSystemType,
      theme: newSystemTheme,
      icon: ICONS[newSystemType] || 'star'
    });
    refreshSystems(user.id);
    setCurrentSystemId(sys.id);
    setCurrentView('system'); 
    setCreateModalOpen(false);
    setNewSystemName('');
  };

  const handleDeleteSystem = (id: string) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this system? All items within it will be lost.")) {
      deleteSystem(id);
      refreshSystems(user.id);
    }
  }

  const handleDeleteAccount = () => {
      if(window.confirm("WARNING: This will delete your account and all data permanently. Are you sure?")) {
          setUser(null);
          setSystems([]);
          setCurrentSystemId(null);
      }
  }

  const themeClass = THEME_COLORS[globalTheme];
  const palette = PALETTES[globalTheme] || PALETTES.amber;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nb-black text-white">
        <div className="flex flex-col items-center">
             <div className="animate-spin text-4xl mb-4 text-nb-theme">⏳</div>
             <div className="text-xl font-bold font-mono animate-pulse tracking-widest text-nb-theme">LOADING...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div 
        className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
        style={{
            background: `radial-gradient(ellipse at center, ${palette.dark} 0%, ${palette.appBg} 60%, #000000 100%)`
        }}
      >
        
        {/* Decorative Grid Overlay for Sci-Fi Feel */}
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>

        {/* Stars Generation - Base Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 150 }).map((_, i) => (
                <div 
                    key={i}
                    className="absolute bg-white rounded-full animate-twinkle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 2 + 0.5}px`,
                        height: `${Math.random() * 2 + 0.5}px`,
                        opacity: Math.random() * 0.7 + 0.2,
                        animationDuration: `${Math.random() * 3 + 2}s`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                />
            ))}
        </div>

        {/* Nebula Dust */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
                <div 
                    key={`dust-${i}`}
                    className="absolute rounded-full animate-drift blur-3xl mix-blend-screen"
                    style={{
                        background: i % 2 === 0 ? palette.light : palette.dark,
                        opacity: 0.15,
                        width: `${Math.random() * 400 + 200}px`,
                        height: `${Math.random() * 400 + 200}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 20 + 20}s`,
                        animationDelay: `${Math.random() * -10}s`
                    }}
                />
            ))}
        </div>

        {/* Dynamic Galaxies */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <Planet color1={palette.light} color2="#ffffff" size={200} top="10%" left="10%" orbitDuration="120s" />
             <Planet color1={palette.light} color2={palette.border} size={160} top="65%" left="75%" orbitDuration="90s" delay="2s" />
             <Planet color1="#ffffff" color2={palette.light} size={120} top="75%" left="15%" orbitDuration="80s" delay="5s" />
        </div>

        {/* Static Logo Top Left */}
        <div className="absolute top-8 left-8 z-30">
          <Logo />
        </div>

        {/* Main Card Container with Corner Cubes */}
        <div className="relative z-20 perspective-1000">
            
            {/* Backdrop for Active Cube Mode */}
            <div 
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-500 ${activeCube ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setActiveCube(null)}
            />

            {/* Connection Lines */}
            <div className={`transition-opacity duration-500 ${activeCube ? 'opacity-0' : 'opacity-100'}`}>
                <LoopConnections />
            </div>

            {/* Corner Cubes representing the Loop */}
            {/* INPUT: Highlights on Email Focus */}
            <CornerCube 
                label="INPUT" 
                position="top-left" 
                color="bg-nb-lime" 
                onClick={() => setActiveCube(activeCube === 'INPUT' ? null : 'INPUT')}
                isActive={activeCube === 'INPUT'}
                isDimmed={activeCube !== null && activeCube !== 'INPUT'}
                isHighlighted={focusedField === 'email'}
            />
            {/* SYSTEM: Highlights on Submit (Processing) */}
            <CornerCube 
                label="SYSTEM" 
                position="top-right" 
                color="bg-nb-sky" 
                onClick={() => setActiveCube(activeCube === 'SYSTEM' ? null : 'SYSTEM')}
                isActive={activeCube === 'SYSTEM'}
                isDimmed={activeCube !== null && activeCube !== 'SYSTEM'}
                isHighlighted={isSubmitting}
            />
            {/* OUTPUT: Could highlight on success (omitted for now to keep simple) */}
            <CornerCube 
                label="OUTPUT" 
                position="bottom-right" 
                color="bg-nb-rose" 
                onClick={() => setActiveCube(activeCube === 'OUTPUT' ? null : 'OUTPUT')}
                isActive={activeCube === 'OUTPUT'}
                isDimmed={activeCube !== null && activeCube !== 'OUTPUT'}
                isHighlighted={false} 
            />
            {/* REVIEW: Highlights on Password Focus (Simulating checking credentials) */}
            <CornerCube 
                label="REVIEW" 
                position="bottom-left" 
                color="bg-nb-amber" 
                onClick={() => setActiveCube(activeCube === 'REVIEW' ? null : 'REVIEW')}
                isActive={activeCube === 'REVIEW'}
                isDimmed={activeCube !== null && activeCube !== 'REVIEW'}
                isHighlighted={focusedField === 'password'}
            />

            {/* Login Card - Styled Dark with Hard Shadows & Tech Aesthetics */}
            <div className={`w-[380px] md:w-[450px] bg-nb-white border-4 border-nb-black shadow-nb-hard rounded-lg p-8 md:p-12 relative transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1 ${activeCube ? 'scale-90 opacity-0 blur-sm pointer-events-none' : 'opacity-100'}`}>
                
                {/* Tech Status Labels */}
                <div className="absolute top-2 left-3 text-[9px] font-mono text-nb-text opacity-40">[STATUS: ONLINE]</div>
                <div className="absolute top-2 right-3 text-[9px] font-mono text-nb-text opacity-40">[v2.4.0]</div>
                <div className="absolute bottom-2 right-3 text-[9px] font-mono text-nb-text opacity-40">[SECURE]</div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-nb-theme"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-nb-theme"></div>

                <h2 className="text-3xl font-black text-nb-text mb-2 text-center tracking-tighter uppercase mt-4">
                    {authMode === 'login' ? 'Welcome Back' : 'Join Loop'}
                </h2>
                <div className="text-nb-theme font-mono text-xs text-center mb-8 h-6">
                    <TypewriterText text={authMode === 'login' ? 'Optimization Protocol Initiated...' : 'Initialize New Agent Sequence...'} />
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div className="relative group">
                        <label className="block font-bold mb-1 text-nb-theme text-xs uppercase tracking-wider">{t('auth.email')}</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                className="w-full border-2 border-nb-black p-4 focus:outline-none focus:border-nb-theme focus:ring-1 focus:ring-nb-theme transition-all rounded-none bg-nb-bg text-nb-text font-mono text-sm placeholder-white/20"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="name@example.com"
                            />
                            {focusedField === 'email' && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-nb-theme rounded-full animate-ping"></div>}
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <label className="block font-bold mb-1 text-nb-theme text-xs uppercase tracking-wider">{t('auth.password')}</label>
                         <div className="relative">
                            <input 
                                type="password" 
                                className="w-full border-2 border-nb-black p-4 focus:outline-none focus:border-nb-theme focus:ring-1 focus:ring-nb-theme transition-all rounded-none bg-nb-bg text-nb-text font-mono text-sm placeholder-white/20"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="••••••••"
                            />
                            {focusedField === 'password' && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-nb-theme rounded-full animate-ping"></div>}
                        </div>
                    </div>
                    
                    {authError && <div className="p-3 bg-red-900/50 border-2 border-red-500 text-red-200 font-bold text-sm">{authError}</div>}
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-lg rounded-none relative overflow-hidden" themeColor={authMode === 'login' ? 'bg-nb-theme' : 'bg-nb-lime'}>
                        {isSubmitting ? (
                             <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin text-xl">⚙️</span> PROCESSING...
                             </span>
                        ) : (
                             authMode === 'login' ? t('auth.login') : t('auth.register')
                        )}
                        {/* Button Shine Effect */}
                        {!isSubmitting && <div className="absolute top-0 -left-full w-full h-full bg-white/20 -skew-x-12 group-hover:animate-shine transition-all duration-500"></div>}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t-2 border-dashed border-nb-black/30 text-center">
                    <button 
                        className="text-sm font-bold text-nb-text opacity-50 hover:opacity-100 hover:text-nb-theme hover:underline underline-offset-4 transition-all"
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    >
                        {authMode === 'login' ? t('auth.needAccount') : t('auth.haveAccount')}
                    </button>
                </div>
            </div>
        </div>

        {/* Abyss Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

      </div>
    );
  }

  const currentSystem = systems.find(s => s.id === currentSystemId);

  const renderMainContent = () => {
    if (currentView === 'dashboard') {
        const allItems = getAllReviewItems(user.id);
        return <Dashboard user={user} items={allItems} />;
    }
    if (currentView === 'profile') {
        return <UserProfile user={user} onEdit={() => setCurrentView('edit-profile')} refreshUser={handleRefreshUser} />;
    }
    if (currentView === 'edit-profile') {
        return <EditProfile user={user} onCancel={() => setCurrentView('profile')} onSave={() => setCurrentView('profile')} />;
    }
    
    // System View
    if (currentSystem?.type === 'vocab') return <VocabSystem system={currentSystem} />;
    if (currentSystem?.type === 'algo' || currentSystem?.type === 'custom') return <AlgoSystem system={currentSystem!} />;
    
    if (!currentSystem) return <div className="p-10 font-bold text-xl opacity-50 text-nb-black">{t('common.selectSystem')}</div>;
    return null;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        user={user}
        systems={systems}
        currentSystemId={currentView === 'system' ? currentSystemId : null}
        onSelectSystem={(id) => {
             setCurrentSystemId(id);
             setCurrentView('system');
        }}
        onCreateSystem={() => setCreateModalOpen(true)}
        onDeleteSystem={handleDeleteSystem}
        onLogout={() => { setUser(null); setCurrentSystemId(null); }}
        onDeleteAccount={handleDeleteAccount}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentView={currentView}
        onGoToDashboard={() => setCurrentView('dashboard')}
      />
      
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto bg-nb-bg h-full p-4 md:p-8">
        <div className="max-w-6xl mx-auto min-h-full">
           {renderMainContent()}
        </div>
      </main>

      <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title={t('sys.modal.title')}>
         <div className="space-y-4">
            <div>
              <label className="block font-bold mb-1 text-nb-black text-sm">{t('sys.form.name')}</label>
              <input 
                className="w-full border-2 border-nb-black p-2 focus:shadow-nb focus:outline-none rounded-lg bg-white text-nb-black"
                value={newSystemName}
                onChange={e => setNewSystemName(e.target.value)}
                placeholder={t('sys.form.placeholder')}
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-nb-black text-sm">{t('sys.form.type')}</label>
              <div className="flex gap-2">
                 {['vocab', 'algo', 'custom'].map(t => (
                   <button 
                    key={t}
                    type="button"
                    onClick={() => setNewSystemType(t as any)}
                    className={`px-4 py-2 border-2 border-nb-black font-bold text-sm rounded-lg ${newSystemType === t ? 'bg-nb-black text-white' : 'bg-white text-nb-black'}`}
                   >
                     {t.toUpperCase()}
                   </button>
                 ))}
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1 text-nb-black text-sm">{t('sys.form.theme')}</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(THEME_COLORS).map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewSystemTheme(color as ThemeColor)}
                    className={`w-6 h-6 rounded-full border-2 border-nb-black ${THEME_COLORS[color]} ${newSystemTheme === color ? 'ring-2 ring-offset-1 ring-black' : ''}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleCreateSystem} themeColor="bg-nb-lime">{t('sys.btn.create')}</Button>
            </div>
         </div>
      </Modal>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onViewProfile={() => setCurrentView('profile')}
        onEditProfile={() => setCurrentView('edit-profile')}
      />
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;