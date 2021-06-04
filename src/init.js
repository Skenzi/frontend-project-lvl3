import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import * as yup from 'yup';
import parser from './parser.js';
import watcherState from './watcherState.js';
import ru from './locale/ru.js';
import en from './locale/en.js';

const getPosts = (items) => {
  const posts = [...items].map((item) => {
    const postTitle = item.querySelector('title');
    const postLink = item.querySelector('link');
    const postDescription = item.querySelector('description');
    const pubDate = item.querySelector('pubDate');
    return {
      postTitle: postTitle.textContent,
      postLink: postLink.textContent,
      id: _.uniqueId(),
      postDescription: postDescription.textContent,
      pubDate: pubDate.textContent,
    };
  });
  return posts;
};

const validate = (url, state) => {
  const scheme = yup.string().url().notOneOf(state.form.validUrls);
  try {
    return scheme.validateSync(url);
  } catch (e) {
    // eslint-disable-next-line no-param-reassign
    state.error = e;
  }
  return null;
};
const getProxyUrl = (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com';
  const params = { disableCache: true, url };

  const proxyUrl = new URL('/get', proxy);
  const searchParams = new URLSearchParams(params);
  proxyUrl.search = searchParams;

  return proxyUrl.toString();
};
// http://lorem-rss.herokuapp.com/feed?unit=second&interval=30
const getDataFromUrl = (url) => axios.get(getProxyUrl(url)).then((page) => parser(page, url));

const checkNewPosts = (state, delay) => {
  setTimeout(function handel() {
    const promise = state.form.validUrls.map((url) => getDataFromUrl(url));
    Promise.allSettled(promise).then((data) => {
      data.forEach(({ value }) => {
        const { items } = value;
        const incomingPosts = getPosts(items);
        const newPosts = _.differenceBy(incomingPosts, state.content.posts, 'pubDate');
        if (!_.isEmpty(newPosts)) {
          state.content.posts.unshift(...newPosts);
        }
      });
    });
    setTimeout(handel, delay);
  }, delay);
};

const formController = (state) => {
  const form = document.querySelector('form');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const inputValue = formData.get('url');

    const valid = validate(inputValue, state);

    if (valid) {
      const feedback = document.querySelector('.feedback');
      const input = document.querySelector('.rss-form input');
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = 'RSS успешно добавлен!';
      state.form.validUrls.push(inputValue);
      if (!_.isEmpty(state.content.feeds)) {
        // eslint-disable-next-line no-param-reassign
        state.content.status = 'filling';
      }
      getDataFromUrl(inputValue)
        .then(({
          feedDescription, feedTitle, items, link,
        }) => {
          state.content.feeds.push({ feedDescription, feedTitle, link });
          const posts = getPosts(items);
          state.content.posts.unshift(...posts);
        })
        .catch((e) => {
          // eslint-disable-next-line no-param-reassign
          state.error = e;
        });
    }
    form.reset();
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
  })
    .then(() => {
      yup.setLocale({
        mixed: {
          notOneOf: i18n.t('error.error1'),
        },
        string: {
          url: i18n.t('error.error2'),
        },
      });
    });
  const state = {
    form: {
      validUrls: [],
      valid: null,
    },
    content: {
      feeds: [],
      posts: [],
      status: 'empty',
      readingPosts: [],
    },
    error: null,
  };
  const watchedState = watcherState(state);
  formController(watchedState);
  const delay = 5000;
  checkNewPosts(watchedState, delay);
};

export default initHtml;
