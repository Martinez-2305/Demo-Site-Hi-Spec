// Hi-Spec Property Solutions: demo landing page interactions
document.documentElement.classList.add('js');

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
  nav.classList.toggle('is-open', !open);
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

// Before / after slider
const slider = document.getElementById('baSlider');
const range = slider.querySelector('.ba__range');
const setPos = () => slider.style.setProperty('--pos', range.value + '%');
range.addEventListener('input', setPos);
setPos();

// Gallery filter
const chips = document.querySelectorAll('.chip');
const tiles = document.querySelectorAll('#gallery .tile');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.toggle('is-active', c === chip));
    const f = chip.dataset.filter;
    tiles.forEach((t) => {
      const show = f === 'all' || t.dataset.cat.split(' ').includes(f);
      t.classList.toggle('is-hidden', !show);
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
const lbCap = lightbox.querySelector('.lightbox__cap');
const closeLightbox = () => { lightbox.hidden = true; document.body.style.overflow = ''; };
tiles.forEach((tile) => {
  const img = tile.querySelector('img');
  if (!img) return; // empty placeholder tiles
  tile.tabIndex = 0;
  const open = () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = tile.querySelector('figcaption').firstChild.textContent.trim();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close').focus();
  };
  tile.addEventListener('click', open);
  tile.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
});
lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

// Dummy quote form: validates, then shows a success message. Nothing is sent.
const form = document.getElementById('quoteForm');
const success = form.querySelector('.form__success');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let firstInvalid = null;
  form.querySelectorAll('[required]').forEach((field) => {
    const ok = field.checkValidity() && field.value.trim() !== '';
    field.classList.toggle('is-invalid', !ok);
    if (!ok && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Request my free quote';
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 900);
});
form.addEventListener('input', (e) => {
  if (e.target.classList.contains('is-invalid') && e.target.value.trim()) e.target.classList.remove('is-invalid');
  success.hidden = true;
});
