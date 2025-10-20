const mob = /iPhone|iPad|Android/i.test(navigator.userAgent);
if (!mob && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const els = document.querySelectorAll('.panel .inner');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if (e.isIntersecting) e.target.setAttribute('data-parallax','');
      else e.target.removeAttribute('data-parallax');
    });
  }, {threshold: [0,1]});
  els.forEach(el=>io.observe(el));

  window.addEventListener('scroll', ()=>{
    els.forEach(el=>{
      if (!el.hasAttribute('data-parallax')) return;
      const rect = el.closest('.panel').getBoundingClientRect();
      const mid = rect.top + rect.height/2 - window.innerHeight/2;
      el.style.setProperty('--shift', (mid * -0.1).toFixed(1)+'px'); // עדין: 0.1
    });
  }, {passive:true});
}
