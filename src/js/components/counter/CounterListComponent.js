import CounterStore from '../../stores/CounterStore';
import CounterComponent from './CounterComponent';
import React from 'react';

export default class CounterListComponent extends React.Component {
  constructor() {
    super();
    this.updateState = this.updateState.bind(this);
    this.state = {counters: []};
  }
  componentDidMount() {
    this.updateState();
    CounterStore.onCountersUpdated(this.updateState);
  }
  render() {
    const counters = this.state.counters.map( counter =>
      <CounterComponent data={counter} key={counter.id}/>
    )
    return <div className="counterContainer"><div className="username" id="algemeen">Algemeen</div>{counters}</div>
  }
  updateState() {
    this.setState( CounterStore.getCounters() )
  }
};
