import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextData {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  toasts: ToastMessage[];
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((state) => state.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, message, type, duration };

    setToasts((state) => [...state, toast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Componente do container de toasts integrado
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const typeStyles = {
          success: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200',
          error: 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200',
          warning: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200',
          info: 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-200',
        };

        const Icon = {
          success: CheckCircle2,
          error: AlertCircle,
          warning: AlertTriangle,
          info: Info,
        }[toast.type];

        const iconColor = {
          success: 'text-emerald-500',
          error: 'text-rose-500',
          warning: 'text-amber-500',
          info: 'text-blue-500',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 ${typeStyles[toast.type]}`}
            role="alert"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium pr-1">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 -mr-1.5 -mt-1 text-muted-foreground hover:bg-muted/20 hover:text-foreground rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};
