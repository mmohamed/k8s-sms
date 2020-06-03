import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import {
  Paper,
  Chip,
  Avatar,
} from '@material-ui/core';
import { EVENT_NODE_SELECTION } from '../../sms/ViewEngine';
import CardPane from '../Common/CardPane';

const useStyles = makeStyles((theme) => ({
  listRoot: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  chip: {
    margin: theme.spacing(0.5),
  }
}));

const Service = props => {

  const classes = useStyles();
  
  const [data, setData] = useState([]);

  document.addEventListener(EVENT_NODE_SELECTION, function(event) { 
    if(event.detail.isSelected){
        let dt = event.detail.data.raw;
        setData(dt.services ? dt.services : []);
    }else{
        setData([]);
    }
  });
  let view = (
    <Paper component="ul" className={classes.listRoot}>
        {data.map((row) => (
        <li key={row.id}>
            <Chip
            avatar={<Avatar>{String(row.id).substring(0, 2).toUpperCase()}</Avatar>}
            color='primary'
            //style={{backgroundColor: palette.error.main}}
            label={row.name}
            className={classes.chip}
            clickable
            />
        </li>
        ))}
    </Paper>
  )

  if(!data.length){
    view = (<Alert severity="info">No data available !</Alert>);
  }

  return (
    <CardPane title="Services">{view}</CardPane>
  );
};

export default Service;