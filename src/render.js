const markAsReadingPost = (post, state) => {
  const a = document.querySelector(`li[data-id-post=${CSS.escape(post.id)}] a`);
  a.classList.add('fw-normal');
  a.classList.remove('fw-bold');
  state.content.readingPosts.push(post.id);
};

const buildFeedback = (status, i18n, elements) => {
  elements.form.textbox.removeAttribute('readonly');
  elements.form.submit.removeAttribute('disabled');
  switch (status) {
    case 'success': {
      elements.form.textbox.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18n.t('formStatus.success');
      break;
    }
    case 'wait': {
      elements.form.textbox.setAttribute('readonly', 'readonly');
      elements.form.submit.setAttribute('disabled', 'disabled');
      elements.form.textbox.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger', 'text-success');
      elements.feedback.textContent = i18n.t('formStatus.wait');
      break;
    }
    case 'invalid': {
      elements.form.textbox.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      break;
    }
    default: {
      throw new Error(`Unknown status: '${status}'!`);
    }
  }
};

const fillingModal = (post, i18n, elements) => {
  elements.modal.modalTitle.textContent = post.title;
  elements.modal.modalBody.textContent = post.description;
  elements.modal.buttonAgree.setAttribute('href', post.link);
  elements.modal.buttonAgree.textContent = i18n.t('modal.go');
  elements.modal.buttonClose.textContent = i18n.t('modal.close');
};

const postsController = (post, state, i18n, elements) => {
  markAsReadingPost(post, state);
  fillingModal(post, i18n, elements);
};

const buildContainers = (i18n, elements) => {
  const feedsContainerTitle = document.createElement('h2');
  feedsContainerTitle.textContent = i18n.t('feedsTitle');

  const listFeeds = document.createElement('ul');
  listFeeds.classList.add('list-group', 'mb-5');

  elements.feedsContainer.prepend(feedsContainerTitle, listFeeds);

  const postsContainerTitle = document.createElement('h2');
  postsContainerTitle.textContent = i18n.t('postsTitle');

  const listPosts = document.createElement('ul');
  listPosts.classList.add('list-group');

  elements.postsContainer.prepend(postsContainerTitle, listPosts);
};

const buildFeeds = (feeds) => {
  const listFeeds = document.querySelector('.feeds > ul');
  listFeeds.textContent = '';
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');

    const h3 = document.createElement('h3');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.textContent = feed.description;

    li.prepend(h3, p);
    listFeeds.prepend(li);
  });
};

const buildPosts = (posts, state, i18n, elements) => {
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
    button.addEventListener('click', () => postsController(post, state, i18n, elements));
  });
};

export {
  buildFeeds, buildPosts, buildContainers, buildFeedback,
};
