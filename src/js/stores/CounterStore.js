import AppDispatcher from '../dispatchers/AppDispatcher';
import {Constants} from '../constants/Constants';
import {EventEmitter} from 'events'

class CounterStore extends EventEmitter {
  onCountersUpdated(callback) {
    this.on(Constants.COUNTER.ALL_UPDATED, callback);
  }

  onCounterUpdated(id, callback) {
    this.on(Constants.COUNTER.UPDATED + id, callback);
  }

  getCounters() {
    return {counters: _counters};
  }
};

let _counters = [];
let counterStore = new CounterStore();

AppDispatcher.register( payload => {
  const action = payload.action;

  switch(action.type) {
    case Constants.COUNTER.UPDATE_ALL:
      _counters = action.counters;
      counterStore.emit(Constants.COUNTER.ALL_UPDATED);
      break;
  }
});

export default counterStore;
