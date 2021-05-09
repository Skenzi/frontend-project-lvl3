import onChange from 'on-change';
import state from './shared/state.js';
import render from '../render.js';

const watchedState = onChange(state, (path, value) => {
  render(value);
});

export default watchedState;
