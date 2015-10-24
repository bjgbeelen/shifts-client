import React from 'react';
import CalendarComponent from '../calendar/CalendarComponent';
import CounterListComponent from '../counter/CounterListComponent';
import ResourceListComponent from '../resource/ResourceListComponent.js';
import ResourceCounterListComponent from '../counter/ResourceCounterListComponent';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

class AppComponent extends React.Component {
  render() {
    return <div>
      <div id="calendar" className="container"><CalendarComponent/></div>
      <div id="resources" className="container">
        <div>
        <ResourceListComponent/>
        </div>
        <div id="counters">
          <CounterListComponent />
          <ResourceCounterListComponent/>
        </div>
      </div>

    </div>      
  }  
};

export default DragDropContext(HTML5Backend)(AppComponent);
