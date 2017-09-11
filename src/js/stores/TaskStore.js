import AppDispatcher from '../dispatchers/AppDispatcher';
import {Constants} from '../constants/Constants';
import {EventEmitter} from 'events';

class TaskStore extends EventEmitter {
  onTasksUpdated(dayId, callback) {
    this.on(tasksUpdatedForDay(dayId), callback);
  }

  onAllUpdated(callback) {
    this.on(Constants.TASK.UPDATED, callback);
  }

  calculate(counter) {
    return {taskCount: calculateCounter(counter, toList(_tasks))};
  }

  getTasksByIds(ids) {
    return toList(_tasks).filter(task => {
      return ids.indexOf(task.id) >= 0;
    });
  }

  getTasks(dayId) {
    const dayTasks = (_tasks[dayId] || []).sort( (a,b) => {
      if (a.start < b.start)
        return -1;
      else if (a.start > b.start)
        return 1;
      else if (a.label < b.label)
        return -1;
      else if (a.label > b.label)
        return 1;
      else return 0;
    });
    return {tasks: dayTasks};
  }
};

let _tasks = {};
let taskStore = new TaskStore();

AppDispatcher.register( payload => {
  var action = payload.action;

  switch(action.type) {
    case Constants.TASK.UPDATE:
      _tasks = action.tasks;
      Object.keys(action.tasks).forEach( function(dayId) {
        taskStore.emit(tasksUpdatedForDay(dayId));
      });
      taskStore.emit(Constants.TASK.UPDATED);
      break;
  }
});

function tasksUpdatedForDay(dayId) {
  return Constants.TASK.UPDATED + '_' + dayId;
}

function toList(tasks) {
  return Object.keys(tasks).reduce(function(list, dayIndex) {
    return list.concat(tasks[dayIndex]);
  },[])
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

export default taskStore;
