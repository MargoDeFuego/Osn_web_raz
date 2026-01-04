export function initThemeToggle() {
  const button = document.getElementById('theme-toggle');

  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', next);

    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // На защите можно сказать: ошибки работы с localStorage безопасно игнорируем
    }
  });
}
