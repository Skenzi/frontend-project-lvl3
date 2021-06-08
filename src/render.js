const markAsReadingPost = (elementA, postData, state) => {
  state.content.readingPosts.push(postData.id);
  elementA.classList.add('font-weight-normal');
  elementA.classList.remove('font-weight-bold');
};

const postsController = (postButton, elementA, postData, state) => {
  postButton.addEventListener('click', () => {
    state.content.readingPosts.push(postData.id);
    const body = document.querySelector('body');
    body.classList.add('modal-open');

    const modalBackground = document.querySelector('[data-modal-background]');
    modalBackground.classList.add('modal-backdrop');

    markAsReadingPost(elementA, postData, state);

    const modal = document.querySelector('.modal');
    modal.classList.add('show');
    modal.setAttribute('style', 'display: block');
    modal.setAttribute('aria-modal', 'true');
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
        modalBackground.classList.remove('modal-backdrop');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('style');
        body.classList.remove('modal-open');
      });
    });
  });
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

const buildFeeds = (feeds, state, i18n) => {
  if (state.content.status === 'empty') {
    buildContainers(i18n);
  }
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

const buildPosts = (posts, state) => {
  const listPosts = document.querySelector('.posts > ul');
  listPosts.textContent = '';

  posts.forEach((post) => {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-sm', 'btn-primary');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#modal');
    button.setAttribute('role', 'button');
    button.textContent = 'Просмотр';

    const a = document.createElement('a');
    a.classList.add('font-weight-bold');
    a.setAttribute('href', post.postLink);
    a.setAttribute('target', '_blank');
    a.textContent = post.postTitle;
    a.addEventListener('click', () => markAsReadingPost(a, post, state));

    if (state.content.readingPosts.includes(post.id)) {
      a.classList.add('fw-normal');
      a.classList.remove('fw-bold');
    }

    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'list-group-item');
    li.setAttribute('data-id-post', post.id);
    li.prepend(a, button);

    postsController(button, a, post, state);
    listPosts.append(li);
  });
};

export { buildFeeds, buildPosts };
