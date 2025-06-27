// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();

  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${delay}ms`);
      } else if (state === 'rejected') {
        reject(`❌ Rejected promise in ${delay}ms`);
      }
    }, delay);
  });

  promise
    .then(message => {
      iziToast.success({
        message: message,
        title: 'OK',
        timeout: 3000,
        position: 'topCenter',
        backgroundColor: '#59a10d',
        titleColor: '#fff',
        messageColor: '#fff',
        iconColor: '#fff',
      });
    })
    .catch(error => {
      iziToast.error({
        message: error,
        title: 'Error',
        timeout: 3000,
        position: 'topCenter',
        backgroundColor: '#ef4040',
        titleColor: '#fff',
        messageColor: '#fff',
      });
    });
  form.elements.delay.value = '';
}
