import AppDispatcher from '../dispatchers/AppDispatcher';
import {Constants} from '../constants/Constants';

export default {
  updateCounters: (counters) => {
    AppDispatcher.handleServerAction({
      type: Constants.COUNTER.UPDATE_ALL,
      counters: counters
    });
  }
};
