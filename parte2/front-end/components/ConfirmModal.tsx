'use client';

import { useEffect, useRef } from 'react';

type Props = {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({ taskTitle, onConfirm, onCancel }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;
    const el = modalRef.current;

    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); onCancel(); return; }
      if (e.key === 'Enter') { e.preventDefault(); onConfirm(); return; }
      if (e.key === 'Tab') {
        const focusable = Array.from(el.querySelectorAll<HTMLElement>(focusableSelectors));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
        }
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, onConfirm]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        ref={modalRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon-wrap">
          <span className="modal-icon">!</span>
        </div>
        <h3 id="confirm-modal-title" className="modal-title">Excluir tarefa?</h3>
        <p className="modal-message">
          A tarefa{' '}
          <span className="modal-task-name">&ldquo;{taskTitle}&rdquo;</span>{' '}
          será removida permanentemente. Esta ação não pode ser desfeita.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn btn-danger-solid" onClick={onConfirm} autoFocus>
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}
