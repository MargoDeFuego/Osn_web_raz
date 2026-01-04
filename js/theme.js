export function initThemeToggle() {
  const button = document.getElementById('theme-toggle');

  if (!button) {
    return;
  }

  try { const saved = localStorage.getItem('theme'); if (saved) { document.documentElement.setAttribute('data-theme', saved); } 
    } catch {}

  button.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', next);

    try {
      localStorage.setItem('theme', next);
    } catch {
      // Ошибки localStorage игнорируем
    }
  });
}
