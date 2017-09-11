import CounterActions from '../actions/CounterActions';
import $ from 'jquery';

export default {
  getCounters: () => {
    $.ajax({
      url: '/api/calendars/2018/counters',
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
