/* ══════════════════════════════════
   DIGPORT v11 — Top Header Edition
   main.js
══════════════════════════════════ */

const EMAILJS_SERVICE_ID  = 'service_q6bao1q';
const EMAILJS_TEMPLATE_ID = 'template_2za681j';
const EMAILJS_PUBLIC_KEY  = 'JEzXqh3dF3nFhVT2f';

if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);

/* ── Theme Toggle ── */
const THEME_KEY = 'digport-theme';
const htmlEl = document.documentElement;

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const isDark = theme === 'dark';
  const icon  = isDark ? 'fa-sun' : 'fa-moon';
  const label = isDark ? 'Light' : 'Dark';
  const themeIcon  = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  if (themeIcon)  themeIcon.className  = 'fas ' + icon;
  if (themeLabel) themeLabel.textContent = label;
}

function toggleTheme() {
  const current = htmlEl.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

applyTheme(getStoredTheme());
document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

/* ── Header scroll class ── */
const topHeader = document.getElementById('topHeader');
window.addEventListener('scroll', () => {
  if (topHeader) topHeader.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Hamburger toggle ── */
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

navToggle?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
});

document.querySelectorAll('.th-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

/* ── Scroll-spy ── */
const sections = ['home', 'about', 'skills', 'projects', 'contact'];

function updateActiveNav(id) {
  document.querySelectorAll('.th-link').forEach(el => {
    el.classList.toggle('active', el.getAttribute('href') === '#sec-' + id);
  });
  document.querySelectorAll('.th-mobile-link').forEach(el => {
    el.classList.toggle('active', el.getAttribute('href') === '#sec-' + id);
  });
  document.querySelectorAll('.dot-nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('href') === '#sec-' + id);
  });
}

const sectionEls = sections.map(id => document.getElementById('sec-' + id)).filter(Boolean);

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id.replace('sec-', '');
      updateActiveNav(id);
      if (id === 'skills') triggerSkillBars();
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

sectionEls.forEach(el => scrollObserver.observe(el));

/* ── Skill bars ── */
let skillsDone = false;
function triggerSkillBars() {
  if (skillsDone) return;
  skillsDone = true;
  document.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
    setTimeout(() => {
      bar.style.width = (bar.dataset.width || 0) + '%';
    }, 100 + i * 80);
  });
}

/* ── Project card keyboard a11y ── */
document.querySelectorAll('.proj-card').forEach(c => {
  c.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') c.click();
  });
});

/* ── Project modals ── */
function openProject(id) {
  const el = document.getElementById('modal-' + id);
  if (!el) return;
  new bootstrap.Modal(el).show();
}

/* ── Cert lightbox ── */
const CERT_KEYS = {
  oracle:     'CERT_ORACLE',
  cwts:       'CERT_CWTS',
  honors:     'CERT_HONORS',
  leadership: 'CERT_LEAD'
};

function loadCertThumbs() {
  Object.entries(CERT_KEYS).forEach(([key, g]) => {
    const src = window[g]; if (!src) return;
    const el  = document.getElementById('cert-thumb-' + key);
    if (el) el.src = src;
  });
}

function openCert(key) {
  const src = window[CERT_KEYS[key]]; if (!src) return;
  const lb  = document.getElementById('certLightbox');
  const img = document.getElementById('certLightboxImg');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCert() {
  const lb = document.getElementById('certLightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}



/* ── Contact form ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim() || '(no subject)';
    const message = document.getElementById('cf-message').value.trim();
    const sendBtn = document.getElementById('sendBtn');
    const formOk  = document.getElementById('formOk');
    const formErr = document.getElementById('formErr');

    if (!name || !email || !message) {
      showNotif('Please fill in name, email, and message.', 'error');
      return;
    }
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;
    formOk.style.display = formErr.style.display = 'none';

    try {
      if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        subject,
        message
      });
      contactForm.querySelectorAll('.cf-input, .cf-textarea').forEach(el => el.value = '');
      formOk.style.display = 'flex';
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      sendBtn.disabled = false;
      showNotif("Message sent! I'll reply within 24h.", 'success');
    } catch(err) {
      console.error(err);
      formErr.style.display = 'flex';
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      sendBtn.disabled  = false;
      showNotif('Send failed. Try emailing me directly.', 'error');
    }
  });
}

/* ── Notification ── */
let notifTimer = null;
function showNotif(msg, type = '') {
  const n = document.getElementById('notif');
  if (!n) return;
  n.textContent = msg;
  n.className = 'notif' + (type ? ' notif-' + type : '');
  n.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => n.classList.remove('show'), 3800);
}

/* ── Load project images ── */
function loadProjectImages() {
  const map = {
    'proj-img-hi5':        window.IMG_HI5,
    'proj-img-platonian':  window.IMG_PLATONIAN,
    'proj-img-portfolio':  window.IMG_PORTFOLIO,
    'proj-img-alok':       window.CERT_ALOK_POSTER,
    'modal-img-hi5':       window.IMG_HI5,
    'modal-img-platonian': window.IMG_PLATONIAN,
    'modal-img-portfolio': window.IMG_PORTFOLIO,
    'modal-img-alok':      window.CERT_ALOK_POSTER,
    'alok-cert-best-short-film':   window.CERT_BEST_SHORT_FILM,
    'alok-cert-peoples-choice':    window.CERT_PEOPLES_CHOICE,
    'alok-cert-participation':     window.CERT_PARTICIPATION,
    'alok-cert-publication':       window.CERT_PUBLICATION,
    'cert-grid-best-short-film':   window.CERT_BEST_SHORT_FILM,
    'cert-grid-peoples-choice':    window.CERT_PEOPLES_CHOICE,
    'cert-grid-participation':     window.CERT_PARTICIPATION,
    'cert-grid-publication':       window.CERT_PUBLICATION,
  };
  Object.entries(map).forEach(([id, src]) => {
    if (!src) return;
    const el = document.getElementById(id);
    if (el) el.src = src;
  });
}

/* ── Alok cert lightbox ── */
const ALOK_CERT_KEYS = {
  best_short_film: 'CERT_BEST_SHORT_FILM',
  peoples_choice:  'CERT_PEOPLES_CHOICE',
  participation:   'CERT_PARTICIPATION',
  publication:     'CERT_PUBLICATION',
};

function openAlokCert(key) {
  const src = window[ALOK_CERT_KEYS[key]]; if (!src) return;
  const lb  = document.getElementById('alokCertLightbox');
  const img = document.getElementById('alokCertLightboxImg');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAlokCert() {
  const lb = document.getElementById('alokCertLightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCert(); closeAlokCert(); }
});

function loadAvatar() {
  const src = window.IMG_AVATAR;
  const homeImg = document.querySelector('.home-avatar');
  if (src && homeImg) {
    homeImg.src = src;
  }
}

/* ── Init ── */
loadCertThumbs();
loadProjectImages();
loadAvatar();
setTimeout(() => showNotif('Welcome to my portfolio!'), 900);
