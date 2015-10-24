import CalendarActions from '../actions/CalendarActions';
import $ from 'jquery';

export default {
  getCalendar: () => {
    $.ajax({
      url: 'http://localhost:5000/calendars/2016',
      dataType: 'json',
      cache: false,
      success: function(data) {
        CalendarActions.updateCalendar(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('assets/calendar.json', status, err.toString());
      }.bind(this)
    }); 
  }
}