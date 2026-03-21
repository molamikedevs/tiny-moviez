import { createTheaterItem } from './viewComponents/sidebarComponents.js';
import WidgetView from './widgetsView.js';

class TheatersView extends WidgetView {
  // 1. Define the specifics for this widget
  _parentElement = document.querySelector('.theaters__list');
  _widgetContainer = document.querySelector('[data-widget="theaters"]');
  _errorMessage = 'Failed to load theaters movies';

  _itemsPerPage = 4;
  _itemLabel = 'in theaters';

  // 2. Tell the parent which HTML template to use
  _generateItemMarkup(movie) {
    return createTheaterItem(movie);
  }
}

export default new TheatersView();
