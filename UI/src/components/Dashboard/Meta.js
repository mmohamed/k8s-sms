import React from 'react';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingBottom: theme.spacing(0.5)
  },
  cardContent: {
    paddingTop: 0
  },
  listRoot: {
      padding: 0
  },
  listItem: {
    padding: theme.spacing(0, 1, 0, 1)
  },
  listItemIcon: {
    minWidth: 0
  },
  listItemText: {
    marginBottom: 0,
    marginTop: 0,
    '& .MuiTypography-displayBlock': {
        display: 'inline-block'
    },
    '& .MuiTypography-colorTextSecondary':{
        float: 'right'
    }
      
  }
}));

const Meta = props => {

  const classes = useStyles();
  
  const rows = [
      {name: 'Group name', value : 'app'},
      {name: 'Service name', value : 'app-service'},
      {name: 'Service namespace', value : 'app'},
      {name: 'Deployment name', value : 'app-deployment'},
      {name: 'Deployment namespace', value : 'app'},
      {name: 'HTTP Port', value : '80'},
  ];

  return (
    <Card>
        <CardHeader className={classes.cardHeader} title="Metadata" titleTypographyProps={{color: 'primary', variant: 'h5'}}/>
        <CardContent className={classes.cardContent}>
            <List className={classes.listRoot}>
                {rows.map((row) => (
                <ListItem className={classes.listItem} key={row.name}>
                    <ListItemIcon className={classes.listItemIcon}>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText className={classes.listItemText} primary={row.name} secondary={row.value}/>
                </ListItem>
                ))}
            </List>
        </CardContent>
    </Card>
  );
};

export default Meta;