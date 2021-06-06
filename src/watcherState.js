import onChange from 'on-change';
import i18n from 'i18next';
import { buildFeeds, buildPosts } from './render.js';

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'error': {
      const feedback = document.querySelector('.feedback');
      feedback.textContent = value;
      break;
    }
    case 'content.feeds': {
      buildFeeds(value, state);
      break;
    }
    case 'content.posts': {
      buildPosts(value, state);
      break;
    }
    case 'content.lastReadingPost': {
      const a = document.querySelector(`[data-id=${value}]`);
      a.classList.add('font-weight-normal');
      a.classList.remove('font-weight-bold');
      break;
    }
    case 'form.status': {
      const feedback = document.querySelector('.feedback');
      const input = document.querySelector('.rss-form input');
      if (value === 'success') {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('success');
      } else if (value === 'wait') {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger', 'text-success');
        feedback.textContent = 'Просмотр';
      } else {
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
      }
      break;
    }
    default: {
      break;
    }
  }
});
