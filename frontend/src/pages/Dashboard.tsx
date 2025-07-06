import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { passwordsAPI } from '../services/api';
import { Password, CreatePasswordData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import PasswordGenerator from '../components/PasswordGenerator';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  const [formData, setFormData] = useState<CreatePasswordData>({
    site: '',
    username: '',
    password: '',
  });
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [showPasswordGen, setShowPasswordGen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const data = await passwordsAPI.getAll();
      setPasswords(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch passwords');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPassword = () => {
    setEditingPassword(null);
    setFormData({
      site: '',
      username: '',
      password: '',
    });
    setShowPasswordDialog(true);
  };

  const handleEditPassword = (password: Password) => {
    setEditingPassword(password);
    setFormData({
      site: password.site,
      username: password.username,
      password: password.decryptedPassword || '',
    });
    setShowPasswordDialog(true);
  };

  const handleDeletePassword = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        await passwordsAPI.delete(id);
        setPasswords(passwords.filter(p => p._id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete password');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingPassword) {
        const updated = await passwordsAPI.update(editingPassword._id, formData);
        setPasswords(passwords.map(p => p._id === updated._id ? updated : p));
      } else {
        const newPassword = await passwordsAPI.create(formData);
        setPasswords([newPassword, ...passwords]);
      }
      setShowPasswordDialog(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save password');
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h3" component="h1" fontWeight={600} sx={{ letterSpacing: 0.5, color: '#232042', fontFamily: 'Poppins' }}>
            Password Manager
          </Typography>
          <Box>
            <Typography variant="body2" color="text.secondary" display="inline" mr={2} fontWeight={500}>
              Welcome, {user?.username}!
            </Typography>
            <Button variant="outlined" onClick={logout} sx={{ borderRadius: 2, fontWeight: 500, px: 3, color: '#232042', borderColor: '#d1c4e9', ':hover': { borderColor: '#a259ff', background: '#f3eaff' } }}>
              Logout
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={500} color="#232042">
            Your Passwords ({passwords.length})
          </Typography>
          <Tooltip title="Add Password" arrow>
            <Fab
              color="primary"
              onClick={handleAddPassword}
              sx={{
                background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                color: '#232042',
                boxShadow: '0 2px 8px 0 rgba(162,89,255,0.10)',
                fontWeight: 600,
                width: 48,
                height: 48,
                minHeight: 0,
                minWidth: 0,
                '&:hover': {
                  background: 'linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%)',
                  transform: 'scale(1.04)',
                },
              }}
            >
              <AddIcon fontSize="medium" />
            </Fab>
          </Tooltip>
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" sx={{ fontWeight: 600, borderRadius: 2 }} onClick={() => setShowPasswordGen(true)}>
            Generate Password
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 4 }}>
          <AnimatePresence>
            {passwords.map((password) => (
              <motion.div
                key={password._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 4,
                    background: theme.palette.mode === 'dark' ? 'rgba(30,30,40,0.96)' : 'rgba(255,255,255,0.92)',
                    boxShadow: '0 2px 12px 0 rgba(162,89,255,0.08)',
                    border: '1px solid #ede7f6',
                    p: 3,
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" component="h2" fontWeight={600} sx={{ color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#7c3aed' }}>
                        {password.site}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#f3f3f3' : 'text.secondary' }} gutterBottom fontWeight={500}>
                      Username: {password.username}
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#bdbdbd' : 'text.secondary', mr: 1 }} fontWeight={500}>
                        Password:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          fontFamily: 'monospace',
                          backgroundColor: theme.palette.mode === 'dark' ? '#232042' : '#f3eaff',
                          color: theme.palette.mode === 'dark' ? '#f3f3f3' : '#232042',
                          padding: '2px 6px',
                          borderRadius: 1,
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                        onClick={() => copyToClipboard(password.decryptedPassword || '')}
                      >
                        {showPasswords[password._id]
                          ? (password.decryptedPassword ? password.decryptedPassword : 'Password unavailable')
                          : '••••••••'}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => togglePasswordVisibility(password._id)}
                        sx={{ ml: 1, color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#7c3aed' }}
                      >
                        {showPasswords[password._id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Box>
                        <Tooltip title="Edit" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleEditPassword(password)}
                            sx={{ color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#7c3aed' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeletePassword(password._id)}
                            sx={{ color: theme.palette.mode === 'dark' ? '#ff8a80' : '#e57373' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>

        {passwords.length === 0 && (
          <Box textAlign="center" mt={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
              style={{ display: 'inline-block' }}
            >
              <img
                src="https://assets10.lottiefiles.com/packages/lf20_2ks3pjua.json"
                alt="No passwords yet"
                width={160}
                height={160}
                style={{ marginBottom: 12, borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(162,89,255,0.08)' }}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            </motion.div>
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              No passwords saved yet. Click <span style={{ color: '#7c3aed' }}>Add Password</span> to get started!
            </Typography>
          </Box>
        )}

        <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 500, color: '#232042', fontFamily: 'Poppins', letterSpacing: 0.2 }}>
            {editingPassword ? 'Edit Password' : 'Add New Password'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Site/Service *"
              value={formData.site}
              onChange={(e) => setFormData({ ...formData, site: e.target.value })}
              margin="normal"
              required
              sx={{ borderRadius: 1, mb: 2, background: '#f7f7fa' }}
            />
            <TextField
              fullWidth
              label="Username *"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              margin="normal"
              required
              sx={{ borderRadius: 1, mb: 2, background: '#f7f7fa' }}
            />
            <TextField
              fullWidth
              label="Password *"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              required
              sx={{ borderRadius: 1, mb: 2, background: '#f7f7fa' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPasswordDialog(false)} sx={{ borderRadius: 1, fontWeight: 400, color: '#232042' }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 1, fontWeight: 500, background: 'linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)', color: '#232042', boxShadow: '0 1px 4px rgba(162,89,255,0.04)' }}>
              {editingPassword ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showPasswordGen} onClose={() => setShowPasswordGen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Password Generator</DialogTitle>
          <DialogContent>
            <PasswordGenerator />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPasswordGen(false)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default Dashboard; 