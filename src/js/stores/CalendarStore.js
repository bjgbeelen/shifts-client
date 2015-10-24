import AppDispatcher from '../dispatchers/AppDispatcher';
import {Constants} from '../constants/Constants';
import {EventEmitter} from 'events'

class CalendarStore extends EventEmitter {
  onCalendarUpdated(callback) {
    this.on(Constants.CALENDAR.UPDATED, callback);
  }

  getCalendar() {
    return _calendar;
  }
};

let _calendar = {};
let calendarStore = new CalendarStore();

AppDispatcher.register( payload => {
  const action = payload.action;

  switch(action.type) {
    case Constants.CALENDAR.UPDATE:
      _calendar = action.calendar;
      calendarStore.emit(Constants.CALENDAR.UPDATED);
      break;
  }
});

export default calendarStore;
