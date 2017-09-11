import ResourceActions from '../actions/ResourceActions';
import $ from 'jquery';

export default {
  getResources: () => {
    $.ajax({
      url: '/api/calendars/2018/resources',
      dataType: 'json',
      cache: false,
      success: function(data) {
        ResourceActions.updateResources(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('assets/calendar.json', status, err.toString());
      }.bind(this)
    });
  }
}
