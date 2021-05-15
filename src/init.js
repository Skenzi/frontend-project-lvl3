import i18n from 'i18next';
import isValid from './isValid.js';
import parser from './parser.js';
import checkNewPosts from './checkNewPosts.js';
import watcherState from './watchers/watcherState.js';
import ru from './locale/ru.js';
import en from './locale/en.js';

const formController = () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    form.reset();
    isValid(url).then((statusUrl) => {
      if (statusUrl) {
        parser(url).then((data) => {
          const id = watcherState.feeds.length + 1;
          watcherState.feeds.push({
            id,
            feedTitle: data.feedTitle,
            feedDescription: data.feedDescription,
          });
          data.posts.forEach((post) => {
            watcherState.posts.push({
              idFeed: id,
              postLink: post.postLink,
              postTitle: post.postTitle,
              postDescription: post.postDescription,
              pubDate: post.pubDate,
            });
          });
        });
      }
    });
  });
};

const initHtml = () => {
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
      en,
    },
  });
  formController();
  checkNewPosts();
};

export default initHtml;
