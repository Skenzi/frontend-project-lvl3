import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import * as yup from 'yup';
import 'bootstrap';
import parse from './parser.js';
import watcherState from './watcherState.js';
import resources from './locales/index.js';

const getUrls = (state) => state.content.feeds.map(({ link }) => link);

const validate = (url, state) => {
  const scheme = yup.string().url();
  try {
    scheme.notOneOf(getUrls(state)).validateSync(url);
    return null;
  } catch (e) {
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
const getDataFromRss = (url) => axios.get(getProxyUrl(url)).then((page) => parse(page));

const identifyPosts = (posts) => posts.map((post) => ({ id: _.uniqueId(), ...post }));

const checkNewPosts = (state, delay) => {
  setTimeout(function handel() {
    const urls = getUrls(state);
    const promise = urls.map((url) => getDataFromRss(url));
    Promise.allSettled(promise)
      .then((data) => {
        const сompletedRequests = data.filter((item) => item.status === 'fulfilled');
        сompletedRequests.forEach(({ value }) => {
          const { items: incomingPosts } = value;
          const newPosts = _.differenceBy(incomingPosts, state.content.posts, 'link');
          if (!_.isEmpty(newPosts)) {
            const posts = identifyPosts(newPosts);
            state.content.posts.unshift(...posts);
          }
        });
      })
      .finally(() => {
        setTimeout(handel, delay);
      });
  }, delay);
};

const rssFormController = (state, i18instance, elements) => {
  console.log(elements.form.rssForm)
  elements.form.rssForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(elements.form.rssForm);
    const url = formData.get('url');

    const validateError = validate(url, state);

    if (validateError !== null) {
      state.form.status = 'invalid';
      state.form.error = validateError;
      return;
    }
    state.form.status = 'wait';
    getDataFromRss(url)
      .then(({
        description, title, items,
      }) => {
        state.form.status = 'success';
        state.content.status = _.isEmpty(state.content.feeds) ? 'empty' : 'filling';
        state.content.feeds.push({
          description, title, link: url,
        });
        const posts = identifyPosts(items);
        state.content.posts.unshift(...posts);
      })
      .catch((e) => {
        state.form.status = 'invalid';
        if (e.isAxiosError) {
          state.form.error = i18instance.t('error.network');
        } else {
          state.form.error = i18instance.t('error.invalidRss');
        }
      });
    elements.form.rssForm.reset();
    elements.form.textbox.focus();
  });
};

const elements = {
  form: {
    rssForm: document.querySelector('form.rss-form'),
    textbox: document.querySelector('form.rss-form .form-control'),
    submit: document.querySelector('form.rss-form button[type=submit]'),
  },
  modal: {
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    buttonAgree: document.querySelector('.modal-footer [data-agree]'),
    buttonClose: document.querySelector('.modal-footer button[data-bs-dismiss]'),
  },
  feedback: document.querySelector('.feedback'),
  postsContainer: document.querySelector('.posts'),
  feedsContainer: document.querySelector('.feeds'),
};

const init = (i18instance) => {
  const state = {
    form: {
      status: null,
      error: null,
    },
    content: {
      feeds: [],
      posts: [],
      status: null,
      readingPosts: [],
    },
  };
  const watchedState = watcherState(state, i18instance, elements);
  rssFormController(watchedState, i18instance, elements);
  const delay = 5000;
  checkNewPosts(watchedState, delay);
};

export default () => {
  const instance = i18n.createInstance();
  return instance.init({
    lng: 'ru',
    debug: true,
    resources,
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
