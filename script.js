/* =========================================================
   Plumblink Works — Interactive JS
   Features:
     1. Sticky header + scroll effect
     2. Active nav highlighting via IntersectionObserver
     3. Mobile hamburger menu
     4. Scroll-triggered animations (data-animate)
     5. Contact form AJAX submission via Formspree
   ========================================================= */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1. Sticky header — add .scrolled class on scroll
  ---------------------------------------------------------- */
  const header = document.querySelector('.site-header');

  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ----------------------------------------------------------
     2. Active nav link highlighting
  ---------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + entry.target.id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ----------------------------------------------------------
     3. Mobile hamburger menu
  ---------------------------------------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.classList.toggle('is-open', isOpen);
    });

    // Close menu when a nav link is clicked
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-open');
      });
    });
  }

  /* ----------------------------------------------------------
     4. Scroll-triggered animations
  ---------------------------------------------------------- */
  const animatables = document.querySelectorAll('[data-animate]');

  if (prefersReducedMotion) {
    // Skip animation; show everything immediately
    animatables.forEach((el) => el.classList.add('animate-in'));
  } else {
    // Assign stagger delays to siblings within the same grid/list parent
    const staggerParents = document.querySelectorAll(
      '.services-grid, .process-grid, .feature-list, .hero-stats, .showcase'
    );

    staggerParents.forEach((parent) => {
      const children = parent.querySelectorAll('[data-animate]');
      children.forEach((child, i) => {
        child.style.setProperty('--delay', i * 90 + 'ms');
      });
    });

    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            animObserver.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.1 }
    );

    animatables.forEach((el) => animObserver.observe(el));

    // Hero elements — trigger after a brief delay so animation is visible
    const heroAnimatables = document.querySelectorAll('.hero [data-animate], .hero-stats [data-animate]');
    setTimeout(() => {
      heroAnimatables.forEach((el) => el.classList.add('animate-in'));
    }, 120);
  }

  /* ----------------------------------------------------------
     5. Contact form — AJAX submission via Formspree
  ---------------------------------------------------------- */
  const form = document.getElementById('contact-form');

  if (form) {
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      if (successMsg) successMsg.hidden = true;
      if (errorMsg) errorMsg.hidden = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          form.reset();
          if (successMsg) successMsg.hidden = false;
          submitBtn.textContent = 'Sent!';
        } else {
          throw new Error('Server error');
        }
      } catch {
        if (errorMsg) errorMsg.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry';
      }
    });
  }
})();
