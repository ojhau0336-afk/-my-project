/* ════════════════════════════════
   PORTFOLIO - script.js
════════════════════════════════ */

/* ── 1. NAVBAR scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});

/* ── 2. MOBILE MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function openMenu() {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  // allow tabbing into menu links
  mobileMenu.querySelectorAll('a').forEach(a => a.removeAttribute('tabindex'));
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  // remove from tab order when hidden
  mobileMenu.querySelectorAll('a').forEach(a => a.setAttribute('tabindex', '-1'));
}

// Toggle on hamburger click
hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

// Close when any nav link inside menu is clicked
mobileMenu.querySelectorAll('.mob-link, .mob-hire').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close when clicking outside the navbar
document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar')) closeMenu();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ── 3. ACTIVE NAV LINK on scroll ── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;

  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');

    // desktop
    const desktopLink = document.querySelector(`.nav-link[href="#${id}"]`);
    if (desktopLink) desktopLink.classList.toggle('active', scrollY >= top && scrollY < top + height);

    // mobile
    const mobLink = document.querySelector(`.mob-link[href="#${id}"]`);
    if (mobLink) mobLink.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

/* ── 4. TYPEWRITER effect ── */
const words   = ['Websites 🌐', 'Web Apps 🚀', 'UI Designs 🎨', 'APIs ⚡', 'Solutions 💡'];
let wordIdx   = 0;
let charIdx   = 0;
let deleting  = false;
const typedEl = document.getElementById('typed');

function typeWriter() {
  if (!typedEl) return;
  const word = words[wordIdx];

  if (!deleting) {
    typedEl.textContent = word.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === word.length) {
      deleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    typedEl.textContent = word.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
    }
  }
  setTimeout(typeWriter, deleting ? 60 : 100);
}
typeWriter();

/* ── 5. SKILL BAR animation ── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.si-fill').forEach(bar => {
        bar.classList.add('animate');
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* ── 6. FADE-UP scroll animation ── */
const fadeEls = document.querySelectorAll(
  '.p-card, .sv-card, .skill-col, .c-item, .about-img-wrap, .about-text, .sec-header'
);
fadeEls.forEach(el => el.classList.add('fade-up'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

/* ── 7. PROJECT FILTER ── */
const filterBtns = document.querySelectorAll('.f-btn');
const pCards     = document.querySelectorAll('.p-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    pCards.forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;
      card.classList.toggle('hide', !show);
      // Re-trigger fade animation
      if (show) {
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      }
    });
  });
});

/* ── 8. CONTACT FORM validation ── */
const form      = document.getElementById('contactForm');
const formMsg   = document.getElementById('formMsg');
const submitBtn = document.getElementById('submitBtn');

function getVal(id) { return document.getElementById(id)?.value.trim() ?? ''; }
function setErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErr(id) { setErr(id, ''); }
function setInvalid(inputId) {
  document.getElementById(inputId)?.classList.add('error');
}
function clearInvalid(inputId) {
  document.getElementById(inputId)?.classList.remove('error');
}

// Live clear errors on input
['cName','cEmail','cSubject','cMessage'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    clearInvalid(id);
    const errMap = { cName:'errName', cEmail:'errEmail', cSubject:'errSubject', cMessage:'errMessage' };
    clearErr(errMap[id]);
    formMsg.classList.add('hidden');
  });
});

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = getVal('cName');
  const email   = getVal('cEmail');
  const subject = getVal('cSubject');
  const message = getVal('cMessage');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let   valid   = true;

  // Reset
  ['cName','cEmail','cSubject','cMessage'].forEach(clearInvalid);
  ['errName','errEmail','errSubject','errMessage'].forEach(clearErr);

  if (!name) {
    setErr('errName', 'Name is required.');
    setInvalid('cName');
    valid = false;
  }
  if (!email) {
    setErr('errEmail', 'Email is required.');
    setInvalid('cEmail');
    valid = false;
  } else if (!emailRe.test(email)) {
    setErr('errEmail', 'Enter a valid email address.');
    setInvalid('cEmail');
    valid = false;
  }
  if (!subject) {
    setErr('errSubject', 'Subject is required.');
    setInvalid('cSubject');
    valid = false;
  }
  if (!message || message.length < 10) {
    setErr('errMessage', 'Message must be at least 10 characters.');
    setInvalid('cMessage');
    valid = false;
  }

  if (!valid) return;

  // Simulate submission (no real email sent — connect Formspree to enable)
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled    = true;

  setTimeout(() => {
    formMsg.textContent = '✅ Message received! I\'ll get back to you soon. (Demo only — connect Formspree to send real emails.)';
    formMsg.className   = 'form-msg success';
    formMsg.classList.remove('hidden');
    form.reset();
    submitBtn.textContent = 'Send Message →';
    submitBtn.disabled    = false;
    setTimeout(() => formMsg.classList.add('hidden'), 6000);
  }, 1200);
});

/* ── 9. BACK TO TOP ── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  if (backTop) backTop.style.opacity = window.scrollY > 400 ? '1' : '0';
});
if (backTop) backTop.style.opacity = '0';
backTop?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top:0, behavior:'smooth' });
});

/* ── 10. SMOOTH SCROLL for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior:'smooth' });
    }
  });
});
