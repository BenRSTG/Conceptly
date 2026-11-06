/**
 * Kleine Bedienhilfen für die Kopfzeile: Escape schließt offene
 * <details>-Menüs (mobiles Menü, Dropdowns, Suche), ein Klick außerhalb
 * schließt sie ebenfalls. Die eigentliche Auf/Zu-Logik übernimmt das
 * native <details>-Element, hier kommt nur Komfort/Barrierefreiheit dazu.
 */
(() => {
  function closeAllExcept(except) {
    document.querySelectorAll('header details[open]').forEach((node) => {
      if (node !== except) node.removeAttribute('open');
    });
  }

  document.addEventListener('click', (event) => {
    const openDetails = document.querySelectorAll('header details[open]');
    openDetails.forEach((node) => {
      if (!node.contains(event.target)) node.removeAttribute('open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openDetails = document.querySelector('header details[open]');
    if (!openDetails) return;
    const summary = openDetails.querySelector('summary');
    openDetails.removeAttribute('open');
    if (summary) summary.focus();
  });

  document.querySelectorAll('header details > summary').forEach((summary) => {
    summary.addEventListener('click', () => {
      const parent = summary.parentElement;
      // Beim Öffnen alle anderen Menüs schließen (z. B. Suche schließt Nav-Dropdown).
      requestAnimationFrame(() => {
        if (parent.hasAttribute('open')) closeAllExcept(parent);
      });
    });
  });

  // Mobiles Hauptmenü: einfacher Button-Toggle statt <details>, damit es per
  // CSS-Media-Query auf Desktop-Breite zuverlässig immer offen sein kann.
  document.querySelectorAll('[data-nav-toggle]').forEach((button) => {
    const nav = document.getElementById(button.getAttribute('aria-controls'));
    if (!nav) return;
    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
    });
  });
})();
