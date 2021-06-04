import onChange from 'on-change';
import { buildFeeds, buildPosts } from './render.js';

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'error': {
      const feedback = document.querySelector('.feedback');
      const input = document.querySelector('.rss-form input');
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
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
    default: {
      break;
    }
  }
});
