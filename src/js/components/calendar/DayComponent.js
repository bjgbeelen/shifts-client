import TaskStore from '../../stores/TaskStore';
import TaskComponent from '../task/TaskComponent';
import ScheduleStore from '../../stores/ScheduleStore';
import ScheduleActions from '../../actions/ScheduleActions';
import ResourceStore from '../../stores/ResourceStore';
import React from 'react';

export default class DayComponent extends React.Component {
  constructor() {
    super();
    this.updateState = this.updateState.bind(this);
    this.updateSelectedResource = this.updateSelectedResource.bind(this);
    this.toggleAbsence = this.toggleAbsence.bind(this);
    this.state = {tasks: [], selectedResource: undefined};
  }

  componentDidMount() {
    this.updateState();
    TaskStore.onTasksUpdated(this.props.data.id, this.updateState);
    ResourceStore.onResourceSelectionChange(this.updateSelectedResource);
    ScheduleStore.onResourceConstraintsUpdated(this.updateSelectedResource);
  }

  toggleAbsence() { 
    ScheduleActions.toggleAbsence(new Array(this.props.data.id), this.state.selectedResource);
  }

  render() {
    const isAbsent = ScheduleStore.isAbsent(this.props.data.id, this.state.selectedResource)
    const absentTag = isAbsent ? ' absentTag' : ''

    const tasks = this.state.tasks.map( t => {
      return <TaskComponent data={t} key={t.id} absent={isAbsent} />
    })
    
    var firstTaskTags = (this.state.tasks.slice().shift() || {}).tags;
    var lastTaskTags = (this.state.tasks.slice().pop() || {}).tags;
    var headerClassNames = 'dayHeader ' + tagsToClassNames(firstTaskTags) + absentTag;
    var dayClassNames = 'day boxed ' + tagsToClassNames(lastTaskTags) + absentTag;

    return <div className={dayClassNames}>
      <div className={headerClassNames}>
        <div className="label">{this.props.data.label}</div>
        <div className="number" onClick={this.toggleAbsence}>{this.props.data.day}</div>
      </div>      
      <div className="tasks-container">{tasks}</div>
    </div>
  }

  updateState() {
    this.setState( TaskStore.getTasks(this.props.data.id) );
  }

  updateSelectedResource() {
    this.setState( ResourceStore.getSelectedResource() );
  }
};

export function tagsToClassNames(input) {
  if (input == undefined) {
    return '';
  } else {
    return input.map( function(item) {
      return item + 'Tag';
    }).reduce( function(prev, curr) {
      return prev + ' ' +  curr;
    });
  }
}
