import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import AuthService from '../../../../../services/AuthService';
import { deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  let userInfo = AuthService.getUserInfo();

  if(!userInfo){
    userInfo = {
      username: '',
    }
  }
  
  const user = {
    name: userInfo.username.substring(0, userInfo.username.indexOf('@')),
    company: userInfo.username.substring(userInfo.username.indexOf('@')+1),
    avatar: userInfo.username.substring(0, 2).toUpperCase()
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={(classes.avatar, classes.purple)}
        component={RouterLink}
        to="/settings"
      >
        {user.avatar}
      </Avatar>
      <Typography
        className={classes.name}
        variant="h4"
      >
        {user.name}
      </Typography>
      <Typography variant="body2">{user.company}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
