import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Actionbar from './components/Actionbar/Actionbar';
import AuthService from '../../services/AuthService';
import { Redirect } from 'react-router-dom';
import Notification from '../../components/Common/Notification';
import Headbar from './components/Actionbar/Headbar';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64 + 50
    }
  },
  shiftContent: {
    paddingRight: 350
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);
  const [openActionbar, setOpenActionbar] = useState(false);

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };
  const handleActionbarClose = () => {
    setOpenActionbar(false);
  };
   
  const handleBarOpen = () => {
    setOpenSidebar(true);
    setOpenActionbar(true);
  };
   
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);

  const userInfo = AuthService.getUserInfo();

  if(!userInfo){
    return <Redirect to='/signin' />
  }

  const shouldOpenAction = isDesktop ? true : openActionbar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleBarOpen} />
      <Headbar open={shouldOpenAction} variant={'persistent'}/>
      <Sidebar onClose={handleSidebarClose} open={openSidebar} variant={'temporary'}/>
      <main className={classes.content}>
        {children}
      </main>
      <Actionbar onClose={handleActionbarClose} open={shouldOpenAction} variant={isDesktop ? 'persistent' : 'temporary'}/>
      <Notification message={success} setMessage={setSuccess} type="success" />
      <Notification message={error} setMessage={setError} type="error" />
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object
};

export default Main;
