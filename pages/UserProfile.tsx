import React, { useState } from 'react';
import { User } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { THEME_COLORS } from '../constants';
import { Button } from '../components/Button';
import { AvatarModal } from '../components/AvatarModal';
import { updateUser } from '../services/dataService';

interface UserProfileProps {
  user: User;
  onEdit: () => void;
  refreshUser?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit, refreshUser }) => {
  const { t, globalTheme } = useAppContext();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const themeClass = THEME_COLORS[globalTheme] || 'bg-nb-white';

  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return null;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleAvatarSave = async (newUrl: string) => {
     try {
         await updateUser(user.id, { avatar: newUrl });
         if (refreshUser) refreshUser();
     } catch (e) {
         console.error("Failed to update avatar", e);
     }
  };

  const age = calculateAge(user.birthDate);

  const Field = ({ label, value }: { label: string, value: string | undefined | null }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-dashed border-nb-black/20 last:border-0">
      <span className="font-bold text-nb-black w-32 shrink-0 text-sm">{label}:</span>
      <span className="font-mono text-nb-black/80 break-all text-sm">{value || t('profile.notSet')}</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className={`${themeClass} border-2 border-nb-black rounded-lg p-6 shadow-nb flex justify-between items-center transition-colors duration-300`}>
        <h2 className="text-3xl font-black text-nb-black tracking-tight">{t('profile.title')}</h2>
        <Button onClick={onEdit} themeColor="bg-nb-white" size="sm">{t('profile.edit')}</Button>
      </div>

      <div className="bg-nb-white border-2 border-nb-black shadow-nb rounded-lg p-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="flex flex-col items-center space-y-4">
            <button 
                onClick={() => setIsAvatarModalOpen(true)}
                className="w-32 h-32 rounded-full border-2 border-nb-black shadow-nb overflow-hidden bg-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer relative group"
                title="Change Avatar"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <span className="text-white font-bold text-xs">Edit</span>
              </div>
            </button>
            <div className="text-center">
                <div className="font-bold text-lg text-nb-black">{user.name}</div>
                <div className="text-xs font-mono text-gray-500">{user.email}</div>
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <Field label={t('profile.username')} value={user.name} />
            <Field label={t('profile.email')} value={user.email} />
            <Field label={t('profile.password')} value={user.password ? '••••••••' : undefined} />
            <Field label={t('profile.address')} value={user.address} />
            <Field 
                label={t('profile.birthDate')} 
                value={user.birthDate ? `${user.birthDate}  (${age} ${t('common.yearsOld')})` : undefined} 
            />
            <Field 
                label={t('profile.gender')} 
                value={user.gender ? t(`profile.gender.${user.gender}`) : undefined} 
            />
          </div>
        </div>
      </div>

      <AvatarModal 
        isOpen={isAvatarModalOpen} 
        onClose={() => setIsAvatarModalOpen(false)} 
        currentAvatar={user.avatar}
        onSave={handleAvatarSave}
      />
    </div>
  );
};