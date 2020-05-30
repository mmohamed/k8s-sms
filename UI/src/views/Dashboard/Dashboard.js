import React from 'react';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import BaseWidget from './../../BaseWidget'
import { ViewEngine } from './../../sms/ViewEngine';
import data from './../../data.json';
import Loader from '../../components/Common/Loader';
import SMSService from '../../services/SMSService';
import Notification from '../../components/Common/Notification';

class Dashboard extends React.Component{
  
  viewEngine;

  constructor(props){
    super(props);
    this.viewEngine = new ViewEngine();
    this.state = {loading: true, diagramEngine: this.viewEngine.get(), error: null, success: null};
    this.handleErrorMessage = this.handleErrorMessage.bind(this);
    this.handleSuccessMessage = this.handleSuccessMessage.bind(this);
    this.handleOpenLoader = this.handleOpenLoader.bind(this);
  }
 
  componentDidMount(){
    SMSService.get().then(res => {
      if(res.status === 200){
        this.viewEngine.load(res.data, () => {
          this.setState({loading: false});
        });
      }else {
        this.setState({loading: false, error : res.data.message});
      }
    }).catch(error => {
      //this.setState({loading: false, error : 'Unable to contact server !'});
      this.viewEngine.load(data, () => {
        this.setState({loading: false});
      });
    });
  }

  handleOpenLoader(status){
    this.setState({loading: status});
  }

  handleSuccessMessage(message){
    this.setState({success: message});
  }

  handleErrorMessage(message){
    console.debug(this);
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
