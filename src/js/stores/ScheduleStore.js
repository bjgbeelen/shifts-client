import AppDispatcher from '../dispatchers/AppDispatcher';
import TaskStore from './TaskStore';
import ResourceStore from './ResourceStore';
import {Constants} from '../constants/Constants';
import ScheduleApiUtils from '../utils/ScheduleApiUtils';
import {EventEmitter} from 'events';

class ScheduleStore extends EventEmitter {
  constructor() {
    super();
  }

  onScheduleUpdated(callback) {
    this.on(Constants.SCHEDULE.UPDATED, callback);
  }

  onAssignmentUpdated(taskId, callback) {
    this.on(assignmentUpdatedForTask(taskId), callback);
  }

  onResourceConstraintsUpdated(callback) {
    this.on(Constants.CONSTRAINTS.UPDATED, callback);
  }

  onNumberChange(callback) {
    this.on(Constants.SCHEDULE.NUMBER_CHANGE, callback);
  }

  isAbsent(dayId, resourceId) {
    const resourceConstraints = selectResourceConstraints(resourceId)
    return resourceConstraints && (
      resourceConstraints
      .filter(constraint => {return constraint.type == "AbsenceConstraint"})
      .reduce( function(acc, constraint) {
        return acc || constraint.absence.filter(item => {
          return item == dayId
        }).length > 0
      }, false)
    )
  }

  calculate(counter, resource) {
    const filteredAssignments = Object.keys(_schedule.assignments).filter( key => {
      return resource == undefined || _schedule.assignments[key] == resource;
    });
    const tasks = TaskStore.getTasksByIds(filteredAssignments);
    return {assignmentCount: calculateCounter(counter, tasks)};
  }

  getDesiredCounts(resource) {
    const constraints = _schedule.resourceConstraints[resource]
    if (constraints == undefined) {
      return {taskCount: []}
    } else {
      let result = {}
        constraints
        .filter( constraint => { return constraint.type == "CounterConstraint" })
        .forEach( counterConstraint =>
          result[counterConstraint.counterId] = counterConstraint.desired
        )
      return {taskCount: result};
    }
  }

  getName() {
    return _schedule.name;
  }

  getAssignment(taskId) {
    return _schedule.assignments[taskId] || {};
  }
};

let _schedule = {
  assignments: [],
  resourceConstraints: {}
};
let scheduleStore = new ScheduleStore();

AppDispatcher.register( payload => {
  const action = payload.action;

  switch(action.type) {
    case Constants.SCHEDULE.UPDATE:
      _schedule = action.schedule;
      scheduleStore.emit(Constants.SCHEDULE.UPDATED);
      Object.keys(_schedule.assignments).forEach( taskId => {
        scheduleStore.emit(assignmentUpdatedForTask(taskId));
      });
      scheduleStore.emit(Constants.SCHEDULE.NUMBER_CHANGE);
      break
    case Constants.ASSIGNMENT.ADD:
      _schedule.assignments[action.taskId] = action.resourceId;
      scheduleStore.emit(assignmentUpdatedForTask(action.taskId));
      scheduleStore.emit(Constants.SCHEDULE.NUMBER_CHANGE);
      break
    case Constants.ASSIGNMENT.REMOVE:
      delete _schedule.assignments[action.taskId];
      //_schedule.assignments[action.taskId] = undefined;
      scheduleStore.emit(assignmentUpdatedForTask(action.taskId));
      scheduleStore.emit(Constants.SCHEDULE.NUMBER_CHANGE);
      break
    case Constants.CONSTRAINTS.TOGGLE_ABSENCE:
      let selectedResource = ResourceStore.getSelectedResource().selectedResource
      if (selectedResource) {
        let absenceConstraint = selectResourceConstraints(selectedResource, "AbsenceConstraint");
        let otherConstraints = selectResourceConstraints(selectedResource, "AbsenceConstraint", true);
        absenceConstraint[0].absence = toggleAbsence(absenceConstraint[0].absence, action.days);
        let resourceConstraints = otherConstraints.concat(absenceConstraint)
        let updatedConstraints = _schedule.resourceConstraints
        updatedConstraints[selectedResource] = resourceConstraints;
        scheduleStore.emit(Constants.CONSTRAINTS.UPDATED);
        var searchParams = new URLSearchParams(window.location.search);
        var calendar = searchParams.get("calendar");
        var schedule = searchParams.get("schedule");
        ScheduleApiUtils.updateResourceConstraints(calendar, schedule, updatedConstraints);
        break
      }
  }
});

function selectResourceConstraints(resource, _type, reverse=false) {
  let result = _schedule.resourceConstraints[resource]
  if (result && _type) {
    return result.filter(constraint => {
      if (!reverse)
        return constraint.type == _type;
      else return constraint.type != _type
    });
  } else return result;
}

function toggleAbsence(absence, days) {
  return days.reduce( function(list, item) {
    if (list.indexOf(item) >= 0) {
      return list.filter( _ => {return _ != item})
    } else {
      return list.concat(item);
    }
  }, absence)
}

function assignmentUpdatedForTask(taskId) {
  return Constants.ASSIGNMENT.UPDATED + '_' + taskId;
}

function calculateCounter(counters, tasks) {
  let result = {}
  counters.forEach(counter => {
    const filteredTasks = tasks.filter(task => {
      return counter.include.every(tag => {return task.tags.indexOf(tag) >= 0})
        && counter.exclude.every(tag => {return task.tags.indexOf(tag) < 0})
    });
    result[counter.id] = filteredTasks.length;
  })

  return result;
}


export default scheduleStore;
