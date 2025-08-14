
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('section.projects');
  if (!section) return;


  Array.from(section.querySelectorAll('article.project')).forEach(el => el.remove());

  fetch('./project.json', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('Failed to load projects.json');
      return res.json();
    })
    .then(data => {
      const projects = (data.projects || [])
        .filter(p => p?.home?.show !== false)
        .sort((a, b) => (a?.home?.order ?? 9999) - (b?.home?.order ?? 9999));

   projects.forEach(p => {
  // <article class="project">
  const article = document.createElement('article');
  article.className = 'project';
  const titleId = `p-${p.id}-title`;
  article.setAttribute('aria-labelledby', titleId);


  const link = document.createElement('a');
  link.className = 'project';
  link.href = `project.html?project=${encodeURIComponent(p.id)}`;

  // header 
  const header = document.createElement('header');
  header.style.gridArea = 'title';           // ← מיקום ב-grid
  header.style.display = 'flex';             // לשחזור ה-CSS
  header.style.alignItems = 'baseline';
  header.style.gap = '.75rem';
  header.style.justifyContent = 'flex-start';
  header.style.margin = '3.2vh 0 0';         // כמו ב-CSS שלך (.project > header)

  const spanLink = document.createElement('span');
  spanLink.className = 'project-link';
  spanLink.textContent = '↗';

  const h3 = document.createElement('h3');
  h3.id = titleId;
  h3.textContent = p.title || p.nav_title || p.id;

  header.appendChild(spanLink);
  header.appendChild(h3);
  link.appendChild(header);


  if (p?.home?.tools && p.home.tools.length) {
    const ul = document.createElement('ul');
    ul.className = 'tools';
    ul.style.gridArea = 'tools';             // ← מיקום ב-grid
    ul.style.alignSelf = 'end';              // כמו ב-CSS שלך

    p.home.tools.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });
    link.appendChild(ul);
  }

  // p.summary 
  if (p?.home?.summary) {
    const ps = document.createElement('p');
    ps.className = 'summary';
    ps.style.gridArea = 'desc';              // ← מיקום ב-grid
    ps.textContent = p.home.summary;
    link.appendChild(ps);
  }

  // figure.preview 
  const src = p?.home?.preview?.src;
  if (src) {
    const fig = document.createElement('figure');
    fig.className = 'preview';
    fig.style.gridArea = 'preview';          // ← מיקום ב-grid

    const img = document.createElement('img');
    img.src = src;
    img.alt = p?.home?.preview?.alt || (p.title ? `${p.title} preview` : 'project preview');
    fig.appendChild(img);
    link.appendChild(fig);
  }

  article.appendChild(link);
  section.appendChild(article);
});

    })
    .catch(err => {
      console.error(err);
    });
});
