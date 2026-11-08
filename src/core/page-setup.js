import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import { applyCalmMode } from './calm-mode.js';
import { renderNav } from './nav.js';
import { renderFooterNext } from './footer-next.js';

export function setupPage() {
  const pageId = document.body.dataset.page;
  applyCalmMode();
  renderNav(pageId);
  renderFooterNext(pageId);
}
