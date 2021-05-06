import * as yup from 'yup';
import watcherUrl from './watcherUrl.js';

const scheme = yup.string().url();

export default (url) => scheme.validate(url).then((valide) => {
  console.log(valide)
  if (valide && !watcherUrl.validUrls.includes(valide)) {
    watcherUrl.urlIsValide = valide;
    return valide;
  };
  if (watcherUrl.validUrls.includes(valide)) {
    watcherUrl.error = 'Такой RSS уже существует.';
  };
}).catch(() => {
  watcherUrl.error = 'Указан некорректный URL адрес.';
});
