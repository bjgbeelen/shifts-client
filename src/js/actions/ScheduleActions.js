import AppDispatcher from '../dispatchers/AppDispatcher';
import {Constants} from '../constants/Constants';

export default {
  updateSchedule: (schedule) => {
    AppDispatcher.handleServerAction({
      type: Constants.SCHEDULE.UPDATE,
      schedule: schedule
    });
  },
  addAssignment: (taskId, resourceId) => {
    AppDispatcher.handleServerAction({
      type: Constants.ASSIGNMENT.ADD,
      taskId: taskId,
      resourceId: resourceId
    })
  },
  removeAssignment: (taskId, resourceId) => {
    AppDispatcher.handleServerAction({
      type: Constants.ASSIGNMENT.REMOVE,
      taskId: taskId,
      resourceId: resourceId
    })
  },
  toggleAbsence: (days, resourceId) => {
    AppDispatcher.handleViewAction({
      type: Constants.CONSTRAINTS.TOGGLE_ABSENCE,
      days: days,
      resourceId: resourceId
    })
  }
};
