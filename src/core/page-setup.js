import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/content.css';
import '../styles/preloader.css';
import '../styles/polish.css';
import { applyCalmMode } from './calm-mode.js';
import { renderNav } from './nav.js';
import { renderFooterNext } from './footer-next.js';
import { runPreloader } from './preloader.js';
import { setupTextReveal } from './text-reveal.js';
import { setupPageIntro } from './page-intro.js';
import { setupCursor } from './cursor.js';
import { setupMagnetic } from './magnetic.js';
import { applyCssSettings } from './settings.js';
import { setupDebug } from './debug.js';

export function setupPage() {
  const pageId = document.body.dataset.page;
  applyCalmMode();
  applyCssSettings();
  renderNav(pageId);
  renderFooterNext(pageId);
  runPreloader().then(() => {
    setupTextReveal();
    setupPageIntro();
  });
  setupCursor();
  setupMagnetic();
  setupDebug();
}
