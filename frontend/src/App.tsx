import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, IconButton, Box, Switch } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { AnimatePresence, motion } from 'framer-motion';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import '@fontsource/poppins';

const lightPalette = {
  mode: 'light' as const,
  primary: { main: '#7c3aed' },
  secondary: { main: '#8ec5fc' },
  background: { default: '#f7f7fa', paper: 'rgba(255,255,255,0.96)' },
  text: { primary: '#232042', secondary: '#6b7280' },
};
const darkPalette = {
  mode: 'dark' as const,
  primary: { main: '#7c3aed' },
  secondary: { main: '#8ec5fc' },
  background: { default: '#232042', paper: 'rgba(30,30,40,0.96)' },
  text: { primary: '#f3f3f3', secondary: '#bdbdbd' },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        style={{ minHeight: '100vh' }}
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => createTheme({
    palette: darkMode ? darkPalette : lightPalette,
    typography: {
      fontFamily: 'Poppins, Arial, sans-serif',
      fontWeightBold: 600,
      fontWeightMedium: 500,
      fontWeightRegular: 400,
    },
    shape: { borderRadius: 8 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(4px)',
            background: darkMode
              ? 'rgba(30,30,40,0.96)'
              : 'rgba(255,255,255,0.96)',
            boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.08)',
            borderRadius: 8,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 6,
            boxShadow: '0 1px 4px rgba(162,89,255,0.04)',
            transition: 'all 0.2s',
            ':hover': {
              boxShadow: '0 2px 8px rgba(162,89,255,0.10)',
              transform: 'scale(1.02)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            background: darkMode ? '#232042' : '#f7f7fa',
          },
        },
      },
    },
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: darkMode
            ? 'linear-gradient(135deg, #232042 0%, #7c3aed 100%)'
            : 'linear-gradient(135deg, #f7f7fa 0%, #e0e7ff 100%)',
          animation: 'gradientMove 10s ease-in-out infinite alternate',
          '@keyframes gradientMove': {
            '0%': { backgroundPosition: '0% 50%' },
            '100%': { backgroundPosition: '100% 50%' },
          },
          backgroundSize: '200% 200%',
        }}
      />
      <AuthProvider>
        <Box sx={{ position: 'fixed', top: 18, right: 24, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => setDarkMode((d) => !d)} color="primary" size="large">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Switch checked={darkMode} onChange={() => setDarkMode((d) => !d)} color="primary" />
        </Box>
        <Router>
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
