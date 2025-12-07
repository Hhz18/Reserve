
import React, { useState, useEffect, useCallback } from 'react';
import { ReviewItem, System } from '../types';
import { getItems, performReview, batchCreateItems } from '../services/dataService';
import { translateWords } from '../services/geminiService';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useAppContext } from '../contexts/AppContext';
import { THEME_COLORS } from '../constants';
import { HexColorPicker } from "react-colorful"; 

interface VocabSystemProps {
  system: System;
}

export const VocabSystem: React.FC<VocabSystemProps> = ({ system }) => {
  const { t, globalTheme } = useAppContext();
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [filter, setFilter] = useState<'review' | 'all'>('review');
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importTextColor, setImportTextColor] = useState('#000000');
  
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const loadItems = useCallback(() => {
    const allItems = getItems(system.id);
    setItems(allItems.sort((a, b) => a.nextReviewAt - b.nextReviewAt));
  }, [system.id]);

  useEffect(() => {
    loadItems();
    setFlippedCards(new Set()); 
  }, [loadItems]);

  const handleFlip = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleCheck = useCallback(async (id: string, success: boolean) => {
    const updated = performReview(id, success);
    if (updated) {
       await new Promise(r => setTimeout(r, 600)); 
       loadItems();
    }
  }, [loadItems]);

  const handleImport = async () => {
    setIsProcessing(true);
    const lines = importText.split('\n');
    let currentGroup = 'Default';
    const newItemsPayload: { title: string, groupName: string }[] = [];
    const wordsToTranslate: string[] = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith('---')) continue;
      
      if (line.match(/^(Chapter|Unit|Section|第).+/i)) {
        currentGroup = line;
      } else {
        newItemsPayload.push({ title: line, groupName: currentGroup });
        wordsToTranslate.push(line);
      }
    }

    const translations = await translateWords(wordsToTranslate);
    
    const finalItems = newItemsPayload.map(item => ({
      title: item.title,
      content: translations[item.title] || 'Translation not found',
      groupName: item.groupName
    }));

    batchCreateItems(finalItems.map(i => ({ ...i, systemId: system.id })));
    
    setIsProcessing(false);
    setImportModalOpen(false);
    setImportText('');
    loadItems();
  };

  const now = Date.now();
  const displayItems = filter === 'review' 
    ? items.filter(i => i.status !== 'mastered' && i.nextReviewAt <= now)
    : items;

  const stats = {
    total: items.length,
    due: items.filter(i => i.status !== 'mastered' && i.nextReviewAt <= now).length,
    mastered: items.filter(i => i.status === 'mastered').length
  };

  // Uses dynamic theme color
  const themeClass = THEME_COLORS[globalTheme] || 'bg-nb-white';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className={`${themeClass} border-2 border-nb-black rounded-lg p-6 shadow-nb transition-colors duration-300`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h2 className="text-3xl font-black text-nb-inverse tracking-tight">{system.name}</h2>
            <div className="flex gap-4 mt-2 font-mono text-sm">
                <span className="bg-nb-rose px-2 py-0.5 border-2 border-nb-black rounded text-nb-inverse font-bold text-xs shadow-nb-sm">{t('vocab.due')}: {stats.due}</span>
                <span className="bg-nb-lime px-2 py-0.5 border-2 border-nb-black rounded text-nb-inverse font-bold text-xs shadow-nb-sm">{t('vocab.mastered')}: {stats.mastered}</span>
            </div>
            </div>
            <div className="flex gap-2">
            <Button onClick={() => setFilter(filter === 'all' ? 'review' : 'all')} variant="secondary" size="sm">
                {filter === 'all' ? t('vocab.showDue') : t('vocab.showAll')}
            </Button>
            <Button onClick={() => setImportModalOpen(true)} themeColor="bg-nb-sky" size="sm">
                {t('vocab.import')}
            </Button>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.length === 0 && (
          <div className="col-span-full text-center py-20 opacity-50 font-mono text-nb-text">
            {filter === 'review' ? t('vocab.emptyReview') : t('vocab.emptyAll')}
          </div>
        )}
        
        {displayItems.map(item => (
          <div key={item.id} className="perspective-1000 h-64 cursor-pointer group" onClick={() => handleFlip(item.id)}>
            <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${flippedCards.has(item.id) ? 'rotate-y-180' : ''}`}>
              
              {/* Front - Uses nb-white which is now Dark */}
              <div className="absolute w-full h-full backface-hidden bg-nb-white border-2 border-nb-black shadow-nb flex flex-col justify-center items-center p-6 rounded-lg">
                 <span className="absolute top-2 left-2 text-[10px] font-mono text-nb-text opacity-60 bg-white/10 px-1 border border-nb-black/10 rounded">{item.groupName}</span>
                 <h3 className="text-2xl font-bold text-center break-words text-nb-text">{item.title}</h3>
                 <p className="mt-4 text-[10px] font-mono text-nb-text opacity-40 uppercase tracking-widest">{t('vocab.flip')}</p>
                 {item.status === 'mastered' && <span className="absolute bottom-2 right-2 text-xl">🏆</span>}
              </div>

              {/* Back - Uses themeClass which is now Light Accent */}
              <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${themeClass} border-2 border-nb-black shadow-nb flex flex-col justify-between p-6 rounded-lg transition-colors duration-300`}>
                <div className="flex-1 flex items-center justify-center">
                   <p className="text-xl font-bold text-center text-nb-inverse">{item.content}</p>
                </div>
                
                <div className="flex justify-between gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleCheck(item.id, false)}
                  >
                    {t('vocab.btn.forgot')}
                  </Button>
                  <Button 
                    themeColor="bg-nb-lime"
                    size="sm" 
                    className="flex-1"
                    disabled={item.nextReviewAt > now && item.status !== 'new'}
                    onClick={() => handleCheck(item.id, true)}
                  >
                    {t('vocab.btn.gotIt')}
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isImportModalOpen} onClose={() => setImportModalOpen(false)} title={t('vocab.import.title')}>
        <p className="mb-2 text-xs text-gray-600 whitespace-pre-line">{t('vocab.import.desc')}</p>
        
        <div className="flex gap-2 mb-2 items-center">
            <span className="text-xs font-bold text-nb-black">{t('vocab.import.textColors')}:</span>
            {['#000000', '#EF4444', '#10B981', '#3B82F6', '#F59E0B'].map(c => (
                <button 
                    key={c} 
                    className={`w-4 h-4 rounded-full border border-black ${importTextColor === c ? 'ring-2 ring-offset-1 ring-black' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setImportTextColor(c)}
                />
            ))}
        </div>

        <textarea 
          className="w-full h-64 border-2 border-nb-black p-4 font-mono text-sm focus:outline-none focus:shadow-nb transition-shadow mb-4 rounded-lg bg-white"
          style={{ color: importTextColor }}
          placeholder={t('vocab.import.placeholder')}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
        <div className="flex justify-end">
           <Button onClick={handleImport} disabled={isProcessing} themeColor="bg-nb-sky">
             {isProcessing ? t('vocab.import.processing') : t('vocab.import.btn')}
           </Button>
        </div>
      </Modal>
    </div>
  );
};
