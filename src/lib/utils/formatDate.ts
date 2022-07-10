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
  const date = new Date(timestamp * 1000);

  if (isToday(date)) {
    return (
      languageProvider.translate('general.today') +
      ', ' +
      date.toLocaleTimeString()
    );
  } else if (isYesterday(date)) {
    return (
      languageProvider.translate('general.yesterday') +
      ', ' +
      date.toLocaleTimeString()
    );
  } else {
    return date.toLocaleString();
  }
}

export default formatDate;
