import watcherState from './watchers/watcherState.js';
import parser from './parser.js';

const axios = require('axios');

export default (url, validation) => {
  validation.then((statusValid) => {
    if (statusValid) {
      axios.get(url)
        .then((data) => {
          const document = parser(data);
          watcherState.dataRss.push({ idFeed: `feed${watcherState.dataRss.length + 1}`, document });
        })
        .catch((e) => console.log(e));
    }
  });
};
