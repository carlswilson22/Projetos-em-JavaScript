import React, { useEffect } from 'react';
import { Button } from './button';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = true,
}) => {
  // ESC key listener to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Dialog Content */}
      <div className="relative bg-card text-card-foreground w-full max-w-md rounded-[2rem] border border-border shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2 gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDestructive ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              {message}
            </p>
          </div>

          <div className="flex gap-3 w-full mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl py-3 border-border hover:bg-muted"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={isDestructive ? 'destructive' : 'default'}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 rounded-xl py-3 shadow-md"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
