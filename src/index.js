// src/index.js
import { GalleryManager } from './lib/gallery';
import './styles/main.css';

document.addEventListener("DOMContentLoaded", () => {
  const galleryManager = new GalleryManager();
  galleryManager.init();
});
