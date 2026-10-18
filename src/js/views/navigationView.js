import icons from 'url:../../img/icons.svg';

class NavigationView {
  _topbarNav = document.querySelector('.topbar__nav');
  _sidebarNav = document.querySelector('.sidebar');
  _moreBtn = document.querySelector('#btn-mobile-more');
  _moreBtnSpan = document.querySelector('#btn-mobile-more span');
  _moreBtnIcon = document.querySelector('#btn-mobile-more .menu__icon use');

  //Syncs active state across the entire app
  setGlobalActive(type) {
    // Only navigation buttons: cards and the hero also carry data-type
    const allLinks = document.querySelectorAll('.nav__link, .menu__item');

    allLinks.forEach(link => {
      const isActive = link.dataset.type === type;
      link.classList.toggle('active', isActive);

      // Tells screen readers which page is showing
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  toggleMobileMenu() {
    this._sidebarNav.classList.toggle('expanded');

    const isExpanded = this._sidebarNav.classList.contains('expanded');
    this._moreBtn?.setAttribute('aria-expanded', String(isExpanded));

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
    this._moreBtn?.setAttribute('aria-expanded', 'false');

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
