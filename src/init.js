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
  const scheme = yup.string().url();
  try {
    scheme.notOneOf(state.form.validUrls).validateSync(url);
    return null;
  } catch (e) {
    // eslint-disable-next-line no-param-reassign
    return e.message;
  }
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
        console.log(value)
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

const formController = (state, i18instance) => {
  const form = document.querySelector('form.rss-form');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');

    const valid = validate(url, state);

    if (valid !== null) {
      // eslint-disable-next-line no-param-reassign
      state.form.status = 'invalid';
      // eslint-disable-next-line no-param-reassign
      state.error = valid;
      return;
    }
    // eslint-disable-next-line no-param-reassign
    state.form.status = 'wait';
    getDataFromUrl(url)
      .then(({
        feedDescription, feedTitle, items, link,
      }) => {
        // eslint-disable-next-line no-param-reassign
        state.form.status = 'success';
        state.form.validUrls.push(url);
        if (!_.isEmpty(state.content.feeds)) {
          // eslint-disable-next-line no-param-reassign
          state.content.status = 'filling';
        }
        state.content.feeds.push({ feedDescription, feedTitle, link });
        const posts = getPosts(items);
        state.content.posts.unshift(...posts);
      })
      .catch((e) => {
        // eslint-disable-next-line no-param-reassign
        state.form.status = 'invalid';
        if (e.message === 'parserError') {
          // eslint-disable-next-line no-param-reassign
          state.error = i18instance.t('error.invalidRss');
        } else {
          // eslint-disable-next-line no-param-reassign
          state.error = i18instance.t('error.network');
        }
      });
    form.reset();
  });
};

const init = (i18instance) => {
  const state = {
    form: {
      validUrls: [],
      valid: null,
      status: null,
    },
    content: {
      feeds: [],
      posts: [],
      status: 'empty',
      readingPosts: [],
    },
    error: null,
  };
  const watchedState = watcherState(state, i18instance);
  formController(watchedState, i18instance);
  const delay = 5000;
  checkNewPosts(watchedState, delay);
};

const test = () => {
  const instance = i18n.createInstance();
  return instance.init({
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
          notOneOf: instance.t('error.alreadyExist'),
        },
        string: {
          url: instance.t('error.invalidUrl'),
        },
      });
      return init(instance);
    });
};
export default test;
