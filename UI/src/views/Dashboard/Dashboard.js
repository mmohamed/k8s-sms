import React from 'react';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import BaseWidget from './../../BaseWidget'
import { ViewEngine, EVENT_ENGINE_RELOAD, EVENT_ENGINE_FILTER } from './../../sms/ViewEngine';
import Loader from '../../components/Common/Loader';
import SMSService from '../../services/SMSService';
import Notification from '../../components/Common/Notification';

class Dashboard extends React.Component{
  
  viewEngine;
  filter;

  constructor(props){
    super(props);
    this.viewEngine = new ViewEngine();
    this.state = {loading: true, diagramEngine: this.viewEngine.get(), error: null, success: null};
    this.handleErrorMessage = this.handleErrorMessage.bind(this);
    this.handleSuccessMessage = this.handleSuccessMessage.bind(this);
    this.handleOpenLoader = this.handleOpenLoader.bind(this);
    this.filter = {from: null, to: null, namespace: null};
  }
 
  componentDidMount(){
    let that = this;
    this.handleGet();
    // bind reload
    document.addEventListener(EVENT_ENGINE_RELOAD, function(event) { 
      that.handleGet();
    });
    // bind filter
    document.addEventListener(EVENT_ENGINE_FILTER, function(event) { 
      if(event.detail.from !== undefined){
        that.filter.from = event.detail.from;
      }
      if(event.detail.to !== undefined){
        that.filter.to = event.detail.to;
      }
      if(event.detail.namespace !== undefined){
        that.filter.namespace = event.detail.namespace;
      }
      that.handleGet();
    });
    // prevent hide viewport 
    window.addEventListener('focus', function(event){
        that.viewEngine.distrube();
    });
  }

  handleGet(){
    this.setState({loading: true});
    let that = this;
    SMSService.get(this.filter, function(data){
      that.viewEngine.refresh(data, () => {
        that.setState({loading: false});
      });
    }, function(message){
      that.setState({loading: false, error : message});
    }, function(){
      that.setState({loading: false });
      that.props.history.push('/');
    });
  }

  handleOpenLoader(status){
    this.setState({loading: status});
  }

  handleSuccessMessage(message){
    this.setState({success: message});
  }

  handleErrorMessage(message){
    this.setState({error: message});
  }

  render(){
    return (
      <React.Fragment>
        <BaseWidget>
          <CanvasWidget engine={this.state.diagramEngine} />
        </BaseWidget>
        <Loader open={this.state.loading} setOpen={this.handleOpenLoader} dark={true}/>
        <Notification message={this.state.success} setMessage={this.handleSuccessMessage} type="success" />
        <Notification message={this.state.error} setMessage={this.handleErrorMessage} type="error" />
      </React.Fragment>
    );
  } 
}

export default Dashboard;
