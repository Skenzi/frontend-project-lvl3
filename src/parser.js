export default (rss) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(rss.data.contents, 'application/xml');
  const parserError = document.querySelector('parsererror');

  if (parserError) {
    throw new Error('parserError');
  }

  const feedTitle = document.querySelector('title');
  const feedDescription = document.querySelector('description');
  const items = document.querySelectorAll('item');
  return {
    title: feedTitle.textContent,
    description: feedDescription.textContent,
    items: [...items].map((item) => {
      const postTitle = item.querySelector('title');
      const postLink = item.querySelector('link');
      const postDescription = item.querySelector('description');
      return {
        title: postTitle.textContent,
        link: postLink.textContent,
        description: postDescription.textContent,
      };
    }),
  };
};
