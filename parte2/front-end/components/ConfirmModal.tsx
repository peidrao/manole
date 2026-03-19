'use client';

import { useEffect } from 'react';

type Props = {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({ taskTitle, onConfirm, onCancel }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, onConfirm]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrap">
          <span className="modal-icon">!</span>
        </div>
        <h3 className="modal-title">Excluir tarefa?</h3>
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
