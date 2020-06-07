import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { EVENT_ENGINE_RELOAD } from '../../sms/ViewEngine';
import { Button, Typography} from '@material-ui/core';
import ReplayIcon from '@material-ui/icons/Replay';

const useStyles = makeStyles((theme) => ({
    label:{ 
        position: 'relative',
        top: theme.spacing(0.25),
        paddingLeft: theme.spacing(1)
    },
    root: {
        height: '100%',
        padding: theme.spacing(1, 0.5)
    }
}));

const Loading = props => {

  const classes = useStyles();
  
  const [timing, setTiming] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
        let newTiming = timing - 1;
        if(newTiming < 0){
            newTiming = 30
            handleReload();
        }
        setTiming(newTiming);
    }, 1000);
    return () => clearInterval(interval);
  }, [timing]);

  const handleReload = () => {
    setTiming(30);
    document.dispatchEvent(new CustomEvent(EVENT_ENGINE_RELOAD));
  }

  return (
    <div className={classes.root}>    
        <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleReload}
            endIcon={<ReplayIcon/>}>
            Reload
        </Button>      
        <Typography 
            className={classes.label} 
            color="secondary" 
            variant="overline" 
            component="label">
            Auto-Reload in <b>{Math.round(timing)}</b> seconds
        </Typography>
        
    </div>
  );
};

export default Loading;