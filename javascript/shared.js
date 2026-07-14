document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initNavScroll();
  initFaqAccordion();
  initScrollReveal();
});

/* === Navigation scroll state === */

/**
 * Toggles the navigation's solid background once the page is scrolled
 * away from the top, so it stays legible over the light hero and content.
 */
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* === Mobile navigation (hamburger) === */

/**
 * Closes the mobile navigation menu.
 */
function closeMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger?.classList.remove('open');
  navLinks?.classList.remove('open');
}

/**
 * Wires up the hamburger button to toggle the mobile navigation
 * and closes the menu whenever a navigation link is clicked.
 */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
}

/* === FAQ accordion === */

/**
 * Toggles a single FAQ item's expanded state via its aria-expanded attribute.
 * @param {HTMLButtonElement} button - The FAQ question button
 */
function toggleFaqItem(button) {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
}

/**
 * Wires up all FAQ question buttons to behave as an accordion.
 */
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => toggleFaqItem(button));
  });
}

/* === Scroll reveal animations === */

/**
 * Adds the reveal base class to every main section except the hero.
 */
function assignRevealClasses() {
  document.querySelectorAll('main > section:not(.hero)').forEach(section => {
    section.classList.add('reveal');
  });
}

/**
 * Creates an IntersectionObserver that reveals elements as they enter the viewport.
 * @returns {IntersectionObserver} The configured observer instance
 */
function createRevealObserver() {
  return new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
}

/**
 * Reveals every element immediately as a fallback when scroll observation
 * is unavailable, so content is never left permanently hidden.
 */
function revealAll() {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
}

/**
 * Assigns reveal classes and observes the elements for scroll-triggered animation.
 * Falls back to revealing everything if IntersectionObserver is unsupported.
 */
function initScrollReveal() {
  assignRevealClasses();
  if (!('IntersectionObserver' in window)) return revealAll();
  const observer = createRevealObserver();
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
