'use client';
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/',
  fallback
}) => {
  const { user, loading } = useAuthGuard({ requireAuth, redirectTo });

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return fallback || (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  // Si requiere autenticación y no hay usuario, no renderizar nada
  // (el redirect ya se está manejando en el hook)
  if (requireAuth && !user) {
    return null;
  }

  // Si no requiere autenticación y hay usuario, no renderizar nada
  // (el redirect ya se está manejando en el hook)
  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;