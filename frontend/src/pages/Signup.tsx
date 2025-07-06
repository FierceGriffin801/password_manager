import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { PersonAddOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await signup(username, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Password strength meter function
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (pwd.length >= 12) score++;
    return score;
  };
  const strength = getPasswordStrength(password);
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['#d32f2f', '#f57c00', '#fbc02d', '#388e3c', '#1976d2', '#388e3c'][strength];

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
        style={{ width: '100%' }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 2px 12px 0 rgba(162,89,255,0.08)',
            border: '1px solid #ede7f6',
          }}
        >
          <motion.div
            initial={{ scale: 0.7, rotate: 10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            style={{
              background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
              boxShadow: '0 2px 12px 0 rgba(162,89,255,0.08)',
            }}
          >
            <PersonAddOutlined sx={{ color: '#7c3aed', fontSize: 32 }} />
          </motion.div>
          <Typography component="h1" variant="h4" gutterBottom fontWeight={600} sx={{ letterSpacing: 0.5, color: '#232042', fontFamily: 'Poppins' }}>
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'dark' ? '#232042' : '#232042', fontWeight: 500, mb: 0.5, pl: 0.5 }}>
                Username *
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder="Enter your username"
                inputProps={{
                  style: {
                    color: theme.palette.mode === 'dark' ? '#f3f3f3' : '#232042',
                    textAlign: 'left',
                    paddingLeft: 12,
                    paddingTop: 18,
                    paddingBottom: 18,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: 18,
                  },
                  maxLength: 64,
                }}
                sx={{
                  borderRadius: 2,
                  mb: 2,
                  background: theme.palette.mode === 'dark' ? '#232042' : '#f7f7fa',
                }}
                InputProps={{ style: { color: theme.palette.mode === 'dark' ? '#f3f3f3' : '#232042' } }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'dark' ? '#232042' : '#232042', fontWeight: 500, mb: 0.5, pl: 0.5 }}>
                Email Address * *
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="Enter your email"
                inputProps={{
                  style: {
                    color: theme.palette.mode === 'dark' ? '#f3f3f3' : '#232042',
                    textAlign: 'left',
                    paddingLeft: 12,
                    paddingTop: 18,
                    paddingBottom: 18,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: 18,
                  },
                  maxLength: 64,
                }}
                sx={{
                  borderRadius: 2,
                  mb: 2,
                  background: theme.palette.mode === 'dark' ? '#232042' : '#f7f7fa',
                }}
                InputProps={{ style: { color: theme.palette.mode === 'dark' ? '#f3f3f3' : '#232042' } }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'dark' ? '#232042' : '#232042', fontWeight: 500, mb: 0.5, pl: 0.5 }}>
                Password * *
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Enter your password"
                inputProps={{
                  style: {
                    color: theme.palette.mode === 'dark' ? '#f3f3f3' : '#232042',
                    textAlign: 'left',
                    paddingLeft: 12,
                    paddingTop: 18,
                    paddingBottom: 18,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: 18,
                  },
                  maxLength: 64,
                }}
                sx={{
                  borderRadius: 2,
                  mb: 2,
                  background: theme.palette.mode === 'dark' ? '#232042' : '#f7f7fa',
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                        sx={{ color: theme.palette.mode === 'dark' ? '#bdbdbd' : '#7c3aed' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color: theme.palette.mode === 'dark' ? '#f3f3f3' : '#232042' },
                }}
              />
            </Box>
            {/* Password strength meter */}
            {password && (
              <Box sx={{ width: '100%', mb: 1 }}>
                <Box sx={{ height: 6, borderRadius: 2, background: '#ede7f6', mb: 0.5 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(strength / 5) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      height: '100%',
                      borderRadius: 2,
                      background: strengthColor,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: strengthColor }}>{strengthLabel}</Typography>
              </Box>
            )}
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'dark' ? '#232042' : '#232042', fontWeight: 500, mb: 0.5, pl: 0.5 }}>
                Confirm Password *
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                placeholder="Re-enter your password"
                inputProps={{
                  style: {
                    color: theme.palette.mode === 'dark' ? '#f3f3f3' : '#232042',
                    textAlign: 'left',
                    paddingLeft: 12,
                    paddingTop: 18,
                    paddingBottom: 18,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: 18,
                  },
                  maxLength: 64,
                }}
                sx={{
                  borderRadius: 2,
                  mb: 2,
                  background: theme.palette.mode === 'dark' ? '#232042' : '#f7f7fa',
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword((show) => !show)}
                        edge="end"
                        sx={{ color: theme.palette.mode === 'dark' ? '#bdbdbd' : '#7c3aed' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color: theme.palette.mode === 'dark' ? '#f3f3f3' : '#232042' },
                }}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, fontWeight: 600, fontSize: 18, borderRadius: 2, background: 'linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)', color: '#232042', boxShadow: '0 2px 8px rgba(162,89,255,0.08)' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'SIGN UP'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="#7c3aed" fontWeight={500}>
                  Already have an account? <span style={{ color: '#7c3aed' }}>Sign In</span>
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Signup; 