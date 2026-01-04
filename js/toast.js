export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');

  if (!container) {
    // На защите можно сказать: тосты аккуратно фейлятся, если контейнер не найден
    // console.warn('Toast container not found');
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

  const text = document.createElement('span');
  text.textContent = message;

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'toast__close';
  close.setAttribute('aria-label', 'Закрыть уведомление');
  close.textContent = '×';
  close.addEventListener('click', () => hideToast(toast));

  toast.append(text, close);
  container.appendChild(toast);

  // Плавное появление
  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  // Авто-скрытие через 5 секунд
  setTimeout(() => hideToast(toast), 5000);
}

function hideToast(toast) {
  toast.classList.remove('toast--visible');
  toast.addEventListener(
    'transitionend',
    () => {
      toast.remove();
    },
    { once: true },
  );
}
