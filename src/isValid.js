import * as yup from 'yup';
import watcherUrl from './watchers/watcherUrl.js';

// eslint-disable-next-line no-useless-escape
const scheme = yup.string().matches(/^https?:\/\/[\da-z.\/]+\.rss$/);

export default (url) => scheme.isValid(url)
  .then((valid) => {
    if (valid && !watcherUrl.validUrls.includes(url)) {
      console.log(url);
      watcherUrl.validUrl = url;
      return true;
    }
    watcherUrl.error = watcherUrl.validUrls.includes(url) ? 'Такой RSS уже существует' : 'Ресурс не содержит валидный RSS';
    return false;
  });
