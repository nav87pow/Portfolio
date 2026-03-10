document.addEventListener('DOMContentLoaded', () => {
  const targets = Array.from(document.querySelectorAll('.text_blue_bg'))
    // Skip h2 spans: they should be static (no animation).
    .filter((el) => !el.closest('h2'))
    .map((el) => {
      const trigger = el.closest('h1, h3') || el;
      return { el, trigger };
    });
  if (!targets.length) return;

  let ticking = false;
  const update = (initial = false) => {
    const triggerY = window.innerHeight * 0.2;
    targets.forEach(({ el, trigger }) => {
      const rect = trigger.getBoundingClientRect();
      const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;

      if (initial) {
        el.classList.toggle('is-active', inViewport);
        return;
      }

      // Reset to base when the element is above the 20% line
      // or completely below the viewport.
      if (rect.bottom < triggerY || rect.top > window.innerHeight) {
        el.classList.remove('is-active');
        return;
      }

      // Once it is visible again, activate (play once) and keep it on.
      if (inViewport) {
        el.classList.add('is-active');
      }
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => update(false));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', () => update(true));
  update(true);
});
