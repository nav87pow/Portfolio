document.addEventListener('DOMContentLoaded', () => {
  const btnProjects = document.querySelector('.btn_projects');
  const navProjects = document.querySelector('.nav_projects');

  btnProjects.addEventListener('click', (e) => {
    e.preventDefault();

    if (navProjects.classList.contains('show')) {
      navProjects.classList.remove('show'); // סגור
    } else {
      navProjects.classList.add('show'); // פתח
    }
  });
});
