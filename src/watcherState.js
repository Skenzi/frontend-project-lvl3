import onChange from 'on-change';
import { buildFeeds, buildPosts, buildContainers } from './render.js';

export default (state, i18n) => onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const input = document.querySelector('form.rss-form input');
  input.removeAttribute('readonly');
  const submit = document.querySelector('form.rss-form button[type=submit]');
  submit.removeAttribute('disabled');
  switch (path) {
    case 'error': {
      feedback.textContent = value;
      break;
    }
    case 'content.status': {
      if (value === 'empty') {
        buildContainers(i18n);
      }
      break;
    }
    case 'content.feeds': {
      buildFeeds(value);
      break;
    }
    case 'content.posts': {
      buildPosts(value, state, i18n);
      break;
    }
    case 'content.readingPost': {
      const a = document.querySelector(`[data-id=${value}]`);
      a.classList.add('font-weight-normal');
      a.classList.remove('font-weight-bold');
      break;
    }
    case 'form.status': {
      if (value === 'success') {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('success');
      } else if (value === 'wait') {
        input.setAttribute('readonly', 'readonly');
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
      throw new Error(`Unknown state: '${path}'!`);
    }
  }
});
