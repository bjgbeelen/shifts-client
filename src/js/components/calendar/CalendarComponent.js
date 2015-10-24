import CalendarStore from '../../stores/CalendarStore';
import YearComponent from './YearComponent';
import React from 'react';

export default class CalendarComponent extends React.Component {
  constructor() {
    super();
    this.updateState = this.updateState.bind(this);
    this.state = {years: []}
  }

  componentDidMount() {
    CalendarStore.onCalendarUpdated(this.updateState);
  }

  render() {
    const years = this.state.years.map( y => {
      return <YearComponent data={y} key={y.year}/>
    });
    return <div className="calendarView">{years}</div>;
  }

  updateState() {
    this.setState( CalendarStore.getCalendar() );
  }
};
