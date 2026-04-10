import icons from 'url:../../img/icons.svg';

class NavigationView {
  _topbarNav = document.querySelector('.topbar__nav');
  _sidebarNav = document.querySelector('.sidebar');
  _moreBtnSpan = document.querySelector('#btn-mobile-more span');
  _moreBtnIcon = document.querySelector('#btn-mobile-more .menu__icon use');

  //Syncs active state across the entire app
  setGlobalActive(type) {
    // 1. Remove active class from ALL navigation links
    const allLinks = document.querySelectorAll('.nav__link, .menu__item');
    allLinks.forEach(link => link.classList.remove('active'));

    // 2. Add active class to ANY link that matches the current type
    const matchingLinks = document.querySelectorAll(`[data-type="${type}"]`);
    matchingLinks.forEach(link => link.classList.add('active'));
  }

  toggleMobileMenu() {
    this._sidebarNav.classList.toggle('expanded');

    const isExpanded = this._sidebarNav.classList.contains('expanded');

    // Swap the Text
    if (this._moreBtnSpan) {
      this._moreBtnSpan.textContent = isExpanded ? 'Close' : 'More';
    }

    // Swap the Icon using your imported 'icons' path!
    if (this._moreBtnIcon) {
      const iconName = isExpanded ? 'cancel-circle' : 'read-more';
      // Inject the imported variable right before the hash
      this._moreBtnIcon.setAttribute('href', `${icons}#icon-${iconName}`);
    }
  }

  closeMobileMenu() {
    this._sidebarNav.classList.remove('expanded');

    // Reset Text
    if (this._moreBtnSpan) {
      this._moreBtnSpan.textContent = 'More';
    }

    // Reset Icon using your imported 'icons' path!
    if (this._moreBtnIcon) {
      this._moreBtnIcon.setAttribute('href', `${icons}#icon-read-more`);
    }
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
