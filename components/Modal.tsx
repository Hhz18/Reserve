import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nb-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-nb-white border-2 border-nb-black shadow-nb-lg rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b-2 border-nb-black/10 pb-4">
          <h2 className="text-xl font-bold font-sans text-nb-black">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <div className="font-sans text-nb-black text-sm">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};