/* ══════════════════════════════════
   DIGPORT v17 — Aura Cursor + Resume Download
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
const sections = ['home', 'about', 'skills', 'projects', 'tools', 'blog', 'contact'];

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
  if (!src) return;
  document.querySelectorAll('.home-avatar, .about-avatar-img').forEach(el => {
    el.src = src;
  });
}

/* ── Init ── */
loadCertThumbs();
loadProjectImages();
loadAvatar();
setTimeout(() => showNotif('Welcome to my portfolio!'), 900);

/* ── Resume download tracking notif ── */
const resumeBtn = document.querySelector('.btn-resume');
if (resumeBtn) {
  resumeBtn.addEventListener('click', () => {
    showNotif('Resume download started!', 'success');
  });
}

/* ══════════════════════════════════
   PROJECT FILTER / SORT  (v18 add-on)
══════════════════════════════════ */

(function() {
  const grid    = document.getElementById('projectsGrid');
  const empty   = document.getElementById('projEmpty');
  const sortBtn = document.getElementById('projSortBtn');
  const sortIcon  = document.getElementById('sortIcon');
  const sortLabel = document.getElementById('sortLabel');

  if (!grid) return;

  // Assign sort order via data-order (index = newest first)
  const cards = Array.from(grid.querySelectorAll('.proj-card'));
  cards.forEach((c, i) => { c.dataset.order = i; });

  let activeFilter = 'all';
  let sortAsc = false; // false = newest first (default)

  function applyFilterSort() {
    let visible = 0;
    const sorted = [...cards].sort((a, b) => {
      const oa = parseInt(a.dataset.order), ob = parseInt(b.dataset.order);
      return sortAsc ? ob - oa : oa - ob;
    });

    // Re-append in sorted order
    sorted.forEach(c => grid.appendChild(c));

    sorted.forEach(c => {
      const cat = (c.dataset.cat || '').toLowerCase();
      const show = activeFilter === 'all' || cat === activeFilter;
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    empty.style.display = visible === 0 ? 'flex' : 'none';
  }

  // Filter buttons
  document.querySelectorAll('.pf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilterSort();
    });
  });

  // Sort toggle
  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      sortAsc = !sortAsc;
      sortIcon.className = sortAsc ? 'fas fa-sort-amount-up' : 'fas fa-sort-amount-down';
      sortLabel.textContent = sortAsc ? 'Oldest' : 'Newest';
      applyFilterSort();
    });
  }

  applyFilterSort(); // initial run
})();

/* ══════════════════════════════════
   COLOR PALETTE GENERATOR  (v18 add-on)
══════════════════════════════════ */

(function() {
  /* ── HSL helpers ── */
  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1,3),16)/255,
        g = parseInt(hex.slice(3,5),16)/255,
        b = parseInt(hex.slice(5,7),16)/255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    let h,s,l=(max+min)/2;
    if(max===min){h=s=0;}
    else{
      const d=max-min;
      s=l>.5?d/(2-max-min):d/(max+min);
      switch(max){
        case r:h=((g-b)/d+(g<b?6:0))/6;break;
        case g:h=((b-r)/d+2)/6;break;
        case b:h=((r-g)/d+4)/6;break;
      }
    }
    return [h*360,s*100,l*100];
  }

  function hslToHex(h,s,l) {
    h/=360; s/=100; l/=100;
    let r,g,b;
    if(s===0){r=g=b=l;}
    else{
      const hue2rgb=(p,q,t)=>{
        if(t<0)t+=1; if(t>1)t-=1;
        if(t<1/6)return p+(q-p)*6*t;
        if(t<1/2)return q;
        if(t<2/3)return p+(q-p)*(2/3-t)*6;
        return p;
      };
      const q=l<.5?l*(1+s):l+s-l*s, p=2*l-q;
      r=hue2rgb(p,q,h+1/3);
      g=hue2rgb(p,q,h);
      b=hue2rgb(p,q,h-1/3);
    }
    const toH=x=>Math.round(x*255).toString(16).padStart(2,'0');
    return '#'+toH(r)+toH(g)+toH(b);
  }

  function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}

  function genPalette(hex, mode) {
    const [h,s,l] = hexToHsl(hex);
    switch(mode){
      case 'analogous':
        return [h-30,h-15,h,h+15,h+30].map(a=>hslToHex(((a%360)+360)%360,s,l));
      case 'complementary':
        return [h,h+20,h+180,h+200,h+160].map(a=>hslToHex(((a%360)+360)%360,s,l));
      case 'triadic':
        return [h,h+60,h+120,h+180,h+240].map(a=>hslToHex(((a%360)+360)%360,s,l));
      case 'split':
        return [h,h+150,h+180,h+210,h+30].map(a=>hslToHex(((a%360)+360)%360,s,l));
      case 'tetradic':
        return [h,h+90,h+180,h+270,h+45].map(a=>hslToHex(((a%360)+360)%360,s,l));
      case 'monochromatic':
        return [10,30,50,70,85].map(li=>hslToHex(h,s,clamp(li,10,90)));
    }
  }

  function render() {
    const hex   = document.getElementById('palBaseColor')?.value || '#4d7cff';
    const mode  = document.getElementById('palMode')?.value || 'analogous';
    const swBox = document.getElementById('palSwatches');
    const hxRow = document.getElementById('palHexRow');
    if(!swBox||!hxRow) return;

    const palette = genPalette(hex, mode);
    swBox.innerHTML = '';
    hxRow.innerHTML = '';

    palette.forEach(c => {
      const sw = document.createElement('div');
      sw.className = 'pal-swatch';
      sw.style.background = c;
      sw.title = 'Click to copy ' + c;
      sw.addEventListener('click', () => {
        navigator.clipboard?.writeText(c).then(() => {
          const tip = document.getElementById('palCopyTip');
          if(tip){ tip.textContent = c + ' copied!'; tip.classList.add('visible'); clearTimeout(tip._t); tip._t=setTimeout(()=>tip.classList.remove('visible'),1800); }
        });
      });
      swBox.appendChild(sw);

      const hx = document.createElement('div');
      hx.className = 'pal-hex';
      hx.textContent = c.toUpperCase();
      hx.title = 'Click to copy';
      hx.addEventListener('click', () => {
        navigator.clipboard?.writeText(c).then(() => {
          const tip = document.getElementById('palCopyTip');
          if(tip){ tip.textContent = c + ' copied!'; tip.classList.add('visible'); clearTimeout(tip._t); tip._t=setTimeout(()=>tip.classList.remove('visible'),1800); }
        });
      });
      hxRow.appendChild(hx);
    });
  }

  document.getElementById('palGenBtn')?.addEventListener('click', render);
  document.getElementById('palBaseColor')?.addEventListener('input', render);
  document.getElementById('palMode')?.addEventListener('change', render);

  // Initial render
  document.addEventListener('DOMContentLoaded', render);
  render();
})();

/* ── Tic-Tac-Toe ── */
(function(){
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let board, current, over;

  function init(){
    board = Array(9).fill(null);
    current = 'X';
    over = false;
    const cells = document.querySelectorAll('.ttt-cell');
    cells.forEach(c => {
      c.textContent = '';
      c.disabled = false;
      c.className = 'ttt-cell';
    });
    setStatus(`Player <span class="ttt-x">X</span>'s turn`);
  }

  function setStatus(html){ const s = document.getElementById('tttStatus'); if(s) s.innerHTML = html; }

  function checkWin(){
    for(const [a,b,c] of wins){
      if(board[a] && board[a]===board[b] && board[a]===board[c]) return [a,b,c];
    }
    return null;
  }

  function handleClick(e){
    const i = +e.currentTarget.dataset.i;
    if(over || board[i]) return;
    board[i] = current;
    const cell = e.currentTarget;
    cell.textContent = current;
    cell.classList.add(current==='X'?'mark-x':'mark-o');
    cell.disabled = true;

    const w = checkWin();
    if(w){
      over = true;
      w.forEach(idx => document.querySelectorAll('.ttt-cell')[idx].classList.add('winning'));
      const cls = current==='X'?'ttt-x':'ttt-o';
      setStatus(`<span class="ttt-win">Player <span class="${cls}">${current}</span> wins! 🎉</span>`);
      document.querySelectorAll('.ttt-cell').forEach(c=>c.disabled=true);
      return;
    }
    if(board.every(Boolean)){
      over = true;
      setStatus(`<span class="ttt-win">It's a draw!</span>`);
      return;
    }
    current = current==='X'?'O':'X';
    const nc = current==='X'?'ttt-x':'ttt-o';
    setStatus(`Player <span class="${nc}">${current}</span>'s turn`);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    init();
    document.querySelectorAll('.ttt-cell').forEach(c => c.addEventListener('click', handleClick));
    document.getElementById('tttReset')?.addEventListener('click', init);
  });
})();
