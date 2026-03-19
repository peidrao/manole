'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

let _nextId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(message: string, type: ToastType = 'info') {
    const id = ++_nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, addToast, removeToast };
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const dismiss = setTimeout(() => setLeaving(true), 3200);
    return () => clearTimeout(dismiss);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const remove = setTimeout(() => onRemove(toast.id), 300);
    return () => clearTimeout(remove);
  }, [leaving, toast.id, onRemove]);

  function handleClose() {
    setLeaving(true);
  }

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'i',
  };

  return (
    <div className={`toast toast-${toast.type} ${leaving ? 'toast-leaving' : ''}`} role="status">
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={handleClose} aria-label="Fechar">×</button>
    </div>
  );
}

export function ToastList({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
