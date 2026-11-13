import { useEffect, useId, useRef } from 'react';
import './modal.css';

export function Modal({ title, onClose, children }) {
  const dialog = useRef(null);
  const titleId = useId();

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  return (
    <dialog ref={dialog} onClose={onClose} aria-labelledby={titleId}>
      <div className="dialog-header">
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className="close-button"
          aria-label="Закрыть окно"
          onClick={() => dialog.current.close()}
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
