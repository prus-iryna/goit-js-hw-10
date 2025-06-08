import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const dataTimePicker = document.querySelector('#datetime-picker');

const dataDays = document.querySelector('.value[data-days]');
const dataHours = document.querySelector('.value[data-hours]');
const dataMinuts = document.querySelector('.value[data-minutes]');
const dataSeconds = document.querySelector('.value[data-seconds]');
let selectedDate = null;

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
  }
  start(selectedDate) {
    if (this.isActive) {
      return;
    }
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentDate = Date.now();
      const timeLeft = selectedDate - currentDate;
      if (timeLeft <= 0) {
        this.stop();
        this.onTick(this.convertMs(0));
        return;
      }
      this.onTick(this.convertMs(timeLeft));
    }, 1000);
  }
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isActive = false;
  }
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.pad(Math.floor(ms / day));
    const hours = this.pad(Math.floor((ms % day) / hour));
    const minutes = this.pad(Math.floor(((ms % day) % hour) / minute));
    const seconds = this.pad(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }
  pad(value) {
    return String(value).padStart(2, '0');
  }
}
const timer = new Timer({
  onTick: update,
});
function update({ days, hours, minutes, seconds }) {
  dataDays.textContent = days;
  dataHours.textContent = hours;
  dataMinuts.textContent = minutes;
  dataSeconds.textContent = seconds;
}
flatpickr(dataTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      iziToast.warning({
        message: '"Please choose a date in the future"',
        position: 'topCenter',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
});
startBtn.addEventListener('click', () => {
  if (!selectedDate) return;
  timer.start(selectedDate);
  startBtn.disabled = true;
});
