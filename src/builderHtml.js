import isValide from './isValide.js';

const buildForm = () => {
  const form = document.createElement('form');
  form.classList.add('rss-form');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    form.reset();
    isValide(url);
  });

  const formRow = document.createElement('div');
  formRow.classList.add('form-row');

  const formColInput = document.createElement('div');
  formColInput.classList.add('col');

  const input = document.createElement('input');
  input.setAttribute('placeholder', 'ссылка RSS');
  input.setAttribute('name', 'url');
  input.setAttribute('autofocus', 'autofocus');
  input.setAttribute('required', 'required');
  input.classList.add('form-control', 'form-control-lg', 'w-100');

  const formColSubmit = document.createElement('div');
  formColSubmit.classList.add('col-auto');

  const submit = document.createElement('button');
  submit.setAttribute('type', 'submit');
  submit.classList.add('btn', 'btn-lg', 'btn-primary', 'px-sm-5');
  submit.textContent = 'Add';

  formColInput.prepend(input);
  formColSubmit.prepend(submit);
  formRow.prepend(formColInput, formColSubmit);
  form.prepend(formRow);

  return form;
};

const buildHeaderMain = () => {
  const section = document.createElement('section');
  section.classList.add('container-fluid', 'bg-dark', 'p-5');

  const row = document.createElement('div');
  row.classList.add('row');

  const column = document.createElement('div');
  column.classList.add('col-md-10', 'col-lg-8', 'mx-auto', 'text-white');

  const h1 = document.createElement('h1');
  h1.classList.add('display-3');
  h1.textContent = 'RSS агрегатор';

  const h2 = document.createElement('p');
  h2.classList.add('lead');
  h2.textContent = 'Начните читать RSS сегодня! Это легко, это красиво.';

  const form = buildForm();

  const p = document.createElement('p');
  p.textContent = 'Пример: https://ru.hexlet.io/lessons.rss';
  p.classList.add('text-muted', 'my-1');

  const divFeedback = document.createElement('div');
  divFeedback.classList.add('feedback');

  section.prepend(row);
  row.prepend(column);
  column.prepend(h1, h2, form, p, divFeedback);

  return section;
};

const buildBodyMain = () => {
  const section = document.createElement('section');
  section.classList.add('container-fluid', 'p-5');

  const container1 = document.createElement('div');
  container1.classList.add('row');
  const feeds = document.createElement('div');
  feeds.classList.add('col-md-10', 'col-lg-8', 'mx-auto', 'feeds');

  const container2 = document.createElement('div');
  container2.classList.add('row');
  const posts = document.createElement('div');
  posts.classList.add('col-md-10', 'col-lg-8', 'mx-auto', 'posts');

  section.prepend(container1, container2);
  container1.prepend(feeds);
  container2.prepend(posts);

  return section;
};

const initHtml = () => {
  const main = document.createElement('main');
  main.classList.add('flex-grow-1');
  const headerMain = buildHeaderMain();
  const bodyMain = buildBodyMain();
  main.prepend(headerMain, bodyMain);
  document.body.append(main);
};

export default initHtml;
