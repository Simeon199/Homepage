document.addEventListener('DOMContentLoaded', initPage);

/**
 * Bootstraps all interactive page behaviors once the DOM is ready.
 */
function initPage() {
  updateYearSpans();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  initReveal(prefersReducedMotion);
  initCounters(prefersReducedMotion);
  if (!prefersReducedMotion) initParallax();
}

/**
 * Fills every [data-year] element with the current year.
 */
function updateYearSpans() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/**
 * Fades and lifts .reveal / .reveal-group elements into view as they scroll into the viewport.
 * @param {boolean} prefersReducedMotion - Whether the user prefers reduced motion.
 */
function initReveal(prefersReducedMotion) {
  const revealEls = document.querySelectorAll('.reveal, .reveal-group');
  if (!revealEls.length) return;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(handleRevealIntersections, {
    threshold: .15,
    rootMargin: '0px 0px -60px 0px',
  });
  revealEls.forEach(el => io.observe(el));
}

/**
 * IntersectionObserver callback that reveals an element once it enters the viewport.
 * @param {IntersectionObserverEntry[]} entries - Observed intersection entries.
 * @param {IntersectionObserver} observer - The observer instance, used to stop observing once revealed.
 */
function handleRevealIntersections(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}

/**
 * Animates a counter element's numeric text from 0 up to its target value.
 * @param {HTMLElement} el - Element whose text content starts with a number to animate.
 */
function animateCounter(el) {
  const match = el.textContent.match(/^(\d+)(.*)$/);
  if (!match) return;
  const target = parseInt(match[1], 10);
  const suffix = match[2] || '';
  const start = performance.now();
  const duration = 900;
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * IntersectionObserver callback that starts a counter's count-up animation once visible.
 * @param {IntersectionObserverEntry[]} entries - Observed intersection entries.
 * @param {IntersectionObserver} observer - The observer instance, used to stop observing once animated.
 */
function handleCounterIntersections(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}

/**
 * Observes .proofbar counters and triggers their count-up animation once visible.
 * @param {boolean} prefersReducedMotion - Whether the user prefers reduced motion.
 */
function initCounters(prefersReducedMotion) {
  const counters = document.querySelectorAll('.proofbar b');
  if (!counters.length) return;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(handleCounterIntersections, { threshold: .6 });
  counters.forEach(el => io.observe(el));
}

/**
 * Applies a parallax vertical offset to one element based on its position in the viewport.
 * @param {HTMLElement} el - Element with a data-parallax speed factor.
 */
function updateParallaxElement(el) {
  const rect = el.getBoundingClientRect();
  const speed = parseFloat(el.dataset.parallax) || 0.12;
  const center = rect.top + rect.height / 2 - window.innerHeight / 2;
  el.style.transform = `translateY(${(center * speed).toFixed(1)}px) scale(1.12)`;
}

/**
 * Enables a scroll-driven parallax effect on every [data-parallax] element.
 */
function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  let ticking = false;
  const update = () => {
    els.forEach(updateParallaxElement);
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    requestAnimationFrame(update);
    ticking = true;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}
