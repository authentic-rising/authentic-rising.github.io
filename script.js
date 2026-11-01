// Navigation remains available if JavaScript is disabled.
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

if (header && toggle && navigation) {
  header.classList.add('menu-enabled');
  toggle.hidden = false;
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
