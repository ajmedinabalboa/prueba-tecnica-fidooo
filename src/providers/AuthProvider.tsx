'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  // Mostrar pantalla de carga inicial
  if (initializing) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Iniciando aplicación...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}