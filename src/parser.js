import i18n from 'i18next';
import watcherState from './watcherState';

export default ({ data }, link) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data.contents, 'application/xml');
  const parserError = document.querySelector('parsererror');

  if (parserError) {
    watcherState.error = i18n.t('error.error2');
    throw new Error('Hernia bratan');
  }

  const feedTitle = document.querySelector('title');
  const feedDescription = document.querySelector('description');
  const items = document.querySelectorAll('item');
  return {
    feedTitle: feedTitle.textContent,
    feedDescription: feedDescription.textContent,
    link,
    items,
  };
};
