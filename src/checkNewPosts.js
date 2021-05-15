import _ from 'lodash';
import parser from './parser.js';
import watcherUrl from './watchers/watcherUrl.js';
import watcherState from './watchers/watcherState.js';
import state from './watchers/shared/state.js';

export default () => {
  setTimeout(function handel() {
    watcherUrl.validUrls.forEach((url) => {
      parser(url).then((data) => {
        const currentFeed = state.feeds.find((feed) => feed.feedTitle === data.feedTitle);
        const newPosts = data.posts;
        const oldPosts = state.posts.filter((post) => post.idFeed === currentFeed.id);
        const newCurrentPosts = _.differenceBy(newPosts, oldPosts, 'pubDate');
        if (newCurrentPosts.length !== 0) {
          newCurrentPosts.forEach((newPost) => {
            watcherState.posts.push({
              postTitle: newPost.postTitle.textContent,
              postLink: newPost.postLink.textContent,
              idFeed: currentFeed.id.textContent,
              postDescription: newPost.postDescription.textContent,
              pubDate: newPost.pubDate.textContent,
            });
          });
        }
      });
    });
    setTimeout(handel, 5000);
  }, 5000);
};
