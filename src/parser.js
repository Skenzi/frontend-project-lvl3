import axios from 'axios';

export default (url) => axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
  .then((data) => {
    const parser = new DOMParser();
    const document = parser.parseFromString(data.data.contents, 'application/xml');
    const feedTitle = document.querySelector('title');
    const feedDescription = document.querySelector('description');
    const items = document.querySelectorAll('item');
    const posts = [...items].map((item) => {
      const postTitle = item.querySelector('title');
      const postLink = item.querySelector('link');
      const postDescription = item.querySelector('description');
      const pubDate = item.querySelector('pubDate');
      return {
        postTitle: postTitle.textContent,
        postLink: postLink.textContent,
        postDescription: postDescription.textContent,
        pubDate: pubDate.textContent,
      };
    });
    return {
      feedTitle: feedTitle.textContent,
      feedDescription: feedDescription.textContent,
      posts,
    };
  })
  .catch((e) => console.log(e));
