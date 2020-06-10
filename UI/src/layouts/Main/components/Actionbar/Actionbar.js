import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Drawer } from '@material-ui/core';
import Meta from '../../../../components/Dashboard/Meta';
import HTTPTrafic from '../../../../components/Dashboard/HTTPTrafic';
import HTTPStatus from '../../../../components/Dashboard/HTTPStatus';
import Service from '../../../../components/Dashboard/Service';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 350,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0)
  },
  divider: {
    margin: theme.spacing(2, 0)
  }
}));

const Actionbar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div {...rest} className={clsx(classes.root, className)}> 
        <Meta/>
        <HTTPTrafic/>
        <HTTPStatus/>
        <Service/>
      </div>
    </Drawer>
  );
};

Actionbar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Actionbar;
