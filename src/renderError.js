export default (textError) => {
  console.log(textError);
  const input = document.querySelector('[name=url]');
  input.classList.add('is-invalid');
  
  const feedback = document.querySelector('.feedback');
  feedback.classList.add('text-danger');
  feedback.textContent = '';
  feedback.textContent = textError;
}