import View from './view';

class SearchView extends View {
  _parentElement = document.querySelector('.topbar__search');
  _input = document.querySelector('.search__input');

  getQuery() {
    const query = this._input.value.trim();
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._input.value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
