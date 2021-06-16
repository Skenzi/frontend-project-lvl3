const markAsReadingPost = (post, state) => {
  const a = document.querySelector(`li[data-id-post=${CSS.escape(post.id)}] a`);
  a.classList.add('fw-normal');
  a.classList.remove('fw-bold');
  state.content.readingPosts.push(post.id);
};

const buildFeedback = (status, i18n) => {
  const feedback = document.querySelector('.feedback');
  const input = document.querySelector('form.rss-form input');
  input.removeAttribute('readonly');
  const submit = document.querySelector('form.rss-form button[type=submit]');
  submit.removeAttribute('disabled');
  switch (status) {
    case 'success': {
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18n.t('success');
      break;
    }
    case 'wait': {
      input.setAttribute('readonly', 'readonly');
      submit.setAttribute('disabled', 'disabled');
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger', 'text-success');
      feedback.textContent = 'Просмотр';
      break;
    }
    case 'invalid': {
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      break;
    }
    default: {
      throw new Error(`Unknown status: '${status}'!`);
    }
  }
};

const fillingModal = (post, i18n) => {
  const modal = document.querySelector('.modal');
  const modalTitle = modal.querySelector('.modal-title');
  modalTitle.textContent = post.title;
  const modalBody = modal.querySelector('.modal-body');
  modalBody.textContent = post.description;

  const buttonAgree = modal.querySelector('[data-agree]');
  buttonAgree.setAttribute('href', post.link);
  buttonAgree.textContent = i18n.t('modal.go');

  const buttonClose = modal.querySelector('.modal-footer button[data-bs-dismiss]');
  buttonClose.textContent = i18n.t('modal.close');
};

const postsController = (post, state, i18n) => {
  markAsReadingPost(post, state);
  fillingModal(post, i18n);
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
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.textContent = feed.description;

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
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('role', 'button');
    button.textContent = i18n.t('post.preview');

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');
    a.textContent = post.title;

    if (state.content.readingPosts.includes(post.id)) {
      a.classList.add('fw-normal');
      a.classList.remove('fw-bold');
    }

    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'list-group-item');
    li.setAttribute('data-id-post', post.id);
    li.prepend(a, button);

    listPosts.append(li);

    a.addEventListener('click', () => markAsReadingPost(post, state));
    button.addEventListener('click', () => postsController(post, state, i18n));
  });
};

export {
  buildFeeds, buildPosts, buildContainers, buildFeedback,
};
