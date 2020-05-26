import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/styles';

import theme from './theme/theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import Routes from './Routes';

function App() {
  const browserHistory = createBrowserHistory();
  
  return (
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <Routes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
