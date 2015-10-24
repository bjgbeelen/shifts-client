import React, {PropTypes} from 'react';
import ResourceActions from '../../actions/ResourceActions';
import {Constants} from '../../constants/Constants';
import $ from 'jquery';
import {DragSource} from 'react-dnd';

const resourceSource = {
  beginDrag(props) {

    const container = $("#counters"), scrollToLmnt = $("#counter" + props.id);
    container.delay(200).animate({
      scrollTop: scrollToLmnt.offset().top - container.offset().top + container.scrollTop() - 20
    }, 1000);

    ResourceActions.resourceIsBeingDragged(props.id)

    return {
      id: props.id,
      assignedToTask: props.assignedToTask
    };
  },
  canDrag(props, monitor) {
    return !props.disableDrag;
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    didDrop: monitor.didDrop()
  }
}

class ResourceComponent {
  render() {
    const {connectDragSource, isDragging, didDrop} = this.props;
    const {name, id, assignedToTask} = this.props;
    if (isDragging && assignedToTask) {
      return null;
    } else {
      return connectDragSource(<div className="resource">{name}</div>);
    }
  }
};

ResourceComponent.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  assignedToTask: PropTypes.string
}

export default DragSource(Constants.ItemTypes.RESOURCE, resourceSource, collect)(ResourceComponent)
