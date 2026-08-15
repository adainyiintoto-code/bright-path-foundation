document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('[data-menu]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const closeBtn = document.querySelector('[data-close-menu-btn]');
  if (menuBtn && mobileMenu) menuBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
  if (closeBtn && mobileMenu) closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
  document.querySelectorAll('[data-close-menu]').forEach(el => {
    el.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // impact counters (signature interaction)
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.countTo, 10);
        const suffix = el.dataset.suffix || '';
        if (reduceMotion) {
          el.textContent = target.toLocaleString() + suffix;
        } else {
          let start = 0;
          const duration = 1400;
          const startTime = performance.now();
          function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        countIo.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => countIo.observe(el));
  }
});
