import './about.css';

export function About() {
  return (
    <div className="about-page">
      <section className="about-intro">
        <p className="about-context">Тестовое задание по веб-разработке</p>
        <h1>Пиксельная студия</h1>
        <p className="about-lead">
          Демонстрационный сайт игровой студии с каталогом браузерных игр,
          новостями и формой обратной связи.
        </p>
      </section>

      <section className="about-review" aria-labelledby="about-review-title">
        <h2 id="about-review-title">Что можно проверить</h2>
        <div className="about-sections">
          <article>
            <h3><a href="/gallery">Галерея игр <span aria-hidden="true">↗</span></a></h3>
            <p>
              Откройте карточку игры и полистайте скриншоты. Администратор может
              пополнить галерею играми из FreeToGame.
            </p>
          </article>
          <article>
            <h3><a href="/news">Новости <span aria-hidden="true">↗</span></a></h3>
            <p>
              Прочитайте демонстрационные публикации. После входа можно оставить
              комментарий, а администратор может редактировать и публиковать новости.
            </p>
          </article>
          <article>
            <h3>Обратная связь</h3>
            <p>
              Посетитель отправляет сообщение через форму в шапке. Администратор
              видит его в разделе «Обращения».
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
