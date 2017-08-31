import DayComponent from './DayComponent';
import ScheduleActions from '../../actions/ScheduleActions';
import ResourceStore from '../../stores/ResourceStore';
import React from 'react';

export default class WeekComponent extends React.Component {

  constructor() {
    super();
    this.toggleAbsence = this.toggleAbsence.bind(this);
  }

  toggleAbsence() { 
    const weekdays = this.props.data.days.map( d => { return d.id });
    ScheduleActions.toggleAbsence(weekdays);
  }

  render() {
    const {data, firstWeekOfMonth, multipleWeeks} = this.props;
    const daysData = (firstWeekOfMonth && multipleWeeks) ? data.days.reverse() : data.days;
    const days = daysData.map( d => {
      return <DayComponent data={d} key={d.day} />
    });
    
    return <div className="week">
      <div className="weeknumber-container boxed" onClick={this.toggleAbsence}><div className="number">{this.props.data.week}</div></div>
      <div className="days-container">{days}</div>
    </div>
  }
};
