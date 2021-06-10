export default ({ data }, link) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data.contents, 'application/xml');
  const parserError = document.querySelector('parsererror');

  if (parserError) {
    throw new Error('parserError');
  }

  const feedTitle = document.querySelector('title');
  const feedDescription = document.querySelector('description');
  const items = document.querySelectorAll('item');
  return {
    feedTitle: feedTitle.textContent,
    feedDescription: feedDescription.textContent,
    link,
    items: [...items].map((item) => {
      const postTitle = item.querySelector('title');
      const postLink = item.querySelector('link');
      const postDescription = item.querySelector('description');
      return {
        postTitle: postTitle.textContent,
        postLink: postLink.textContent,
        postDescription: postDescription.textContent,
      };
    }),
  };
};
