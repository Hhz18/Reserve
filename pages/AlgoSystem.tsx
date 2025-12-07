
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReviewItem, System } from '../types';
import { getItems, createItem, updateItem, performReview } from '../services/dataService';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useAppContext } from '../contexts/AppContext';
import { THEME_COLORS } from '../constants';

interface AlgoSystemProps {
  system: System;
}

export const AlgoSystem: React.FC<AlgoSystemProps> = ({ system }) => {
  const { t, globalTheme } = useAppContext();
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReviewItem | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const loadItems = () => {
    setItems(getItems(system.id).sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadItems();
  }, [system.id]);

  const handleSave = () => {
    if (editingItem) {
      updateItem(editingItem.id, { title, content });
    } else {
      createItem({
        systemId: system.id,
        title,
        content,
        groupName: 'General'
      });
    }
    closeModal();
    loadItems();
  };

  const openModal = (item?: ReviewItem) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setContent(item.content);
    } else {
      setEditingItem(null);
      setTitle('');
      setContent('# My Solution\n\n```javascript\nconsole.log("Hello");\n```');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleReview = (id: string) => {
    performReview(id, true);
    loadItems();
  };

  const themeClass = THEME_COLORS[globalTheme] || 'bg-nb-white';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className={`${themeClass} border-2 border-nb-black rounded-lg p-6 shadow-nb flex justify-between items-center transition-colors duration-300`}>
        <h2 className="text-3xl font-black text-nb-inverse tracking-tight">{system.name}</h2>
        <Button onClick={() => openModal()} themeColor="bg-nb-lime" size="sm">{t('algo.newProblem')}</Button>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-nb-white border-2 border-nb-black shadow-nb p-4 hover:translate-x-0.5 transition-transform rounded-lg">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-lg font-bold text-nb-black">{item.title}</h3>
                   <div className="flex gap-2 text-[10px] font-mono mt-1">
                      <span className="bg-gray-100 px-1 border border-gray-300 rounded text-nb-black">{t('algo.reviews')}: {item.reviewCount}</span>
                      <span className="bg-gray-100 px-1 border border-gray-300 rounded text-nb-black">{t('algo.last')}: {item.lastReviewedAt ? new Date(item.lastReviewedAt).toLocaleDateString() : t('algo.never')}</span>
                   </div>
                </div>
                <div className="flex gap-2">
                   <Button size="sm" variant="ghost" onClick={() => openModal(item)}>{t('algo.editNotes')}</Button>
                   <Button size="sm" themeColor="bg-nb-sky" onClick={() => handleReview(item.id)}>{t('algo.markReviewed')}</Button>
                </div>
             </div>
             <div className="prose prose-sm max-h-24 overflow-hidden border-t border-dashed border-gray-300 pt-2 opacity-70 text-nb-black">
                <ReactMarkdown>{item.content}</ReactMarkdown>
             </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? t('algo.modal.editTitle') : t('algo.modal.newTitle')}>
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-1 text-nb-black text-sm">{t('algo.form.title')}</label>
            <input 
              className="w-full border-2 border-nb-black p-2 focus:shadow-nb focus:outline-none rounded-lg bg-white text-nb-black"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('algo.form.placeholder')}
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-nb-black text-sm">{t('algo.form.notes')}</label>
            <textarea 
              className="w-full h-64 border-2 border-nb-black p-2 font-mono text-sm focus:shadow-nb focus:outline-none rounded-lg bg-white text-nb-black"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} themeColor="bg-nb-lime">{t('algo.btn.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
