/**
 * Minimale Merkliste auf Basis von localStorage, kein Server/App nötig.
 * Wird vom Herz-Icon im Header (Zähler) sowie später von
 * "Merken"-Buttons auf Produktkarten/-seiten genutzt (Schritt 5).
 */
(() => {
  const STORAGE_KEY = 'conceptly:wishlist';

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function write(ids) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      // localStorage nicht verfügbar (z. B. privater Modus) — Merkliste
      // funktioniert dann für diese Sitzung einfach nicht, kein Crash.
    }
    document.dispatchEvent(new CustomEvent('wishlist:change', { detail: { ids } }));
  }

  function has(id) {
    return read().includes(String(id));
  }

  function add(id) {
    const ids = read();
    if (!ids.includes(String(id))) {
      ids.push(String(id));
      write(ids);
    }
  }

  function remove(id) {
    write(read().filter((existingId) => existingId !== String(id)));
  }

  function toggle(id) {
    has(id) ? remove(id) : add(id);
    return has(id);
  }

  function count() {
    return read().length;
  }

  function updateBadges() {
    const total = count();
    document.querySelectorAll('[data-wishlist-count]').forEach((badge) => {
      badge.textContent = total > 0 ? total : '';
      badge.hidden = total === 0;
    });
  }

  document.addEventListener('wishlist:change', updateBadges);
  document.addEventListener('DOMContentLoaded', updateBadges);

  window.conceptlyWishlist = { has, add, remove, toggle, count };
})();
