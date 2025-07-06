import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { passwordsAPI } from '../services/api';
import { Password, CreatePasswordData } from '../types';

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
    notes: '',
    category: 'General',
    url: '',
  });
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

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
      notes: '',
      category: 'General',
      url: '',
    });
    setShowPasswordDialog(true);
  };

  const handleEditPassword = (password: Password) => {
    setEditingPassword(password);
    setFormData({
      site: password.site,
      username: password.username,
      password: password.decryptedPassword || '',
      notes: password.notes,
      category: password.category,
      url: password.url,
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Password Manager
        </Typography>
        <Box>
          <Typography variant="body2" color="text.secondary" display="inline" mr={2}>
            Welcome, {user?.username}!
          </Typography>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Your Passwords ({passwords.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPassword}
        >
          Add Password
        </Button>
      </Box>

      <Grid container spacing={3}>
        {passwords.map((password) => (
          <Grid item xs={12} sm={6} md={4} key={password._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h2">
                    {password.site}
                  </Typography>
                  <Chip label={password.category} size="small" color="primary" />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Username: {password.username}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Password:
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      fontFamily: 'monospace',
                      backgroundColor: 'grey.100',
                      padding: '2px 6px',
                      borderRadius: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => copyToClipboard(password.decryptedPassword || '')}
                  >
                    {showPasswords[password._id] 
                      ? password.decryptedPassword 
                      : '••••••••'
                    }
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => togglePasswordVisibility(password._id)}
                  >
                    {showPasswords[password._id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Box>

                {password.notes && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notes: {password.notes}
                  </Typography>
                )}

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditPassword(password)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeletePassword(password._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  {password.url && (
                    <IconButton
                      size="small"
                      onClick={() => window.open(password.url, '_blank')}
                    >
                      <LaunchIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {passwords.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No passwords saved yet. Click "Add Password" to get started!
          </Typography>
        </Box>
      )}

      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPassword ? 'Edit Password' : 'Add New Password'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Site/Service"
            value={formData.site}
            onChange={(e) => setFormData({ ...formData, site: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL (optional)"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPassword ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 