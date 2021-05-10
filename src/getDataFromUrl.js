import watcherState from './watchers/watcherState.js';
import parser from './parser.js';

const axios = require('axios');

export default (url, validation) => {
  validation.then((statusValid) => {
    if (statusValid) {
      axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
        .then((data) => {
          const document = parser(data);
          const titleFeed = document.querySelector('title');
          const descriptionFeed = document.querySelector('description');
          const items = document.querySelectorAll('item');
          const id = watcherState.feeds.length + 1;
          watcherState.feeds.push({ id, titleFeed, descriptionFeed });
          items.forEach((item) => {
            const titlePost = item.querySelector('title');
            const linkPost = item.querySelector('link');
            watcherState.posts.push({ idFeed: id, titlePost, linkPost });
          });
        })
        .catch((e) => console.log(e));
    }
  });
};
