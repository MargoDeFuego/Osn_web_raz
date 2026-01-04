import { showToast } from './toast.js';

const TEMPERATURE_URL = 'http://localhost:3000/temperature';

export function initTemperatureForm() {
  const form = document.getElementById('temperature-form');

  if (!form) {
    return;
  }

  form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const roomInput = form.elements.room;
  const temperatureInput = form.elements.temperature;

  const room = String(roomInput.value).trim();
  const rawTemperature = String(temperatureInput.value).trim().replace(',', '.');
  const temperature = Number(rawTemperature);

  if (!room || Number.isNaN(temperature)) {
    showToast('Проверьте корректность введённых данных.', 'error');
    return;
  }

  setFormDisabled(form, true);

  try {
    const response = await fetch(TEMPERATURE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room,
        temperature,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data && data.message ? data.message : 'Ошибка при отправке данных.';
      throw new Error(message);
    }

    const successMessage = data && data.message ? data.message : 'Данные успешно отправлены.';
    showToast(successMessage, 'success');
    form.reset();
  } catch (error) {
    const errorMessage = error && error.message
      ? error.message
      : 'Не удалось отправить данные.';
    showToast(errorMessage, 'error');
  } finally {
    setFormDisabled(form, false);
  }
}

function setFormDisabled(form, disabled) {
  const elements = Array.from(form.elements);

  elements.forEach((el) => {
    el.disabled = disabled;
  });
}
