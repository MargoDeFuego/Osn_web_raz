import { initGallery } from './gallery.js';
import { initTemperatureForm } from './temperature.js';
import { initThemeToggle } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initGallery();
  initTemperatureForm();
});
