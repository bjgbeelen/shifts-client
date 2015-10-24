import {Dispatcher} from 'flux';

class AppDispatcher extends Dispatcher {
  handleViewAction(action) {
    this.dispatch({
      source: 'ViewAction',
      action: action
    });
  }

  handleServerAction(action) {
    this.dispatch({
      source: 'ServerAction',
      action: action
    });
  }
};

let appDispatcher = new AppDispatcher();

export default appDispatcher;
