
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useAppContext } from '../contexts/AppContext';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSave: (newAvatarUrl: string) => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, currentAvatar, onSave }) => {
  const { t } = useAppContext();
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || '');
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    if (isOpen) {
        setAvatarUrl(currentAvatar || '');
        setMode('view');
    }
  }, [isOpen, currentAvatar]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate Upload to Object Storage -> Get URL
      // In a real app: const url = await uploadService.upload(file);
      // Here: Convert to Base64 to simulate a hosted URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(avatarUrl);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? t('profile.avatar.modalTitle') : ''}>
       <div className="flex flex-col items-center gap-6">
          
          {/* Avatar Display */}
          <div className="relative w-64 h-64 rounded-full border-4 border-nb-black shadow-nb-lg overflow-hidden bg-white flex items-center justify-center group">
              {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                  <svg className="w-32 h-32 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
              )}
          </div>

          {/* Controls */}
          {mode === 'view' ? (
              <Button onClick={() => setMode('edit')} themeColor="bg-nb-sky" className="rounded-lg">
                  ✏️ {t('profile.edit')}
              </Button>
          ) : (
              <div className="w-full space-y-4">
                  <div>
                      <label className="block font-bold mb-2 text-nb-black">{t('profile.avatar.upload')}</label>
                      <label className="flex flex-col items-center px-4 py-6 bg-white text-nb-black rounded-lg shadow-nb border-2 border-nb-black tracking-wide uppercase border-dashed cursor-pointer hover:bg-gray-50">
                          <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                          </svg>
                          <span className="mt-2 text-sm leading-normal">Select a file</span>
                          <input type='file' className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                  </div>

                  <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t-2 border-nb-black/20"></div>
                      <span className="flex-shrink mx-4 text-nb-black font-mono text-sm">OR</span>
                      <div className="flex-grow border-t-2 border-nb-black/20"></div>
                  </div>

                  <div>
                      <label className="block font-bold mb-2 text-nb-black">{t('profile.avatar.link')}</label>
                      <input 
                          type="text" 
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder={t('profile.avatar.placeholder')}
                          className="w-full border-2 border-nb-black p-3 rounded-lg focus:shadow-nb focus:outline-none bg-white text-nb-black"
                      />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                      <Button variant="ghost" onClick={() => setMode('view')} className="rounded-lg">
                          {t('profile.btn.cancel')}
                      </Button>
                      <Button onClick={handleSave} themeColor="bg-nb-lime" className="rounded-lg">
                          {t('profile.avatar.save')}
                      </Button>
                  </div>
              </div>
          )}
       </div>
    </Modal>
  );
};
