import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { EVENT_ENGINE_FILTER, EVENT_ENGINE_LOADED } from '../../sms/ViewEngine';
import { Typography, Select, MenuItem} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    label:{ 
        padding: theme.spacing(0, 1)
    },
    root: {
        height: '100%',
        padding: theme.spacing(1, 0.5),
        '& .MuiSelect-root': {
            minWidth: 100
        }
    }
}));

const Scope = props => {

  const classes = useStyles();
  
  const [namespace, setNamespace] = React.useState('')
  const [data, setData] = React.useState([])

  const handleChange = (origin) => {
    setNamespace(origin.target.value);
    document.dispatchEvent(new CustomEvent(EVENT_ENGINE_FILTER, {
        detail: { namespace: origin.target.value}
    }));
  }
  
  useEffect(() => {
    function handleChange(event) { 
        let newNS = [];
        if(event.detail && event.detail.nodes){
            for(let i = 0; i < event.detail.nodes.length; i++){
                for(let j = 0; j < event.detail.nodes[i].services.length; j++){
                    if(-1 === newNS.indexOf(event.detail.nodes[i].services[j].namespace)){
                        newNS.push(event.detail.nodes[i].services[j].namespace);
                    }  
                }
            }  
        }
        setData(newNS);
    }
    document.addEventListener(EVENT_ENGINE_LOADED, handleChange);
    return function cleanup(){
        document.removeEventListener(EVENT_ENGINE_LOADED, handleChange);
    }
});

  return (
    <div className={classes.root}>
        <Typography 
            className={classes.label} 
            color="secondary" 
            variant="overline" 
            component="label">
            <b>NS</b>
        </Typography>
        <Select
          value={namespace}
          displayEmpty
          onChange={handleChange}
        >
          <MenuItem value={''}><em>All</em></MenuItem>  
          {data.map((row) => (
          <MenuItem key={row} value={row}>{row}</MenuItem>
          ))}
        </Select>    
    </div>
  );
};

export default Scope;