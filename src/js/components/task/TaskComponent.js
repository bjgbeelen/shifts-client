import {tagsToClassNames} from '../calendar/DayComponent';
import {Constants} from '../../constants/Constants';
import ScheduleStore from '../../stores/ScheduleStore';
import ResourceStore from '../../stores/ResourceStore';
import ScheduleApiUtils from '../../utils/ScheduleApiUtils';
import ResourceComponent from '../resource/ResourceComponent';
import {DropTarget} from 'react-dnd';
import React, {PropTypes} from 'react';

var searchParams = new URLSearchParams(window.location.search); //?anything=123
var calendar = searchParams.get("calendar");
var schedule = searchParams.get("schedule");

const taskTarget = {
  canDrop(props, monitor) {
    return !isDisabledTask(props.data.tags, props.absent);
  },
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const currentResource = component.state.resource;
    if (item.assignedToTask != undefined) {
      if (currentResource != undefined) {
        ScheduleApiUtils.addAssignment(calendar, schedule, item.assignedToTask, currentResource.id)
      } else {
        ScheduleApiUtils.removeAssignment(calendar, schedule, item.assignedToTask, item.id);
      }
    }
    ScheduleApiUtils.addAssignment(calendar, schedule, props.data.id, item.id);
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

class TaskComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      resource: undefined
    }
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    this.updateState();
    ScheduleStore.onAssignmentUpdated(this.props.data.id, this.updateState);
  }

  render() {
    const {connectDropTarget, isOver, canDrop, isDragging} = this.props;
    const highlight = isOver && canDrop ? 'highlight ' : '';
    const notAllowed = isOver && !(canDrop) ? 'notAllowed ' : '';
    const absentTag = this.props.absent ? ' absentTag' : '';
    const classNames = 'task ' + tagsToClassNames(this.props.data.tags) + absentTag;
    const ignoredTask = isDisabledTask(this.props.data.tags, this.props.absent);

    const resource = (this.state.resource != undefined) ? <ResourceComponent assignedToTask={this.props.data.id} disableDrag={ignoredTask} name={this.state.resource.name} id={this.state.resource.id} /> : '';

    return connectDropTarget(<div className={classNames}>
      <div className={'info ' + notAllowed}>
        <div className="label">{this.props.data.label}</div>
        <div className="time">{formatMinutes(this.props.data.start)} - {formatMinutes(this.props.data.end)}</div>
      </div>
      <div className={"assignment " + highlight}>{resource}</div>
    </div>);
  }

  updateState() {
    const resourceId = ScheduleStore.getAssignment(this.props.data.id);
    const resource = ResourceStore.getResource(resourceId);
    this.setState( {resource: resource});
  }
};

TaskComponent.propTypes = {
  isOver: PropTypes.bool.isRequired
}

function formatMinutes(minutes) {
  var pad = function(n) { return (n<10) ? "0"+n : n; };
  var hours = minutes / 60;
  var rest = minutes - (60*hours);
  return pad(hours) + ":" + pad(rest);
}

function isDisabledTask(tags, absent) {
  return tags.indexOf('ignore') >= 0 || absent;
}

export default DropTarget(Constants.ItemTypes.RESOURCE, taskTarget, collect)(TaskComponent);
