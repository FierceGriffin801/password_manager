import React, { useState } from 'react';
import { Box, Typography, Slider, Checkbox, FormControlLabel, TextField, Button, InputAdornment, IconButton, Paper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const DEFAULT_LENGTH = 12;
const MIN_LENGTH = 6;
const MAX_LENGTH = 32;
const MID_COMPLEXITY = 2;

function generatePassword(length: number, useNumbers: boolean, useSpecial: boolean, complexity: number) {
  let charset = 'abcdefghijklmnopqrstuvwxyz';
  if (complexity > 1) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNumbers) charset += '0123456789';
  if (useSpecial) charset += '!@#$%^&*()-_=+[]{};:,.<>?';
  // Add more complexity: avoid ambiguous chars, etc.
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

const PasswordGenerator: React.FC = () => {
  const [complexity, setComplexity] = useState(MID_COMPLEXITY);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [length, setLength] = useState(DEFAULT_LENGTH);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const pwd = generatePassword(length, useNumbers, useSpecial, complexity);
    setPassword(pwd);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 4, background: 'rgba(255,255,255,0.96)', boxShadow: '0 2px 12px 0 rgba(162,89,255,0.08)', maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Password Generator
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <Slider
          value={complexity}
          min={1}
          max={3}
          step={1}
          marks={[{ value: 1, label: 'Simple' }, { value: 2, label: 'Medium' }, { value: 3, label: 'Complex' }]}
          onChange={(_, val) => setComplexity(val as number)}
          sx={{ flex: 1, mr: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          Complexity
        </Typography>
      </Box>
      <Box display="flex" gap={2} mb={2}>
        <FormControlLabel
          control={<Checkbox checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} />}
          label="Numbers"
        />
        <FormControlLabel
          control={<Checkbox checked={useSpecial} onChange={e => setUseSpecial(e.target.checked)} />}
          label="Special Chars"
        />
        <TextField
          label="Length"
          type="number"
          size="small"
          value={length}
          onChange={e => setLength(Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, Number(e.target.value))))}
          inputProps={{ min: MIN_LENGTH, max: MAX_LENGTH, style: { width: 60 } }}
          sx={{ width: 100 }}
        />
      </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Generated Password"
          value={password}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleCopy} disabled={!password}>
                  <ContentCopyIcon color={copied ? 'success' : 'inherit'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleGenerate} sx={{ fontWeight: 600, borderRadius: 2 }}>
          Generate
        </Button>
      </Box>
    </Paper>
  );
};

export default PasswordGenerator; 