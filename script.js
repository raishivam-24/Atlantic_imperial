/* ============================================================
   ATLANTIC IMPERIAL — script.js
   ============================================================ */

/* ── Navbar: scroll state ──────────────────────────────────── */
const navbar = document.getElementById('navbar');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ── Navbar: mobile toggle ─────────────────────────────────── */
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when any link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Active nav link on scroll ─────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.id;
    }
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = navbar.classList.contains('scrolled') ? 'var(--green)' : 'var(--gold-light)';
    }
  });
}, { passive: true });

/* ── Scroll Reveal ─────────────────────────────────────────── */
const revealTargets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

/* ── Floor Plan Tabs ───────────────────────────────────────── */
function switchTab(tabId, el) {
  // Remove active from all tabs and panels
  document.querySelectorAll('.fp-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.fp-panel').forEach(p => {
    p.classList.remove('active');
  });

  // Activate selected tab and panel
  el.classList.add('active');
  el.setAttribute('aria-selected', 'true');

  const panel = document.getElementById('tab-' + tabId);
  if (panel) {
    panel.classList.add('active');
    // Smooth scroll to show the panel if needed
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ── Gallery Lightbox ──────────────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');

document.querySelectorAll('.g-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) {
      lbImg.src  = img.src;
      lbImg.alt  = img.alt || 'Gallery Image';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── Contact Form Submission ───────────────────────────────── */
const enquiryForm = document.getElementById('enquiryForm');
const submitBtn   = document.getElementById('submitBtn');

if (enquiryForm) {
  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name  = document.getElementById('fname').value.trim();
    const phone = document.getElementById('fphone').value.trim();

    if (!name || !phone) {
      shakeField(!name ? 'fname' : 'fphone');
      return;
    }

    // Simulate submission
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = '✓ Enquiry Sent — We will contact you shortly!';
      submitBtn.classList.add('success');
      submitBtn.disabled = true;
      enquiryForm.reset();
    }, 1200);
  });
}

function shakeField(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = '#e53935';
  field.style.animation = 'none';
  field.focus();
  setTimeout(() => { field.style.borderColor = ''; }, 2000);
}

/* ── Smooth anchor scroll (accounts for fixed navbar) ─────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Floating CTA: hide on contact section ─────────────────── */
const floatingCta    = document.querySelector('.floating-cta');
const contactSection = document.getElementById('contact');

if (floatingCta && contactSection) {
  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      floatingCta.style.opacity    = entry.isIntersecting ? '0' : '1';
      floatingCta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.2 });
  ctaObserver.observe(contactSection);
}

/* ── Number counter animation in hero stats ───────────────── */
function animateValue(el, start, end, duration, suffix) {
  const range  = end - start;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = Math.round(start + range * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Trigger stats counter when hero is in view
const heroStats = document.querySelectorAll('.hero-stat-num');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
    }
  });
}, { threshold: 0.5 });

const heroSection = document.getElementById('hero');
if (heroSection) statsObserver.observe(heroSection);

function switchView(flat, view, btn){

  const wrap = btn.parentElement;

  wrap.querySelectorAll('.view-btn').forEach(button=>{
    button.classList.remove('active');
  });

  btn.classList.add('active');

  const container = wrap.parentElement;

  container.querySelectorAll('.plan-view').forEach(img=>{
    img.classList.remove('active-plan');
  });

  document.getElementById(`${flat}-${view}`)
          .classList.add('active-plan');
}
