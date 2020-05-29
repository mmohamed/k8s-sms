import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { TableContainer, Paper, Table, TableHead, TableCell, TableRow, TableBody, Card, CardHeader, CardContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    cardContent: {
        paddingTop: 0
    },
    cell: {
        padding: theme.spacing(0.2)
    }
}));

const HTTPPane = props => {
  
  const classes = useStyles();

  const rows = [
    {'direction': 'In', 'perSecond': 0.9, 'success': 100, 'error': 0},
    {'direction': 'Out', 'perSecond': 2.19, 'success': 98, 'error': 2}
  ];
  
  return (
    <Card>
        <CardHeader className={classes.cardHeader} title="HTTP State" titleTypographyProps={{color: 'primary', variant: 'h5'}}/>
        <CardContent className={classes.cardContent}>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="HTTP state">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell className={classes.cell} align="right">Total</TableCell>
                            <TableCell className={classes.cell} align="right">% Success</TableCell>
                            <TableCell className={classes.cell} align="right">% Error</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
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
        </CardContent>
    </Card>
  );
};

export default HTTPPane;