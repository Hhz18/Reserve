import React from 'react';
import { User } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '../components/Button';

interface EditProfileProps {
  user: User;
  onCancel: () => void;
  onSave: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ user, onCancel, onSave }) => {
  const { t } = useAppContext();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
       <div className="bg-nb-white border-2 border-nb-black shadow-nb rounded-lg p-8">
         <h2 className="text-2xl font-black text-nb-black mb-8 border-b-2 border-nb-black/10 pb-4">
             {t('profile.edit.title')}
         </h2>

         <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block font-bold mb-2 text-nb-black text-sm">{t('profile.username')}</label>
                    <input 
                        type="text" 
                        defaultValue={user.name}
                        className="w-full border-2 border-nb-black p-3 rounded-lg focus:shadow-nb focus:outline-none bg-white text-nb-black"
                    />
                </div>
                
                <div>
                    <label className="block font-bold mb-2 text-nb-black text-sm">{t('profile.email')}</label>
                    <input 
                        type="email" 
                        defaultValue={user.email}
                        disabled
                        className="w-full border-2 border-nb-black p-3 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2 text-nb-black text-sm">{t('profile.password')}</label>
                    <input 
                        type="password" 
                        defaultValue={user.password}
                        className="w-full border-2 border-nb-black p-3 rounded-lg focus:shadow-nb focus:outline-none bg-white text-nb-black"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2 text-nb-black text-sm">{t('profile.address')}</label>
                    <input 
                        type="text" 
                        defaultValue={user.address}
                        className="w-full border-2 border-nb-black p-3 rounded-lg focus:shadow-nb focus:outline-none bg-white text-nb-black"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-2 text-nb-black text-sm">{t('profile.birthDate')}</label>
                        <input 
                            type="date" 
                            defaultValue={user.birthDate}
                            className="w-full border-2 border-nb-black p-3 rounded-lg focus:shadow-nb focus:outline-none bg-white text-nb-black"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-2 text-nb-black text-sm">{t('profile.gender')}</label>
                        <select 
                            defaultValue={user.gender || 'secret'}
                            className="w-full border-2 border-nb-black p-3 rounded-lg focus:shadow-nb focus:outline-none bg-white text-nb-black"
                        >
                            <option value="male">{t('profile.gender.male')}</option>
                            <option value="female">{t('profile.gender.female')}</option>
                            <option value="other">{t('profile.gender.other')}</option>
                            <option value="secret">{t('profile.gender.secret')}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t-2 border-nb-black/10">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    {t('profile.btn.cancel')}
                </Button>
                <Button type="submit" themeColor="bg-nb-lime">
                    {t('profile.btn.save')}
                </Button>
            </div>
         </form>
       </div>
    </div>
  );
};