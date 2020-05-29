import React, { useState } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import palette from './../../theme/palette';
import Alert from '@material-ui/lab/Alert';
import { EVENT_NODE_SELECTION } from '../../sms/ViewEngine';

const useStyles = makeStyles(theme => ({
    cardContent: {
        paddingTop: 0
    },
    chartContainer: {
        maxHeight: 150,
        position: 'relative'
    }
}));

const HTTPStatus = props => {
  
  const classes = useStyles();

  const [data, setData] = useState({});
  
  document.addEventListener(EVENT_NODE_SELECTION, function(event) { 
    if(event.detail.isSelected){
        setData({
            labels: ['OK', '3xx', '4xx', '5xx', 'Other'],
            datasets: [
              {
                label: 'In',
                backgroundColor: palette.primary.main,
                data: [88, 4, 4, 3, 1]
              },
              {
                label: 'Out',
                backgroundColor: palette.primary.light,
                data: [19, 0, 12, 69, 0]
              }
            ]
        });
    }else{
        setData({});
    }
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    legend: { display: false },
    cornerRadius: 20,
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      borderWidth: 1,
      borderColor: palette.divider,
      backgroundColor: palette.white,
      titleFontColor: palette.text.primary,
      bodyFontColor: palette.text.secondary,
      footerFontColor: palette.text.secondary
    },
    layout: { padding: 0 },
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: palette.text.secondary
          },
          gridLines: {
            display: true,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: palette.divider
          }
        }
      ]
    }
  };

  
  let view = (<HorizontalBar data={data} options={options}/>);
  
  if(!data.labels){
    view = (<Alert severity="info">No data available !</Alert>);
  }
  return (
    <Card>
        <CardHeader className={classes.cardHeader} title="HTTP Status" titleTypographyProps={{color: 'primary', variant: 'h5'}}/>
        <CardContent className={classes.cardContent}>
            <div className={classes.chartContainer}>
                {view}
            </div>
        </CardContent>
    </Card>
  );
};

export default HTTPStatus;