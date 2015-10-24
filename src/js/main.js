import AppComponent from './components/app/AppComponent';
import CalendarApiUtils from './utils/CalendarApiUtils';
import TaskApiUtils from './utils/TaskApiUtils';
import ResourceApiUtils from './utils/ResourceApiUtils';
import ResourceActions from './actions/ResourceActions';
import ScheduleApiUtils from './utils/ScheduleApiUtils';
import CounterApiUtils from './utils/CounterApiUtils';
import $ from 'jquery';
import React from 'react';

CalendarApiUtils.getCalendar();
TaskApiUtils.getTasks();
ResourceApiUtils.getResources();
ScheduleApiUtils.getSchedule();
CounterApiUtils.getCounters();

$(document).on("dblclick", () => {
  $("#counters").animate({
    scrollTop: 0
  }, 1000);
  ResourceActions.resourceIsBeingDragged(undefined);
});

React.render(<AppComponent/>, document.getElementById('app'));
