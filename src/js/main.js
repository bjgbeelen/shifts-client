import AppComponent from './components/app/AppComponent';
import CalendarApiUtils from './utils/CalendarApiUtils';
import TaskApiUtils from './utils/TaskApiUtils';
import ResourceApiUtils from './utils/ResourceApiUtils';
import ResourceActions from './actions/ResourceActions';
import ScheduleApiUtils from './utils/ScheduleApiUtils';
import CounterApiUtils from './utils/CounterApiUtils';
import $ from 'jquery';
import React from 'react';

var searchParams = new URLSearchParams(window.location.search); //?anything=123
var calendar = searchParams.get("calendar")
var schedule = searchParams.get("schedule")

CalendarApiUtils.getCalendar();
TaskApiUtils.getTasks();
ResourceApiUtils.getResources();
ScheduleApiUtils.getSchedule(calendar, schedule);
CounterApiUtils.getCounters();

$(document).on("dblclick", () => {
  $("#counters").animate({
    scrollTop: 0
  }, 1000);
  ResourceActions.resourceIsBeingDragged(undefined);
});

React.render(<AppComponent/>, document.getElementById('app'));
