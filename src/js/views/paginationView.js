import View from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandleClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.pagination__btn');
      if (!btn) return;

      const page = +btn.dataset.goto;
      handler(page);
    });
  }

  paginationRenderer(page, totalPages) {
    const markup = this._generateMarkup(page, totalPages);
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup(page, totalPages) {
    let buttons = '';

    if (page > 1) {
      buttons += `
      <button class="pagination__btn pagination__btn--prev" data-goto="${page - 1}">
        ← Prev
      </button>
      `;
    }

    buttons += `<span class="pagination__page">${page} / ${totalPages}</span>`;

    if (page < totalPages) {
      buttons += `
      <button class="pagination__btn pagination__btn--next" data-goto="${page + 1}">
        Next →
      </button>
      `;
    }

    return buttons;
  }
}

export default new PaginationView();
