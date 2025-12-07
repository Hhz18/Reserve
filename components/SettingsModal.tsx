
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile?: () => void;
  onEditProfile?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onViewProfile, onEditProfile }) => {
  const { language, setLanguage, t } = useAppContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('settings.title')}>
      <div className="space-y-6">
        {/* Profile Links */}
        <div className="space-y-3 pb-6 border-b-2 border-nb-black/10">
           <Button 
             variant="secondary" 
             className="w-full rounded-lg justify-start text-left"
             onClick={() => { onClose(); onViewProfile?.(); }}
           >
             👤 {t('settings.viewProfile')}
           </Button>
           <Button 
             variant="secondary" 
             className="w-full rounded-lg justify-start text-left"
             onClick={() => { onClose(); onEditProfile?.(); }}
           >
             ✏️ {t('settings.editProfile')}
           </Button>
        </div>

        <div>
          <label className="block font-bold mb-2 text-nb-black">{t('settings.language')}</label>
          <div className="flex flex-col gap-2">
            <label className={`flex items-center gap-3 p-3 border-2 border-nb-black rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${language === 'zh' ? 'bg-nb-bg' : 'bg-white'}`}>
              <input 
                type="radio" 
                name="language" 
                value="zh" 
                checked={language === 'zh'} 
                onChange={() => setLanguage('zh')}
                className="w-5 h-5 text-nb-black border-2 border-nb-black focus:ring-0"
              />
              <span className="font-bold text-nb-black">{t('settings.lang.zh')}</span>
            </label>
            
            <label className={`flex items-center gap-3 p-3 border-2 border-nb-black rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${language === 'en' ? 'bg-nb-bg' : 'bg-white'}`}>
              <input 
                type="radio" 
                name="language" 
                value="en" 
                checked={language === 'en'} 
                onChange={() => setLanguage('en')}
                className="w-5 h-5 text-nb-black border-2 border-nb-black focus:ring-0"
              />
              <span className="font-bold text-nb-black">{t('settings.lang.en')}</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t-2 border-nb-black/10">
          <Button onClick={onClose} themeColor="bg-nb-white">{t('settings.close')}</Button>
        </div>
      </div>
    </Modal>
  );
};
