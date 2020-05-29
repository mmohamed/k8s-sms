import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import { TableContainer, Paper, Table, TableHead, TableCell, TableRow, TableBody, Card, CardHeader, CardContent } from '@material-ui/core';
import { EVENT_NODE_SELECTION } from '../../sms/ViewEngine';

const useStyles = makeStyles(theme => ({
    cardContent: {
        paddingTop: 0
    },
    cell: {
        padding: theme.spacing(0.2)
    }
}));

const HTTPTrafic = props => {
  
  const classes = useStyles();

  const [data, setData] = useState([]);
  
  document.addEventListener(EVENT_NODE_SELECTION, function(event) { 
    if(event.detail.isSelected){
        setData([
            {'direction': 'In', 'perSecond': 0.9, 'success': 100, 'error': 0},
            {'direction': 'Out', 'perSecond': 2.19, 'success': 98, 'error': 2}
        ]);
    }else{
        setData([]);
    }
  });

  let view = (
    <TableContainer component={Paper}>
        <Table size="small" aria-label="HTTP Trafic">
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell className={classes.cell} align="right">Total</TableCell>
                    <TableCell className={classes.cell} align="right">% Success</TableCell>
                    <TableCell className={classes.cell} align="right">% Error</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row) => (
                <TableRow key={row.direction}>
                    <TableCell className={classes.cell} component="th" scope="row">{row.direction}</TableCell>
                    <TableCell className={classes.cell} align="right">{row.perSecond}</TableCell>
                    <TableCell className={classes.cell} align="right">{row.success}</TableCell>
                    <TableCell className={classes.cell} align="right">{row.error}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    );
  
  if(!data.length){
    view = (<Alert severity="info">No data available !</Alert>);
  }
  
  return (
    <Card>
        <CardHeader className={classes.cardHeader} title="HTTP Trafic" titleTypographyProps={{color: 'primary', variant: 'h5'}}/>
        <CardContent className={classes.cardContent}>
            {view}
        </CardContent>
    </Card>
  );
};

export default HTTPTrafic;