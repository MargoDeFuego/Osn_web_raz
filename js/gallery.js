import { showToast } from './toast.js';

const GALLERY_URL = 'http://localhost:3000/gallery';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export function initGallery() {
  const refreshBtn = document.getElementById('gallery-refresh');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadGallery(true);
    });
  }

  loadGallery(false);
}

async function loadGallery(isManualRefresh) {
  const loader = document.getElementById('gallery-loader');
  const grid = document.getElementById('gallery-grid');
  const emptyText = document.getElementById('gallery-empty');

  if (!loader || !grid || !emptyText) {
    return;
  }

  loader.hidden = false;
  grid.innerHTML = '';
  emptyText.hidden = true;

  try {
    const data = await fetchWithRetry(GALLERY_URL, MAX_RETRIES, RETRY_DELAY_MS);

    loader.hidden = true;

    if (!Array.isArray(data) || data.length === 0) {
      emptyText.hidden = false;
      return;
    }

    renderGallery(grid, data);

    if (isManualRefresh) {
      showToast('Галерея обновлена', 'success');
    }
  } catch {
    loader.hidden = true;
    emptyText.hidden = true;
    showToast('Не удалось загрузить изображения. Попробуйте позже.', 'error');
  }
}

async function fetchWithRetry(url, maxRetries, delayMs) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch {
      lastError = new Error('Request failed');

      if (attempt < maxRetries) {
        await new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        });
      }
    }
  }

  throw lastError;
}

function renderGallery(container, items) {
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    if (!item.url) return;

    const card = document.createElement('article');
    card.className = 'gallery-card';

    const img = document.createElement('img');
    img.src = item.url;
    img.alt = item.description || item.title || 'Изображение';
    img.loading = "lazy";

    img.onerror = () => {
      card.remove();
    };

    const caption = document.createElement('p');
    caption.textContent = item.title || 'Без названия';

    card.append(img, caption);
    fragment.append(card);
  });

  container.append(fragment);
}

