const dateFormat = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' });

export function NewsDate({ value }) {
  return <time dateTime={value}>{dateFormat.format(new Date(value))}</time>;
}
