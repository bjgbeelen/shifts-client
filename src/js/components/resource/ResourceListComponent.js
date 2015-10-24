import ResourceStore from '../../stores/ResourceStore';
import React from 'react';
import ResourceComponent from './ResourceComponent';

export default class ResourceListComponent extends React.Component {
  constructor() {
    super();
    this.updateState = this.updateState.bind(this);
    this.state = {resources: []};
  }
  componentDidMount() {
    this.updateState();
    ResourceStore.onResourcesUpdated(this.updateState);
  }
  render() {
    var resources = this.state.resources.map( function(r) {
      const {name, id} = r;
      return <ResourceComponent name={name} id={id} key={id} />
    })

    return <div className="resourceContainer">{resources}</div>
  }
  updateState() {
    this.setState( ResourceStore.getResources() )
  }
};
