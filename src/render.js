const buildFeeds = (value) => {
  const feeds = document.querySelector('.feeds');
  feeds.textContent = '';

  const h2 = document.createElement('h2');
  h2.textContent = 'Фиды';

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  value.forEach((docRss) => {
    const titleFeeds = docRss.document.querySelector('title');
    const descriptionFeeds = docRss.document.querySelector('description');

    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id-feed', docRss.idFeed);

    const h3 = document.createElement('h3');
    h3.textContent = titleFeeds.textContent;

    const p = document.createElement('p');
    p.textContent = descriptionFeeds.textContent;

    li.prepend(h3, p);
    ul.prepend(li);
  });

  feeds.prepend(h2, ul);
};

const buildPosts = (value) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.textContent = '';

  const h2 = document.createElement('h2');
  h2.textContent = 'Посты';

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  value.forEach((docRss) => {
    const posts = docRss.document.querySelectorAll('item');

    posts.forEach((post) => {
      const title = post.querySelector('title');
      const link = post.querySelector('link');
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-sm', 'btn-primary');
      button.textContent = 'Перейти';

      const a = document.createElement('a');
      a.setAttribute('href', link.textContent);
      a.textContent = title.textContent;

      const li = document.createElement('li');
      li.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'list-group-item');
      li.setAttribute('data-id-feed-item', docRss.idFeed);
      li.prepend(a, button);

      ul.prepend(li);
    });
  });
  postsContainer.prepend(h2, ul);
};

export default (value) => {
  buildFeeds(value);
  buildPosts(value);
};
