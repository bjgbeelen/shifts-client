import CounterStore from '../../stores/CounterStore';
import ScheduleStore from '../../stores/ScheduleStore';
import TaskStore from '../../stores/TaskStore';
import React from 'react';

export default class CounterComponent extends React.Component {
  constructor() {
    super();
    this.updateTasks = this.updateTasks.bind(this);
    this.updateAssignments = this.updateAssignments.bind(this);
    this.updateDesiredTasks = this.updateDesiredTasks.bind(this);
    this.state = {counters: [], taskCount: {}, assignmentCount: {}};
  }
  assignmentCount(counter) {
    return this.state.assignmentCount[counter] || '0';
  }
  taskCount(counter) {
    return this.state.taskCount[counter] || '0';
  }
  componentDidMount() {
    this.updateAssignments();
    this.updateTasks();
    this.updateDesiredTasks();
    TaskStore.onAllUpdated(this.updateTasks);
    ScheduleStore.onNumberChange(this.updateAssignments);
    ScheduleStore.onScheduleUpdated(this.updateDesiredTasks);
  }
  render() {
    const secondLevelLabels = this.props.data.children.map(c => {
      return <td key={c.id}><div className="secondLevelLabel">{c.name}</div></td>
    })
    const secondLevelAssignmentCount = this.props.data.children.map(c => {
      return <td key={c.id} className="column  no-top"><div className="secondLevelCount">{this.assignmentCount(c.id)}</div></td>
    })
    const secondLevelTaskCount = this.props.data.children.map(c => {
      return <td key={c.id} className="column"><div className="secondLevelCount">{this.taskCount(c.id)}</div></td>
    })
    return <table className="counter" cellSpacing="0">
      <tr>
        <td></td>
        {secondLevelLabels}
      </tr>
      <tr>
        <td rowSpan="2" valign="center"><div className="head">{this.props.data.name}</div></td>
        {secondLevelAssignmentCount}
      </tr>
      <tr>
        {secondLevelTaskCount}
      </tr>
      <tr><td></td></tr>
    </table>
  }
  updateTasks() {
    if (this.props.resource == undefined) {
      this.setState(TaskStore.calculate(this.props.data));      
    }
    this.updateAssignments();
    this.updateDesiredTasks();
  }
  updateDesiredTasks() {
    if (this.props.resource != undefined) {
      this.setState(ScheduleStore.getDesiredCounts(this.props.resource));
    }
  }
  updateAssignments() {
    this.setState(ScheduleStore.calculate(this.props.data, this.props.resource))
  }
};
