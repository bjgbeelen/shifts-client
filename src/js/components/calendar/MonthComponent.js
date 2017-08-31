import WeekComponent from './WeekComponent';
import React from 'react';

export default class MonthComponent extends React.Component {
  render() {
    const {year, data} = this.props;
    // const nrOfWeeks = data.
    const weeks = data.weeks.map( (w, i) => {
      return <WeekComponent data={w} key={w.week} firstWeekOfMonth={i==0} multipleWeeks={data.weeks.length > 1}/>
    });
    return <div className="month">
      <div className="header">
          <div className="title">{data.name} {year}</div>
          <div className="weekday-container">
            <div className="weekday boxed">Zondag</div>
            <div className="weekday boxed">Zaterdag</div>
            <div className="weekday boxed">Vrijdag</div>
            <div className="weekday boxed">Donderdag</div>
            <div className="weekday boxed">Woensdag</div>
            <div className="weekday boxed">Dinsdag</div>
            <div className="weekday boxed">Maandag</div>
          </div>
      </div>
      <div className="weeks-container">{weeks}</div>
    </div>
  }
};
