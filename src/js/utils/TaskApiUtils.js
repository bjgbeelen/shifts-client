import TaskActions from '../actions/TaskActions';
import $ from 'jquery';

export default {
  getTasks: () => {
    $.ajax({
      url: '/api/calendars/2018/tasks',
      dataType: 'json',
      cache: false,
      success: function(data) {
        TaskActions.updateTasks(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('assets/calendar.json', status, err.toString());
      }.bind(this)
    });
  }
}
