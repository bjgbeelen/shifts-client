import AppDispatcher from '../dispatchers/AppDispatcher';
import {Constants} from '../constants/Constants';
import $ from 'jquery';
import {EventEmitter} from 'events';

class ResourceStore extends EventEmitter {
  onResourcesUpdated(callback) {
    this.on(Constants.RESOURCE.UPDATED, callback);
  }

  onResourceSelectionChange(callback) {
    this.on(Constants.RESOURCE.SELECTION_CHANGED, callback);
  }

  getResource(id) {
    return _resources[id];
  }

  getSelectedResource() {
    return {selectedResource: selectedResource};
  }

  getResources() {
    return {
      resources: Object.keys(_resources)
        .map( k => _resources[k] || {} )
        .sort(sortByName)
    }
  }
};

let _resources = {};
let selectedResource = undefined;
let resourceStore = new ResourceStore();

AppDispatcher.register( payload => {
  const action = payload.action;  

  switch(action.type) {
    case Constants.RESOURCE.UPDATE:
      _resources = action.resources;      
      resourceStore.emit(Constants.RESOURCE.UPDATED);
      break;
    case Constants.RESOURCE.DRAGGED:
      if (selectedResource != action.resource) {
        selectedResource = action.resource;
        resourceStore.emit(Constants.RESOURCE.SELECTION_CHANGED);  
      }      
      break;
  }
});

function sortByName(a, b) {
  if (a.name < b.name)
    return -1;
  else if (a.name > b.name)
    return 1;
  else return 0;
}

export default resourceStore;
