import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  card: {
    '& .MuiCardContent-root:last-child':{
        paddingBottom: theme.spacing(1)
      }
  },
  cardHeader: {
    paddingBottom: theme.spacing(2)
  },
  cardContent: {
    paddingTop: 0
  }
}));

const CardPane = props => {

  const { title, children, ...rest } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={classes.card}>
        <CardHeader 
            className={classes.cardHeader} 
            title={title} 
            titleTypographyProps={{color: 'primary', variant: 'h5'}}/>
        <CardContent 
            className={classes.cardContent}>
            { children }
        </CardContent>
    </Card>
  );
};

CardPane.propTypes = {
    title: PropTypes.string
  };
  

export default CardPane;