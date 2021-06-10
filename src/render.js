const markAsReadingPost = (a, post, state) => {
  a.classList.add('fw-normal');
  a.classList.remove('fw-bold');
  state.content.readingPosts.push(post.id);
};

const buildModal = (post, i18n) => {
  const body = document.querySelector('body');
  body.classList.add('modal-open');

  const modalBackground = document.querySelector('[data-modal-background]');
  modalBackground.classList.add('modal-backdrop');

  const modal = document.querySelector('.modal');
  modal.classList.add('show');
  modal.setAttribute('style', 'display: block');
  modal.setAttribute('aria-modal', 'true');
  modal.removeAttribute('aria-hidden');
  const modalTitle = modal.querySelector('.modal-title');
  modalTitle.textContent = post.postTitle;
  const modalBody = modal.querySelector('.modal-body > p');
  modalBody.textContent = post.postDescription;

  const buttonAgree = modal.querySelector('[data-agree]');
  buttonAgree.setAttribute('href', post.postLink);
  buttonAgree.textContent = i18n.t('modal.go');

  const buttonClose = modal.querySelector('.modal-footer button[data-dismiss]');
  buttonClose.textContent = i18n.t('modal.close');

  const modalDismiss = modal.querySelectorAll('[data-dismiss]');
  modalDismiss.forEach((dismiss) => {
    dismiss.addEventListener('click', () => {
      modalBackground.classList.remove('modal-backdrop');
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('style');
      body.classList.remove('modal-open');
    });
  });
};

const postsController = (a, post, state, i18n) => {
  markAsReadingPost(a, post, state);
  buildModal(post, i18n);
};

const buildContainers = (i18n) => {
  const feedsContainer = document.querySelector('.feeds');

  const feedsContainerTitle = document.createElement('h2');
  feedsContainerTitle.textContent = i18n.t('feedsTitle');

  const listFeeds = document.createElement('ul');
  listFeeds.classList.add('list-group', 'mb-5');

  feedsContainer.prepend(feedsContainerTitle, listFeeds);

  const postsContainer = document.querySelector('.posts');

  const postsContainerTitle = document.createElement('h2');
  postsContainerTitle.textContent = i18n.t('postsTitle');

  const listPosts = document.createElement('ul');
  listPosts.classList.add('list-group');

  postsContainer.prepend(postsContainerTitle, listPosts);
};

const buildFeeds = (feeds) => {
  const listFeeds = document.querySelector('.feeds > ul');
  listFeeds.textContent = '';
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id-feed', feed.id);

    const h3 = document.createElement('h3');
    h3.textContent = feed.feedTitle;

    const p = document.createElement('p');
    p.textContent = feed.feedDescription;

    li.prepend(h3, p);
    listFeeds.prepend(li);
  });
};

const buildPosts = (posts, state, i18n) => {
  const listPosts = document.querySelector('.posts > ul');
  listPosts.textContent = '';

  posts.forEach((post) => {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-sm', 'btn-primary');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#modal');
    button.setAttribute('role', 'button');
    button.textContent = i18n.t('post.preview');

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', post.postLink);
    a.setAttribute('target', '_blank');
    a.textContent = post.postTitle;

    if (state.content.readingPosts.includes(post.id)) {
      a.classList.add('fw-normal');
      a.classList.remove('fw-bold');
    }

    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'list-group-item');
    li.setAttribute('data-id-post', post.id);
    li.prepend(a, button);

    listPosts.append(li);

    a.addEventListener('click', () => markAsReadingPost(a, post, state));
    button.addEventListener('click', () => postsController(a, post, state, i18n));
  });
};

export { buildFeeds, buildPosts, buildContainers };
