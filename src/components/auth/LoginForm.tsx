'use client';
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
  Stack,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  PersonAdd,
  Login as LoginIcon,
} from '@mui/icons-material';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'info'>('error');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setMessage('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setMessage('Por favor, ingresa un correo válido.');
      setSeverity('error');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      setSeverity('error');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('¡Bienvenido!');
      setSeverity('success');
      router.push('/chat');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Error al iniciar sesión.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      setSeverity('error');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setMessage('Por favor, ingresa un correo válido.');
      setSeverity('error');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      setSeverity('error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setSeverity('error');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setSeverity('success');
      setTabValue(0);
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Register error:', error);
      let errorMessage = 'Error al registrarse.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Ya existe una cuenta con este correo.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      setSeverity('error');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!email) {
      setMessage('Ingresa tu correo para restablecer la contraseña.');
      setSeverity('error');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Por favor, ingresa un correo válido.');
      setSeverity('error');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
      setSeverity('success');
    } catch (error: any) {
      console.error('Reset error:', error);
      let errorMessage = 'Error al enviar el correo.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      setSeverity('error');
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Firebase Chat
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chat en tiempo real con Firebase y ChatGPT
            </Typography>
          </Box>
          
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab 
              label="Iniciar Sesión" 
              icon={<LoginIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Registrarse" 
              icon={<PersonAdd />} 
              iconPosition="start"
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type="email"
                  label="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
                
                <Divider>o</Divider>
                
                <Button
                  variant="text"
                  onClick={handleReset}
                  disabled={loading}
                  size="small"
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </Stack>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box component="form" onSubmit={handleRegister}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type="email"
                  label="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  helperText="Mínimo 6 caracteres"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </Stack>
            </Box>
          </TabPanel>

          {message && (
            <Box sx={{ p: 3, pt: 0 }}>
              <Alert severity={severity}>
                {message}
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;