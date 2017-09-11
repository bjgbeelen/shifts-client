import ResourceStore from '../../stores/ResourceStore';
import CounterStore from '../../stores/CounterStore';
import CounterComponent from './CounterComponent';
import React from 'react';

export default class ResourceCounterListComponent extends React.Component {
  constructor() {
    super();
    this.updateState = this.updateState.bind(this);
    this.state = {counters: {}, resources: []};
  }
  componentDidMount() {
    this.updateState();
    CounterStore.onCountersUpdated(this.updateState);
    ResourceStore.onResourcesUpdated(this.updateState);
  }
  render() {
    const resourceCounters = this.state.resources.map( item => {
      const counters = Object.keys(this.state.counters).map( counterGroup => {
        return <CounterComponent resource={item.id} data={this.state.counters[counterGroup]} key={counterGroup} name={counterGroup}/>
      })
      return <div className="counterContainer" key={item.id}><div className="username" id={"counter" + item.id}>{item.name}</div>{counters}</div>
    })
    return <div className="resourceCounterContainer">{resourceCounters}</div>
  }
  updateState() {
    this.setState( CounterStore.getCounters() );
    this.setState( ResourceStore.getResources() );
  }
};
