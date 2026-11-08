import pages from '../data/pages.json';
import { isCalmMode, setCalmMode } from './calm-mode.js';
import { createSoundToggle } from './ambient-sound.js';

function createLink(page, currentId) {
  const item = document.createElement('li');
  const link = document.createElement('a');
  link.className = 'nav__link';
  link.href = `/${page.file}`;
  link.textContent = page.label;
  if (page.id === currentId) {
    link.classList.add('nav__link--active');
    link.setAttribute('aria-current', 'page');
  }
  item.append(link);
  return item;
}

function createCalmToggle() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'toggle';
  button.innerHTML = '<span class="toggle__dot" aria-hidden="true"></span>Mode Tenang';
  button.setAttribute('aria-pressed', String(isCalmMode()));
  button.addEventListener('click', () => {
    const next = !isCalmMode();
    setCalmMode(next);
    button.setAttribute('aria-pressed', String(next));
  });
  return button;
}

function createMenuButton(nav) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'toggle nav__menu-button';
  button.textContent = 'Menu';
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('nav--open');
    button.setAttribute('aria-expanded', String(open));
  });
  return button;
}

export function renderNav(currentId) {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.setAttribute('aria-label', 'Navigasi utama');

  const logo = document.createElement('a');
  logo.className = 'nav__logo';
  logo.href = '/index.html';
  logo.textContent = 'SEL';

  const list = document.createElement('ul');
  list.className = 'nav__links';
  pages.forEach((page) => list.append(createLink(page, currentId)));

  nav.append(logo, createMenuButton(nav), list, createSoundToggle(), createCalmToggle());

  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link';
  skipLink.href = '#main';
  skipLink.textContent = 'Langsung ke isi';

  document.body.prepend(skipLink, nav);
}
