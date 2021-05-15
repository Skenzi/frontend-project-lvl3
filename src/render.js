import i18n from 'i18next';
import state from './watchers/shared/state.js';

const postsController = (postButton, elementA, postData) => {
  postButton.addEventListener('click', () => {
    const body = document.querySelector('body');
    body.classList.add('modal-open');

    elementA.classList.add('font-weight-normal');
    elementA.classList.remove('font-weight-bold');

    const modal = document.querySelector('.modal');
    modal.classList.add('show');
    modal.setAttribute('style', 'display: block');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('data-backdrop', 'true');
    modal.removeAttribute('aria-hidden');
    const modalTitle = modal.querySelector('.modal-title');
    modalTitle.textContent = postData.postTitle;
    const modalBody = modal.querySelector('.modal-body > p');
    modalBody.textContent = postData.postDescription;

    const modalAgree = modal.querySelector('[data-modal-agree]');
    const link = elementA.getAttribute('href');
    modalAgree.setAttribute('href', link);

    const modalDismiss = modal.querySelectorAll('[data-dismiss]');
    modalDismiss.forEach((dismiss) => {
      dismiss.addEventListener('click', () => {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('style');
        body.classList.remove('modal-open');
      });
    });
  });
};

const buildFeeds = (feeds) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.textContent = '';

  const h2 = document.createElement('h2');
  h2.textContent = i18n.t('feedsTitle');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id-feed', feed.id);

    const h3 = document.createElement('h3');
    h3.textContent = feed.feedTitle;

    const p = document.createElement('p');
    p.textContent = feed.feedDescription;

    li.prepend(h3, p);
    ul.prepend(li);
  });

  feedsContainer.prepend(h2, ul);
};

const buildPosts = (posts) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.textContent = '';

  const h2 = document.createElement('h2');
  h2.textContent = i18n.t('postsTitle');

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  state.feeds.forEach((feed) => {
    const currentPosts = posts.filter((post) => post.idFeed === feed.id);
    currentPosts.forEach((post) => {
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-sm', 'btn-primary');
      button.setAttribute('data-toggle', 'modal');
      button.setAttribute('data-target', '#modal');
      button.textContent = 'Перейти';

      const a = document.createElement('a');
      a.classList.add('font-weight-bold');
      a.setAttribute('href', post.postLink);
      a.setAttribute('target', '_blank');
      a.textContent = post.postTitle;

      const li = document.createElement('li');
      li.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'list-group-item');
      li.setAttribute('data-id-feed-item', post.idFeed);
      li.setAttribute('data-date', post.pubDate);
      li.prepend(a, button);

      postsController(button, a, post);
      ul.prepend(li);
    });
  });
  postsContainer.prepend(h2, ul);
};

export default (value, path) => {
  if (path === 'feeds') {
    buildFeeds(value);
  } else {
    buildPosts(value);
  }
};
