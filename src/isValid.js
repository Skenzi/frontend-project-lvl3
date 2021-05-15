import * as yup from 'yup';
import i18n from 'i18next';
import watcherUrl from './watchers/watcherUrl.js';

// eslint-disable-next-line no-useless-escape
const scheme = yup.string().matches(/^https?:\/\/[\da-z.\/]+\.rss$/);

export default (url) => scheme.isValid(url)
  .then((valid) => {
    if (valid && !watcherUrl.validUrls.includes(url)) {
      watcherUrl.validUrls.push(url);
      return true;
    }
    watcherUrl.error = watcherUrl.validUrls.includes(url) ? i18n.t('error.error1') : i18n.t('error.error2');
    return false;
  });
