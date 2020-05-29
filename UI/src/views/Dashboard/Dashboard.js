import React from 'react';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import BaseWidget from './../../BaseWidget'
import { ViewEngine } from './../../sms/ViewEngine';
import data from './../../data.json';
import Loader from '../../components/Common/Loader';

class Dashboard extends React.Component{
  
  viewEngine;

  constructor(props){
    super(props);
    this.viewEngine = new ViewEngine();
    this.state = {loading: true, diagramEngine: this.viewEngine.get()};
  }
 
  componentDidMount(){
    this.viewEngine.load(data, () => {
      this.setState({loading: false, diagramEngine: this.viewEngine.get()});
    });
  }

  handleOpenLoader(status){
    this.setState({loading: status});
  }

  render(){
    return (
      <React.Fragment>
        <BaseWidget>
          <CanvasWidget engine={this.state.diagramEngine} />
        </BaseWidget>
        <Loader open={this.state.loading} setOpen={this.handleOpenLoader} dark={true}/>
      </React.Fragment>
    );
  } 
}

export default Dashboard;
