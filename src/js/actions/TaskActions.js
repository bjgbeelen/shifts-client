import AppDispatcher from '../dispatchers/AppDispatcher';
import {Constants} from '../constants/Constants';

export default {
  updateTasks: (tasks) => {
    AppDispatcher.handleServerAction({
      type: Constants.TASK.UPDATE,
      tasks: tasks
    });
  }

};
