import AppDispatcher from '../dispatchers/AppDispatcher';
import {Constants} from '../constants/Constants';

export default {
  updateResources: (resources) => {
    AppDispatcher.handleServerAction({
      type: Constants.RESOURCE.UPDATE,
      resources: resources
    });
  },
  resourceIsBeingDragged: (resource) => {
    AppDispatcher.handleViewAction({
      type: Constants.RESOURCE.DRAGGED,
      resource: resource
    });
  }

};
