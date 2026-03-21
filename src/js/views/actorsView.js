import { createActorItem } from './viewComponents/sidebarComponents.js';
import WidgetView from './widgetsView.js';

class ActorsView extends WidgetView {
  // 1. Define the specifics for this widget
  _parentElement = document.querySelector('.actors__list');
  _widgetContainer = document.querySelector('[data-widget="actors"]');
  _errorMessage = 'Failed to load actors';

  _itemsPerPage = 4;
  _itemLabel = 'Popular Actors';

  // 2. Tell the parent which HTML template to use
  _generateItemMarkup(actor) {
    return createActorItem(actor);
  }
}

export default new ActorsView();
