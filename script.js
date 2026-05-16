// ============ LENIS SMOOTH SCROLL ============
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 2.4,
  easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -14 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.6,
  lerp: 0.055,
  syncTouch: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ============ NAV SCROLL EFFECT ============
const nav = document.querySelector('.nav');
ScrollTrigger.create({
  start: 'top -50',
  end: 99999,
  toggleClass: { className: 'scrolled', targets: nav }
});

// ============ HERO INTRO ANIMATION ============
gsap.to('.hero-title .word', {
  y: 0,
  duration: 1.4,
  ease: 'expo.out',
  stagger: 0.08,
  delay: 0.2,
});

gsap.from('.hero-desc, .hero-cta', {
  y: 30,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  stagger: 0.15,
  delay: 1.1,
});

gsap.from('.hero-ticker', {
  opacity: 0,
  duration: 1,
  delay: 1.5,
});

// ============ HERO VEIL REVEAL ============
const heroSec = document.querySelector('.hero');
const heroVeil = document.querySelector('.hero-veil');
if (heroSec && heroVeil) {
  let mx = 50, my = 50, tx = 50, ty = 50;

  heroSec.addEventListener('mousemove', (e) => {
    const rect = heroSec.getBoundingClientRect();
    tx = ((e.clientX - rect.left) / rect.width) * 100;
    ty = ((e.clientY - rect.top) / rect.height) * 100;
  });
  heroSec.addEventListener('mouseleave', () => { tx = 50; ty = -40; });

  function loop() {
    mx += (tx - mx) * 0.1;
    my += (ty - my) * 0.1;
    heroVeil.style.setProperty('--mx', `${mx}%`);
    heroVeil.style.setProperty('--my', `${my}%`);
    requestAnimationFrame(loop);
  }
  loop();
}

// ============ BLOB PARALLAX ============
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5);
  const y = (e.clientY / window.innerHeight - 0.5);

  gsap.to('.blob-1', { x: x * 60, y: y * 60, duration: 1.5, ease: 'power2.out' });
  gsap.to('.blob-2', { x: x * -40, y: y * -40, duration: 1.8, ease: 'power2.out' });
  gsap.to('.blob-3', { x: x * 50, y: y * -50, duration: 2, ease: 'power2.out' });
});

// ============ SPLIT CHARS HELPER ============
function splitIntoChars(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const walk = (node) => {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      const text = node.textContent;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || ch === '\n' || ch === '\t') {
          frag.appendChild(document.createTextNode(ch));
        } else {
          const span = document.createElement('span');
          span.className = 'reveal-char';
          span.textContent = ch;
          frag.appendChild(span);
        }
      }
      node.replaceWith(frag);
    } else if (node.nodeType === 1 && !node.classList.contains('reveal-char')) {
      Array.from(node.childNodes).forEach(walk);
    }
  };
  walk(el);
}

// ============ TYPING REVEAL — TITLES ============
gsap.utils.toArray('.section-title, .about-title, .contact-title, .step-content h4').forEach(title => {
  splitIntoChars(title);
  const chars = title.querySelectorAll('.reveal-char');
  gsap.set(chars, { opacity: 0, filter: 'blur(6px)', y: 8 });
  gsap.to(chars, {
    scrollTrigger: {
      trigger: title,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    duration: 0.5,
    ease: 'power2.out',
    stagger: { each: 0.018, from: 'start' },
  });
});

// ============ TYPING REVEAL — PARAGRAPHS ============
gsap.utils.toArray('.section-sub, .about-text, .contact-sub, .project-desc, .service-card p, .step-content p').forEach(el => {
  splitIntoChars(el);
  const chars = el.querySelectorAll('.reveal-char');
  gsap.set(chars, { opacity: 0, filter: 'blur(4px)' });
  gsap.to(chars, {
    scrollTrigger: {
      trigger: el,
      start: 'top 92%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.4,
    ease: 'power2.out',
    stagger: { each: 0.008, from: 'start' },
  });
});

gsap.utils.toArray('.section-eyebrow').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
    opacity: 0,
    x: -30,
    filter: 'blur(6px)',
    duration: 1,
    ease: 'expo.out',
  });
});

// ============ PROJECTS PARALLAX & REVEAL ============
gsap.utils.toArray('.project').forEach((project, i) => {
  gsap.from(project, {
    scrollTrigger: {
      trigger: project,
      start: 'top 90%',
    },
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'expo.out',
    delay: (i % 2) * 0.1,
  });
});

// ============ SERVICES CARDS - MOUSE LIGHT ============
document.querySelectorAll('.service-card').forEach(card => {
  const color = card.dataset.color || '#E85A4F';
  card.style.setProperty('--card-color', color);
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${mx}%`);
    card.style.setProperty('--my', `${my}%`);
  });
});

gsap.utils.toArray('.service-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 88%' },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'expo.out',
    delay: i * 0.08,
  });
});

// ============ PROCESS STEPS ============
gsap.utils.toArray('.process-step').forEach((step, i) => {
  gsap.from(step, {
    scrollTrigger: { trigger: step, start: 'top 88%' },
    x: -40,
    opacity: 0,
    duration: 1,
    ease: 'expo.out',
    delay: i * 0.1,
  });
});

// ============ STATS COUNTER ============
gsap.utils.toArray('.stat-num[data-target]').forEach(el => {
  const target = parseInt(el.dataset.target);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.floor(obj.val); }
      });
    }
  });
});

gsap.utils.toArray('.stat').forEach((stat, i) => {
  gsap.from(stat, {
    scrollTrigger: { trigger: stat, start: 'top 88%' },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'expo.out',
    delay: i * 0.08,
  });
});

// ============ FOOTER TIME ============
function updateTime() {
  const now = new Date();
  const opts = { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const time = now.toLocaleTimeString('fr-FR', opts);
  const el = document.getElementById('footer-time');
  if (el) el.textContent = `${time} CET · Nancy`;
}
updateTime();
setInterval(updateTime, 1000);

// ============ FOOTER MEGA PARALLAX ============
gsap.to('.footer-mega', {
  scrollTrigger: {
    trigger: '.footer',
    start: 'top bottom',
    end: 'bottom bottom',
    scrub: 1,
  },
  y: -50,
  scale: 1.05,
});

// ============ HERO TITLE PARALLAX ON SCROLL ============
gsap.to('.hero-title', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
  y: 100,
  opacity: 0.3,
});

gsap.to('.hero-bg img', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
  yPercent: 15,
  scale: 1.05,
});

// ============ MAGNETIC BUTTONS ============
document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.15, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
});

// ============ SMOOTH ANCHOR LINKS ============
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    }
  });
});
