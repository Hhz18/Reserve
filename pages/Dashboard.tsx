import React, { useMemo } from 'react';
import { User, ReviewItem } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { Heatmap } from '../components/Heatmap';
import { THEME_COLORS } from '../constants';

interface DashboardProps {
  user: User;
  items: ReviewItem[];
}

// Component for a styled Stat Card
const StatCard = ({ label, value, icon, colorClass, trend }: { label: string, value: number, icon: React.ReactNode, colorClass: string, trend?: string }) => (
    <div className={`relative overflow-hidden bg-nb-white p-5 border-2 border-nb-black rounded-xl shadow-nb group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
        {/* Background Decorative Blob */}
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${colorClass}`}></div>
        
        <div className="flex justify-between items-start mb-2 relative z-10">
            <div className={`p-2 rounded-lg border-2 border-nb-black ${colorClass} text-nb-inverse shadow-sm`}>
                {icon}
            </div>
            {trend && (
                 <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                    {trend} 📈
                 </span>
            )}
        </div>
        
        <div className="relative z-10">
             <span className="text-4xl font-black text-nb-black tracking-tight block">{value}</span>
             <span className="text-xs font-bold font-mono text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ user, items }) => {
  const { t, globalTheme } = useAppContext();
  
  const stats = useMemo(() => {
    const totalReviews = items.reduce((acc, item) => acc + item.reviewCount, 0);
    const mastered = items.filter(i => i.status === 'mastered').length;
    
    // Active Days
    const uniqueDays = new Set(
        items.filter(i => i.lastReviewedAt).map(i => new Date(i.lastReviewedAt!).toISOString().split('T')[0])
    );
    
    // Due Today
    const now = Date.now();
    const due = items.filter(i => i.status !== 'mastered' && i.nextReviewAt <= now).length;

    return { totalReviews, mastered, activeDays: uniqueDays.size, due };
  }, [items]);

  const themeClass = THEME_COLORS[globalTheme] || 'bg-nb-white';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
       {/* Welcome Banner with Texture */}
       <div className={`${themeClass} border-2 border-nb-black rounded-2xl p-8 shadow-nb transition-colors duration-300 relative overflow-hidden group`}>
          {/* Decorative Pattern overlay - Dot Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(0,0,0,0.3)_1px,transparent_0)] bg-[length:16px_16px]"></div>
          
          {/* Animated Noise Texture (Optional visual noise) */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" 
               style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-4xl md:text-6xl font-black text-nb-inverse tracking-tighter drop-shadow-sm mb-2">
                    {t('dash.welcome')} {user.name}
                </h1>
                <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-md px-4 py-2 rounded-lg border-2 border-black/5">
                    <span className="animate-pulse w-2 h-2 rounded-full bg-green-400 border border-black/20"></span>
                    <p className="font-mono text-nb-inverse font-bold text-xs md:text-sm tracking-wide uppercase">System Operational // Ready to Loop</p>
                </div>
            </div>
            
            {/* Quick action button or decorative element */}
            <div className="hidden md:block opacity-60 text-nb-inverse font-mono text-xs text-right">
                <div>ID: {user.id.slice(0, 8)}</div>
                <div>SESSION: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
       </div>

       {/* Enhanced Stats Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            value={stats.due} 
            label={t('dash.todayDue')} 
            colorClass="bg-nb-rose"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            trend={stats.due > 0 ? "Action Req" : undefined}
          />
          <StatCard 
            value={stats.mastered} 
            label={t('dash.itemsMastered')} 
            colorClass="bg-nb-lime"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            trend="+2 this week"
          />
          <StatCard 
            value={stats.totalReviews} 
            label={t('dash.totalReviews')} 
            colorClass="bg-nb-sky"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
          />
          <StatCard 
            value={stats.activeDays} 
            label={t('dash.activeDays')} 
            colorClass="bg-nb-amber"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
       </div>

       {/* Heatmap Section */}
       <div className="mt-8">
          <Heatmap items={items} />
       </div>
    </div>
  );
};