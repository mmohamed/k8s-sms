import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { EVENT_ENGINE_FILTER, EVENT_ENGINE_LOADED } from '../../sms/ViewEngine';
import { Button, Typography, Grid} from '@material-ui/core';
import FilterIcon from '@material-ui/icons/Search';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
    label:{ 
        position: 'relative',
        top: theme.spacing(1),
        paddingLeft: theme.spacing(1)
    },
    root: {
        height: '100%',
        padding: theme.spacing(1, 0.5),
        '& .MuiTextField-root': {
            width: 150
        }
    },
    button: {
        marginLeft: theme.spacing(2)
    }
}));

const Filter = props => {

  const classes = useStyles();
  
  const [selectedFromDate, setSelectedFromDate] = React.useState(null)
  const [selectedToDate, setSelectedToDate] = React.useState(null)

  const handleFilter = () => {
    document.dispatchEvent( new CustomEvent(EVENT_ENGINE_FILTER, {
        detail: { from: selectedFromDate, to:  selectedToDate}
    }));
  }

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };
  
  useEffect(() => {
    function handleChange(event) { 
        if(event.detail && event.detail.from){
            setSelectedFromDate(new Date(event.detail.from));
        }else{
            setSelectedFromDate(null);
        }
        if(event.detail && event.detail.to){
            setSelectedToDate(new Date(event.detail.to));
        }else{
            setSelectedToDate(null);
        }
    }
    document.addEventListener(EVENT_ENGINE_LOADED, handleChange);
    return function cleanup(){
        document.removeEventListener(EVENT_ENGINE_LOADED, handleChange);
    }
  });

  return (
    <div className={classes.root}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
                <Typography 
                    className={classes.label} 
                    color="secondary" 
                    variant="overline" 
                    component="label">
                   <b>From</b>
                </Typography>
                <KeyboardDatePicker
                    id="from-date"
                    format="dd/MM/yyyy"
                    value={selectedFromDate}
                    maxDate={selectedToDate}
                    clearable={true}
                    onChange={handleFromDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'From',
                    }}
                />
                <Typography 
                    className={classes.label} 
                    color="secondary" 
                    variant="overline" 
                    component="label">
                   <b>To</b>
                </Typography>
                <KeyboardDatePicker
                    id="to-date"
                    format="dd/MM/yyyy"
                    minDate={selectedFromDate}
                    value={selectedToDate}
                    clearable={true}
                    onChange={handleToDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'To',
                    }}
                />
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    className={classes.button}
                    onClick={handleFilter}
                    endIcon={<FilterIcon/>}>
                    Filter
                </Button> 
            </Grid>   
        </MuiPickersUtilsProvider>      
    </div>
  );
};

export default Filter;