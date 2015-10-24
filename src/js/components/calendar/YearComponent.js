import MonthComponent from './MonthComponent';
import React from 'react';

export default class YearComponent extends React.Component {
  render() {
    const {year, months} = this.props.data;
    const monthComponents = months.map( m => {
      return <MonthComponent data={m} key={m.month} year={year} />
    });
    return <div className="year">
      {monthComponents}
    </div>
  }
};
