import { ILanguageProvider } from '../types';

function isToday(date: Date): boolean {
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

function formatDate(
  timestamp: number,
  languageProvider: ILanguageProvider,
): string {
  const weekDays = [
    languageProvider.translate('days.sun'),
    languageProvider.translate('days.mon'),
    languageProvider.translate('days.tues'),
    languageProvider.translate('days.wed'),
    languageProvider.translate('days.thurs'),
    languageProvider.translate('days.fri'),
    languageProvider.translate('days.sat'),
  ];
  const date = new Date(timestamp * 1000);
  const weekDay = weekDays[date.getDay()];

  if (isToday(date)) {
    return `${languageProvider.translate(
      'general.today',
    )}, ${date.toLocaleTimeString()}, ${weekDay}.`;
  } else if (isYesterday(date)) {
    return `${languageProvider.translate(
      'general.yesterday',
    )}, ${date.toLocaleTimeString()}, ${weekDay}.`;
  } else {
    return `${date.toLocaleString()}, ${weekDay}.`;
  }
}

export default formatDate;
