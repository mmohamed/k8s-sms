import React, { useState, useEffect } from 'react';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import { EVENT_NODE_SELECTION } from '../../sms/ViewEngine';
import CardPane from '../Common/CardPane';

const useStyles = makeStyles((theme) => ({
  listRoot: {
      padding: 0
  },
  listItem: {
    padding: theme.spacing(0, 1, 0, 0)
  },
  listItemIcon: {
    minWidth: 0
  },
  listItemText: {
    marginBottom: 0,
    marginTop: 0,
    '& .MuiTypography-displayBlock': {
        display: 'inline-block'
    },
    '& .MuiTypography-colorTextSecondary':{
        float: 'right',
        paddingTop: theme.spacing(0.25)
    }
      
  }
}));

const Meta = props => {

  const classes = useStyles();
  
  const [data, setData] = useState([]);

  useEffect(() => {
    function handleChange(event) { 
      if(event.detail.isSelected){
        let dt = event.detail.data.raw;
        let metadata = JSON.parse(JSON.stringify(dt.metadata ? dt.metadata : []));
        if(metadata.length){
          metadata.push({name: 'Services', value: dt.services ? dt.services.length : 0});
          metadata.push({name: 'Status', value: dt.disabled ? 'disabled' : 'enabled'});
        }
          setData(metadata);
      }else{
          setData([]);
      }
    }
    document.addEventListener(EVENT_NODE_SELECTION, handleChange);
    return function cleanup(){
        document.removeEventListener(EVENT_NODE_SELECTION, handleChange);
    }
  });
  
  let view = (
    <List className={classes.listRoot}>
        {data.map((row) => (
        <ListItem className={classes.listItem} key={row.name}>
            <ListItemIcon className={classes.listItemIcon}>
                <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText className={classes.listItemText} primary={row.name} secondary={row.value}/>
        </ListItem>
        ))}
    </List>
  )

  if(!data.length){
    view = (<Alert severity="info">No data available !</Alert>);
  }

  return (
    <CardPane title="Metadata">{view}</CardPane>
  );
};

export default Meta;