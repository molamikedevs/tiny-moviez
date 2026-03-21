import { createUpcomingItem } from './viewComponents/sidebarComponents.js';
import WidgetView from './widgetsView.js';

class UpcomingView extends WidgetView {
  // 1. Define the specifics for this widget
  _parentElement = document.querySelector('.upcoming__list');
  _widgetContainer = document.querySelector('[data-widget="upcoming"]');
  _errorMessage = 'Failed to load upcoming movies';

  _itemsPerPage = 4;
  _itemLabel = 'upcoming movies';

  // 2. Tell the parent which HTML template to use
  _generateItemMarkup(movie) {
    return createUpcomingItem(movie);
  }
}

export default new UpcomingView();
