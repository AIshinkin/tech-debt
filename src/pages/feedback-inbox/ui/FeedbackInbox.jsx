import { useEffect, useState } from 'react';
import { getFeedback } from '../api/getFeedback.js';
import './feedback-inbox.css';

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function FeedbackInbox() {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMessages() {
      try {
        setMessages(await getFeedback());
      } catch (error) {
        if (error.status === 401) {
          window.location.assign('/login');
          return;
        }
        setError('Не удалось загрузить обращения. Попробуйте обновить страницу.');
      }
    }

    loadMessages();
  }, []);

  return (
    <section className="feedback-inbox">
      <h1>Обращения</h1>
      {error && <p className="page-intro" role="alert">{error}</p>}
      {!messages && !error && <p className="page-intro" role="status">Загружаем обращения…</p>}
      {messages?.length === 0 && <p className="page-intro">Пока нет обращений.</p>}
      {messages?.length > 0 && (
        <ul className="inbox-list">
          {messages.map(({ id, name, email, message, created_at }) => (
            <li key={id} className="inbox-message">
              <header className="inbox-message-header">
                <div>
                  <h2>{name || 'Без имени'}</h2>
                  {email && <span className="inbox-email">{email}</span>}
                </div>
                <time dateTime={created_at}>{dateFormat.format(new Date(created_at))}</time>
              </header>
              <p className="inbox-message-text">{message || 'Сообщение без текста.'}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
