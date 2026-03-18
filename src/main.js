// ===================================
// THE DRAFT ROOM — Main JavaScript
// Navbar, Carousel, Scroll Animations, Particles, Counters
// ===================================

import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  // initHeroCarousel();
  initPreloader();
  initScrollReveal();
  initHeroAnimation();
  initHeroParticles();
  initSmoothScroll();
  initMobileNav();
  initCounterAnimation();
  highlightTodaySpecial();
  initMagneticButtons();
});

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  const content = document.getElementById('preloader-content');
  let count = 0;
  
  // Quick fake progress loop
  const interval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(interval);
      return;
    }
    if (count < 99) {
      count += Math.floor(Math.random() * 5) + 1;
      if (count > 99) count = 99;
      if (bar) bar.style.width = count + '%';
    }
  }, 25);
  
  // Real finish
  window.addEventListener('load', () => {
    clearInterval(interval);
    if (bar) bar.style.width = '100%';
    
    setTimeout(() => {
      if (preloader) {
        // Step 1: Fade out the logo and loading bar
        if (content) content.style.opacity = '0';
        
        // Step 2: Slide the shutter panels open
        setTimeout(() => {
          preloader.classList.add('finished');
          
          // Trigger hero slide up animation
          const hero = document.querySelector('.hero');
          if (hero) hero.classList.add('hero-animate'); 
          
          // Clean up DOM layer so clicks pass completely safely below
          setTimeout(() => preloader.style.display = 'none', 1800);
        }, 800); // Wait for logo to fade out (slower)
      }
    }, 400); // Small pause at 100% completion
  });
}

// --- Navbar scroll effect ---
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Update active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const updateActiveLink = () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

// --- Hero Carousel ---
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');

  if (!slides.length) return;

  let current = 0;
  let autoTimer = null;
  const INTERVAL = 6000;

  function goTo(index) {
    // Clean up all
    slides.forEach((s) => s.classList.remove('active'));
    indicators.forEach((i) => i.classList.remove('active'));

    current = ((index % slides.length) + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (indicators[current]) indicators[current].classList.add('active');
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  // Arrow buttons
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  // Indicator clicks
  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      const idx = parseInt(indicator.dataset.slide, 10);
      goTo(idx);
      startAuto();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
        startAuto();
      }
    }, { passive: true });
  }

  // Start auto-advance
  startAuto();
}

// --- Scroll Reveal (IntersectionObserver) ---
function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children, .text-mask'
  );
  revealElements.forEach((el) => observer.observe(el));
}

// --- Hero entrance animation ---
function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  setTimeout(() => {
    hero.classList.add('hero-animate');
  }, 100);
}

// --- Floating Gold Particles ---
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const left = Math.random() * 100;
    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * 10;

    particle.style.left = `${left}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.filter = `blur(${Math.random() > 0.5 ? 1 : 0}px)`;

    container.appendChild(particle);
  }
}

// --- Smooth scroll for anchor links ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });

        closeMobileNav();
      }
    });
  });
}

// --- Mobile Navigation ---
function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.nav-mobile-overlay');
  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });
}

function closeMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.nav-mobile-overlay');
  if (hamburger) hamburger.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// --- Animated Counter ---
function initCounterAnimation() {
  const counters = document.querySelectorAll('.about-stat-number[data-target]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function animateCounter(el, target) {
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current + '+';

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// --- Highlight today's daily special ---
function highlightTodaySpecial() {
  const today = new Date().getDay();
  const todayCard = document.querySelector(`[data-day="${today}"]`);
  if (!todayCard) return;

  todayCard.classList.add('today');

  const badge = document.createElement('div');
  badge.classList.add('today-badge');
  badge.textContent = '✨ TODAY';
  todayCard.appendChild(badge);

  // Scroll the row so today's card is centred
  const row = document.getElementById('daily-specials-grid');
  if (!row) return;
  setTimeout(() => {
    const scrollTo = todayCard.offsetLeft - (row.offsetWidth / 2) + (todayCard.offsetWidth / 2);
    row.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }, 300);
}

// --- Magnetic Buttons ---
function initMagneticButtons() {
  const magnets = document.querySelectorAll('.btn-primary, .btn-outline');
  
  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
      const rect = magnet.getBoundingClientRect();
      const h = rect.width / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - (rect.height / 2);
      
      // Pull button towards mouse
      magnet.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = 'translate(0px, 0px)';
    });
  });
}
