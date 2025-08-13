
document.addEventListener('DOMContentLoaded', () => {
  const pid = new URL(location.href).searchParams.get('project'); // url for the chosen project
  if (!pid) return;

  fetch('./project.json', { cache: 'no-store' }) //get the jason file and check if there is data +clean cache 
    .then(res => {
      if (!res.ok) throw new Error('Failed to load projects.json');
      return res.json();
    })

    //r the url and the project the same 
    .then(data => {
      const project = (data.projects || []).find(p => p.id === pid);
      if (!project) {
        console.warn('Project not found:', pid);
        return;
      }

      // ---- Header 
      const h1 = document.querySelector('main.project_page article header h1');
      if (h1) h1.textContent = project.title || project.nav_title || project.id;

      const setList = (sel, items) => {
        const ul = document.querySelector(sel);
        if (!ul) return;
        ul.innerHTML = '';
        (items || []).forEach(txt => {
          const li = document.createElement('li');
          li.textContent = txt;
          ul.appendChild(li);
        });
      };
      setList('ul.tool_dev_tags', project.dev_tools || []);
      setList('ul.tool_design_tags', project.design_tools || []);

      const aSite = document.querySelector('a.project_link');
      if (aSite) {
        const url = project?.links?.site;
        if (url) {
          aSite.href = url;
          aSite.textContent = url.replace(/^https?:\/\//, '');
          aSite.style.display = '';
        } else {
          aSite.removeAttribute('href');
          aSite.textContent = '';
          aSite.style.display = 'none';
        }
      }

      // ---- short_description + roll + challenge
      const h2 = document.querySelector('.short_description h2');
      if (h2) h2.textContent = project?.short_description?.heading || '';

      const sdDl = document.querySelector('.short_description dl');
      if (sdDl) {
        const dds = Array.from(sdDl.querySelectorAll('dd'));
        if (dds[0]) dds[0].textContent = project?.short_description?.role || '';
        if (dds[1]) dds[1].textContent = project?.short_description?.challenge || '';
      }

      // ---- process_solution - returns based on the number of points in the json file
      const psSection = document.querySelector('.process_solution');
      if (psSection) {
        let dl = psSection.querySelector('dl');
        if (!dl) {
          dl = document.createElement('dl');
          psSection.appendChild(dl);
        }
        dl.innerHTML = '';
        (project.process_solution || []).forEach(({ title, text }) => {
          if (title) {
            const dt = document.createElement('dt');
            dt.textContent = title;
            dl.appendChild(dt);
          }
          if (text) {
            const dd = document.createElement('dd');
            dd.textContent = text;
            dl.appendChild(dd);
          }
        });
      }

      // ---- visual_presentation - figure by the typ of layout (img/gallery/palette/web preview/typ)
      const visualsWrap = document.querySelector('.visual_presentation .visuals');
      if (visualsWrap) {
        visualsWrap.innerHTML = '';

        (project.visual_presentation || []).forEach(v => {
          if (!v || !v.type) return;

          //create the figure if needed by the right layout
          const figure = document.createElement('figure');
          const holder = document.createElement('div');

          let holderClass = 'vis';
          switch (v.type) {
            case 'img':      holderClass += ' vis_img'; break;
            case 'gallery':  holderClass += ' vis_gallery'; break;
            case 'palette':  holderClass += ' vis_palette'; break;
            case 'type':     holderClass += ' vis_type'; break;
            case 'web_img':  holderClass += ' vis_img web'; break;
            default:         holderClass += ' vis_img';
          }
          holder.className = holderClass;

          let addedContent = false; 

          if (v.type === 'img' || v.type === 'web_img') {
            if (v.src) {
              const img = document.createElement('img');
              img.src = v.src;
              if (v.alt) img.alt = v.alt;
              holder.appendChild(img);
              addedContent = true;
            }
          } else if (v.type === 'gallery') {
            (v.images || []).forEach(({ src, alt }) => {
              if (!src) return;
              const img = document.createElement('img');
              img.src = src;
              if (alt) img.alt = alt;
              holder.appendChild(img);
              addedContent = true;
            });
          } else if (v.type === 'palette') {
            (v.colors || []).forEach(c => {
              const hasAny =
                (c && (c.name || c.hex || c.text || (c.outline != null && String(c.outline).trim() !== '')));
              if (!hasAny) return;

              const div = document.createElement('div');
              div.className = 'color_tag';
              div.textContent = c.name || c.hex || '';

              if (c.hex) div.style.background = c.hex;
              if (c.text) div.style.color = c.text;

              div.style.border = 'none';
              if (c.outline != null && String(c.outline).trim() !== '') {
                div.style.border = '1px solid var(--light-gray-blue)';
              }

              holder.appendChild(div);
              addedContent = true;
            });
          } else if (v.type === 'type') {
            // if the font exists show if an image show the img 
            const hasName = !!(v.font_name && String(v.font_name).trim() !== '');
            const isImage = (v.source === 'image' && v.image);
            const hasTextSample = !!(v.sample_text && String(v.sample_text).trim() !== '');

            if (hasName || isImage || hasTextSample || v.font_family) {
              // font_name
              if (hasName) {
                const name = document.createElement('div');
                name.className = 'font_name';
                name.textContent = v.font_name;
                holder.appendChild(name);
              }

              // font_example
              const sample = document.createElement('div');
              sample.className = 'font_example';

              if (isImage) {
                sample.innerHTML = `<img src="${v.image}" alt="${v.font_name || 'font sample'}">`;
              } else {
                sample.textContent = v.sample_text || 'Aa Bb Cc אבג';
                if (v.font_family) {
                  sample.style.fontFamily = v.font_family; // מוחל רק על הדוגמה
                } else {
                  sample.style.removeProperty('font-family');
                }
              }

              holder.appendChild(sample);
              addedContent = true;
            }
          }

          // if there aren't any don't show at all
          if (addedContent) {
            figure.appendChild(holder);
            if (v.figcaption) {
              const cap = document.createElement('figcaption');
              cap.textContent = v.figcaption;
              figure.appendChild(cap);
            }
            visualsWrap.appendChild(figure);
          }
        });
      }

      // ---- finish_line
      const pFinish = document.querySelector('.finish_line p');
      if (pFinish) pFinish.textContent = project.finish_line || '';
    })
    .catch(err => console.error(err));
});
