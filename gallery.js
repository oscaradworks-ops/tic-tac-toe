// Simple gallery: clicking a thumbnail updates the preview; clicking preview opens a lightbox
const galleryGrid = document.getElementById('galleryGrid');
const previewImg = document.getElementById('galleryPreview');
const previewWrap = document.getElementById('galleryPreviewWrap');

function setActiveThumb(btn) {
  document.querySelectorAll('.gallery .thumb').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
}

function onThumbClick(e) {
  const btn = e.currentTarget;
  const src = btn.dataset.full;
  if (!src) return;
  previewImg.src = src;
  setActiveThumb(btn);
}

function openLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = `<div class="lightbox-inner"><img src="${previewImg.src}" alt="Full image"/></div>`;
  overlay.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') overlay.remove(); });
  document.body.appendChild(overlay);
  overlay.focus();
}

function initGallery() {
  if (!galleryGrid || !previewImg) return;
  document.querySelectorAll('.gallery .thumb').forEach(btn => {
    btn.addEventListener('click', onThumbClick);
  });
  previewWrap.addEventListener('click', openLightbox);
  // set first thumb as active
  const first = document.querySelector('.gallery .thumb');
  if (first) setActiveThumb(first);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGallery); else initGallery();

export {};
