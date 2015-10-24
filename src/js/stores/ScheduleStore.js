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
    return resourceConstraints && resourceConstraints.absence.filter( item => {
      return item == dayId
    }).length > 0
  }

  calculate(counter, resource) {    
    const filteredAssignments = Object.keys(_schedule.assignments).filter( key => {
      return resource == undefined || _schedule.assignments[key] == resource;
    });
    const tasks = TaskStore.getTasksByIds(filteredAssignments);
    return {assignmentCount: calculateCounter(counter, tasks)};
  }

  getDesiredCounts(resource) {
    const counts = _schedule.resourceConstraints.filter( item => {
      return item.resourceId == resource;
    })[0];
    if (counts == undefined) { 
      return {taskCount: []}
    } else {
      return {taskCount: counts.desiredNumberOfTasks};
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
  resourceConstraints: []
};
let scheduleStore = new ScheduleStore();

AppDispatcher.register( payload => {
  const action = payload.action;  

  switch(action.type) {
    case Constants.SCHEDULE.UPDATE:
      console.log('schedule updated...!!!')
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
      let constraints = selectResourceConstraints(ResourceStore.getSelectedResource().selectedResource);
      constraints.absence = toggleAbsence(constraints.absence, action.days);
      scheduleStore.emit(Constants.CONSTRAINTS.UPDATED);
      ScheduleApiUtils.updateResourceConstraints(constraints);
      break
  }
});

function selectResourceConstraints(resource) {
  return _schedule.resourceConstraints.filter( item => {
    return item.resourceId == resource;
  })[0];
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

function calculateCounter(counter, tasks) {
  let result = {}

  const filteredTasks = tasks.filter(task => {
    return counter.include.every(tag => {return task.tags.indexOf(tag) >= 0})
      && counter.exclude.every(tag => {return task.tags.indexOf(tag) < 0})
  });
  result[counter.id] = filteredTasks.length;

  if (counter.children.length > 0) {
    counter.children.forEach(childCounter => {
      const counts = calculateCounter(childCounter, filteredTasks)
      Object.keys(counts).map(key => {
        result[key] = counts[key];
      })
    })
  } 

  return result;
}


export default scheduleStore;
