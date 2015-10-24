import CounterActions from '../actions/CounterActions';
import $ from 'jquery';

export default {
  getCounters: () => {
    $.ajax({
      url: 'http://localhost:5000/calendars/2016/counters',
      dataType: 'json',
      cache: false,
      success: function(data) {
        CounterActions.updateCounters(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('assets/calendar.json', status, err.toString());
      }.bind(this)
    }); 
  }
}