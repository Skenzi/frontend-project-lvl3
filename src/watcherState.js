import onChange from 'on-change';
import { buildFeeds, buildPosts, buildContainers, buildFeedback } from './render.js';

export default (state, i18n) => onChange(state, (path, value) => {
  switch (path) {
    case 'error': {
      const feedback = document.querySelector('.feedback');
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
    case 'form.status': {
      buildFeedback(value, i18n);
      break;
    }
    default: {
      throw new Error(`Unknown state: '${path}'!`);
    }
  }
});
