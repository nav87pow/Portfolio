document.addEventListener('DOMContentLoaded', () => {
  // open and close the project navigtion
     const btn = document.querySelector('.btn_projects');
  const nav = document.querySelector('.nav_projects');

  if (btn && nav) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      nav.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('show')) return;
      const clickedInside = nav.contains(e.target) || btn.contains(e.target);
      if (!clickedInside) nav.classList.remove('show');
    });
  }

  // fill the navigation according to the projects in the json file 
  fetch('./project.json', { cache: 'no-store' }) 
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load projects.json');
      return res.json();
    })
    .then((data) => {
      const container = document.querySelector('.nav_projects');
      if (!container) return;

      container.innerHTML = '';

      const projects = (data.projects || [])
        .filter(p => p?.home?.show !== false)
        .sort((a, b) => (a?.home?.order ?? 9999) - (b?.home?.order ?? 9999));

      projects.forEach((p) => {
        const a = document.createElement('a');
        a.textContent = p.nav_title || p.title || p.id;
        a.href = `project.html?project=${encodeURIComponent(p.id)}`;
        a.className = 'nav_project_link';
        container.appendChild(a);
      });
    })
    .catch((err) => {
      console.error(err);
    });
});