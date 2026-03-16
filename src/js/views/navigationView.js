class NavigationView {
  _topbarNav = document.querySelector('.topbar__nav');
  _sidebarNav = document.querySelector('.sidebar');

  handleActive(parent, itemClass) {
    parent.addEventListener('click', e => {
      const btn = e.target.closest(itemClass);
      if (!btn) return;

      // remove active from all
      parent
        .querySelectorAll(itemClass)
        .forEach(link => link.classList.remove('active'));

      // add active to clicked
      btn.classList.add('active');
    });
  }

  initNavigation() {
    this.handleActive(this._topbarNav, '.nav__link');
    this.handleActive(this._sidebarNav, '.menu__item');
  }

  addHandleCategory(handler) {
    this._topbarNav.addEventListener('click', e => {
      const btn = e.target.closest('.nav__link');
      if (!btn) return;

      const type = btn.dataset.type;
      handler(type);
    });
  }
}

export default new NavigationView();
