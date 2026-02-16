import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Business as BusinessIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

import SectorView from './containers/SectorView.jsx';
import QuantView from './containers/QuantView.jsx';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const SectorPage = () => (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <SectorView />
  </Container>
);

const QuantPage = () => (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <QuantView />
  </Container>
);

const Navigation = () => {
  const location = useLocation();
  
  const menuItems = [
    { text: 'セクター別企業情報', path: '/sector-info', icon: <BusinessIcon /> },
    { text: 'クォント分析', path: '/quant-info', icon: <AnalyticsIcon /> },
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <AppBar
            position="fixed"
            sx={{
              width: `calc(100% - ${drawerWidth}px)`,
              ml: `${drawerWidth}px`,
            }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                株式分析システム
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <Navigation />
            </Box>
          </Drawer>
          
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              p: 3,
              width: `calc(100% - ${drawerWidth}px)`,
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="/" element={<SectorPage />} />
              <Route path="/sector-info" element={<SectorPage />} />
              <Route path="/quant-info" element={<QuantPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;

