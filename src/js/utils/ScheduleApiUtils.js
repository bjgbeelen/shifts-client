import ScheduleActions from '../actions/ScheduleActions';
import $ from 'jquery';

export default {
  getSchedule: (scheduleName) => {
    $.ajax({
      url: '/api/calendars/2018/schedules/' + scheduleName,
      dataType: 'json',
      cache: false,
      success: function(data) {
        ScheduleActions.updateSchedule(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('assets/calendar.json', status, err.toString());
      }.bind(this)
    });
  },
  addAssignment: (taskId, resourceId) => {
    ScheduleActions.addAssignment(taskId, resourceId)
    $.ajax({
      url: '/api/calendars/2017/schedules/Opzet/' + taskId + '/' + resourceId,
      dataType: 'text',
      method: 'POST',
      cache: false,
      statusCode: {
        201: () => {
          //ScheduleActions.addAssignment(taskId, resourceId)
        }
      },
      error: function(xhr, status, err) {
        console.error('assets/calendar.json', status, err.toString());
      }.bind(this)
    });
  },
  removeAssignment: (taskId, resourceId) => {
    ScheduleActions.removeAssignment(taskId, resourceId)
    $.ajax({
      url: '/api/calendars/2017/schedules/Opzet/' + taskId,
      //dataType: 'text',
      method: 'DELETE',
      cache: false,
      statusCode: {
        204: () => {
          //ScheduleActions.removeAssignment(taskId, resourceId)
        }
      },
      error: function(xhr, status, err) {
        console.error('assets/calendar.json', status, err.toString());
      }.bind(this)
    });
  },
  updateResourceConstraints: (constraints) => {
    $.ajax({
      url: '/api/calendars/2017/schedules/Opzet/constraints',
      //dataType: 'text',
      data: JSON.stringify(constraints),
      contentType: 'application/json',
      method: 'PUT',
      cache: false,
      statusCode: {
        204: () => {
          //ScheduleActions.removeAssignment(taskId, resourceId)
        }
      },
      error: function(xhr, status, err) {
        console.error('assets/calendar.json', status, err.toString());
      }.bind(this)
    });
  }
}
