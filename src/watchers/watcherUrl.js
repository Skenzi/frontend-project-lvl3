import onChange from 'on-change';
import stateUrl from './shared/stateUrl.js';

const watcherUrl = onChange(stateUrl, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const input = document.querySelector('[name=url]');
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-success', 'text-danger');
  feedback.textContent = '';
  switch (path) {
    case 'validUrl':
      stateUrl.validUrls.push(value);
      feedback.classList.add('text-success');
      feedback.textContent = 'RSS успешно добавлен.';
      break;
    default:
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = value;
      break;
  }
});

export default watcherUrl;
