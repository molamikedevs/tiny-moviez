import View from './view.js';

// I export the class itself, not an instance, so child classes can extend it
export default class WidgetsView extends View {
  _currentPage = 0;
  // _itemsPerPage, _widgetContainer, _itemLabel, and _generateItemMarkup
  // will be provided by the child classes!

  _generateMarkup() {
    const start = this._currentPage * this._itemsPerPage;
    const end = start + this._itemsPerPage;

    // Update the UI text right before mapping
    this._updatePaginationText();

    // Slices the data and uses the specific HTML function provided by the child
    return this._data
      .slice(start, end)
      .map(item => this._generateItemMarkup(item))
      .join('');
  }

  _updatePaginationText() {
    const pageInfo = this._widgetContainer?.querySelector('.widget__page-info');
    const totalInfo = this._widgetContainer?.querySelector('.widget__total');

    if (pageInfo) {
      pageInfo.textContent = `Page ${this._currentPage + 1}`;
    }

    if (totalInfo) {
      const start = this._currentPage * this._itemsPerPage + 1;
      const end = Math.min(
        (this._currentPage + 1) * this._itemsPerPage,
        this._data.length,
      );
      totalInfo.textContent = `Showing ${start}-${end} of ${this._data.length} ${this._itemLabel}`;
    }
  }

  addHandlerPagination() {
    if (!this._widgetContainer) return;

    this._widgetContainer.addEventListener('click', e => {
      const btn = e.target.closest('.widget__btn');
      if (!btn) return;

      const maxPage = Math.ceil(this._data.length / this._itemsPerPage) - 1;

      if (btn.dataset.direction === 'next') {
        this._currentPage++;
        if (this._currentPage > maxPage) this._currentPage = 0;
      }

      if (btn.dataset.direction === 'prev') {
        this._currentPage--;
        if (this._currentPage < 0) this._currentPage = maxPage;
      }

      // Triggers the standard render method inherited from the base View
      this.render(this._data);
    });
  }
}
