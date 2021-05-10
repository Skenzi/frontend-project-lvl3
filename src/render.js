const buildFeeds = (feeds) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.textContent = '';

  const h2 = document.createElement('h2');
  h2.textContent = 'Фиды';

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id-feed', feed.id);

    const h3 = document.createElement('h3');
    h3.textContent = feed.titleFeed.textContent;

    const p = document.createElement('p');
    p.textContent = feed.descriptionFeed.textContent;

    li.prepend(h3, p);
    ul.prepend(li);
  });

  feedsContainer.prepend(h2, ul);
};

const buildPosts = (posts) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.textContent = '';

  const h2 = document.createElement('h2');
  h2.textContent = 'Посты';

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach((post) => {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-sm', 'btn-primary');
    button.textContent = 'Перейти';

    const a = document.createElement('a');
    a.setAttribute('href', post.linkPost.textContent);
    a.textContent = post.titlePost.textContent;

    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'list-group-item');
    li.setAttribute('data-id-feed-item', post.idFeed);
    li.prepend(a, button);

    ul.prepend(li);
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
