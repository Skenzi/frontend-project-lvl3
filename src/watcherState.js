import onChange from 'on-change';
import { buildFeeds, buildPosts } from './render.js';

export default (state, i18n) => onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const submit = document.querySelector('form.rss-form button[type=submit]');
  submit.removeAttribute('disabled');
  switch (path) {
    case 'error': {
      feedback.textContent = value;
      break;
    }
    case 'content.feeds': {
      buildFeeds(value, state, i18n);
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
      const input = document.querySelector('.rss-form input');
      if (value === 'success') {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('success');
      } else if (value === 'wait') {
        submit.setAttribute('disabled', 'disabled');
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
