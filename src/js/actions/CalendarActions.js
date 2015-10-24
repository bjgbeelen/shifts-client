import AppDispatcher from '../dispatchers/AppDispatcher';
import {Constants} from '../constants/Constants';

export default {
  updateCalendar: (calendar) => {
    AppDispatcher.handleServerAction({
      type: Constants.CALENDAR.UPDATE,
      calendar: calendar
    });
  }
};
