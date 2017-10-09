import ScheduleActions from '../actions/ScheduleActions';
import $ from 'jquery';

export default {
  getSchedule: (calendarName, scheduleName) => {
    $.ajax({
      url: '/api/calendars/' + calendarName + '/schedules/' + scheduleName,
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
  addAssignment: (calendarName, scheduleName, taskId, resourceId) => {
    ScheduleActions.addAssignment(taskId, resourceId)
    $.ajax({
      url: '/api/calendars/' + calendarName + '/schedules/' + scheduleName + '/' + taskId + '/' + resourceId,
      dataType: 'text',
      method: 'POST',
      cache: false,
      statusCode: {
        201: () => {
          // console.log('Added assignment');
          //ScheduleActions.addAssignment(taskId, resourceId)
        }
      },
      error: function(xhr, status, err) {
        console.error(err)
      }.bind(this)
    });
  },
  removeAssignment: (calendarName, scheduleName, taskId, resourceId) => {
    ScheduleActions.removeAssignment(taskId, resourceId)
    $.ajax({
      url: '/api/calendars/' + calendarName + '/schedules/' + scheduleName + '/' + taskId,
      //dataType: 'text',
      method: 'DELETE',
      cache: false,
      statusCode: {
        204: () => {
          // console.log('deleted');
          //ScheduleActions.removeAssignment(taskId, resourceId)
        }
      },
      error: function(xhr, status, err) {
        console.error(err);
      }.bind(this)
    });
  },
  updateResourceConstraints: (calendarName, scheduleName, constraints) => {
    $.ajax({
      url: '/api/calendars/' + calendarName + '/schedules/' + scheduleName + '/constraints',
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
