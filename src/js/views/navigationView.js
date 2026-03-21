class NavigationView {
  _topbarNav = document.querySelector('.topbar__nav');
  _sidebarNav = document.querySelector('.sidebar');

  //Syncs active state across the entire app
  setGlobalActive(type) {
    // 1. Remove active class from ALL navigation links
    const allLinks = document.querySelectorAll('.nav__link, .menu__item');
    allLinks.forEach(link => link.classList.remove('active'));

    // 2. Add active class to ANY link that matches the current type
    const matchingLinks = document.querySelectorAll(`[data-type="${type}"]`);
    matchingLinks.forEach(link => link.classList.add('active'));
  }

  addHandleCategory(handler) {
    this._topbarNav.addEventListener('click', e => {
      const btn = e.target.closest('.nav__link');
      if (!btn) return;

      const type = btn.dataset.type;
      handler(type);
    });
  }

  addHandleSidebar(handler) {
    this._sidebarNav.addEventListener('click', e => {
      const btn = e.target.closest('.menu__item');
      if (!btn) return;

      const type = btn.dataset.type;

      handler(type);
    });
  }
}

export default new NavigationView();
