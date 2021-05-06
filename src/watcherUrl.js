import onChange from 'on-change';
import stateUrl from './stateUrl.js';
import renderError from './renderError.js';
/* import parser from './parser.js';
import render from './render.js';
import getDataFromUrl from './getDataFromUrl.js'; */

const watcherUrl = onChange(stateUrl, (path, value) => {
  switch (path) {
    case 'urlIsValide':
      if (value) {
        stateUrl.validUrls.push(value);
        console.log('ok!');
      }
      break;
    case 'error':
      renderError(value);
      break;
    default:
      console.log('hz');
  }
});

export default watcherUrl;
