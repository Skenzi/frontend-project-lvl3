import onChange from 'on-change';
import {
  buildFeeds, buildPosts, buildContainers, buildFeedback,
} from './render.js';

export default (state, i18n, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.error': {
      elements.feedback.textContent = value;
      break;
    }
    case 'content.status': {
      if (value === 'empty') {
        buildContainers(i18n, elements);
      }
      break;
    }
    case 'content.feeds': {
      buildFeeds(value);
      break;
    }
    case 'content.posts': {
      buildPosts(value, state, i18n, elements);
      break;
    }
    case 'form.status': {
      elements.form.textbox.removeAttribute('readonly');
      elements.form.submit.removeAttribute('disabled');
      buildFeedback(value, i18n, elements);
      break;
    }
    default: {
      throw new Error(`Unknown state: '${path}'!`);
    }
  }
});
