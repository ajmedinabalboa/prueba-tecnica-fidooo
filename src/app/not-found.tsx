'use client';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h1" color="primary" fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary">
          La página que buscas no existe o ha sido movida.
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => router.push('/')}
          size="large"
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
}