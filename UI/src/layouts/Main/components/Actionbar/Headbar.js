import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Drawer, Grid, Divider } from '@material-ui/core';
import Loading from '../../../../components/Dashboard/Loading';
import Filter from '../../../../components/Dashboard/Filter';
import Scope from '../../../../components/Dashboard/Scope';

const useStyles = makeStyles(theme => ({
  drawer: {
    height: 50,
    width: 'calc(100% - 350px)',
    minWidth: 1170,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(0)
  }
}));

const Headbar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  return (
    <Drawer
      anchor="top"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div {...rest} className={clsx(classes.root, className)}> 
        <Grid container>
            <Divider orientation="vertical" flexItem variant="middle"/>
            <Grid item lg={3} md={3} xl={3} xs={3}>
                <Loading/>
            </Grid>
            <Divider orientation="vertical" flexItem variant="middle"/>
            <Grid item lg={5} md={5} xl={5} xs={5}>
                <Filter/>
            </Grid>
            <Divider orientation="vertical" flexItem variant="middle"/>
            <Grid item lg={2} md={2} xl={2} xs={2}>
                <Scope/>
            </Grid>
        </Grid>
      </div>
    </Drawer>
  );
};

Headbar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Headbar;
