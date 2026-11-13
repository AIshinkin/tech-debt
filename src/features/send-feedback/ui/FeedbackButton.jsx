import { useState } from 'react';
import { Modal } from '@/shared/ui';
import { sendFeedback } from '../api/sendFeedback.js';
import './feedback-form.css';

function FeedbackForm({ onClose }) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  async function submitFeedback(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = Object.fromEntries(new FormData(form));
    setSending(true);
    setStatus('');

    try {
      await sendFeedback(message);

      form.reset();
      setStatus('Сообщение отправлено.');
    } catch {
      setStatus('Не удалось отправить сообщение. Попробуйте ещё раз.');
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal title="Обратная связь" onClose={onClose}>
      <form className="feedback-form" onSubmit={submitFeedback} noValidate>
        <label>
          Имя
          <input name="name" autoComplete="name" />
        </label>
        <label>
          Электронная почта
          <input name="email" type="email" autoComplete="email" />
        </label>
        <label>
          Сообщение
          <textarea name="message" rows="4" />
        </label>
        <button className="button" disabled={sending}>
          {sending ? 'Отправляем…' : 'Отправить'}
        </button>
        {status && <p role="status">{status}</p>}
      </form>
    </Modal>
  );
}

export function FeedbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="button" onClick={() => setOpen(true)}>Обратная связь</button>
      {open && <FeedbackForm onClose={() => setOpen(false)} />}
    </>
  );
}
