'use client';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import ChatBox from '@/components/chat/ChatBox';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ChatPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <ProtectedRoute requireAuth={true} redirectTo="/">
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🔥 Firebase Chat App
            </Typography>
            
            {/* Notificaciones */}
            <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            {/* Menu de usuario */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.email ? getUserInitials(user.email) : <AccountIcon />}
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                '& .MuiPaper-root': {
                  minWidth: 200,
                  mt: 1,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Conectado
                </Typography>
              </Box>
              
              <MenuItem onClick={handleMenuClose}>
                <SettingsIcon sx={{ mr: 2 }} />
                Configuración
              </MenuItem>
              
              <MenuItem 
                onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}
                sx={{ color: 'error.main' }}
              >
                <LogoutIcon sx={{ mr: 2 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ flex: 1 }}>
          <ChatBox />
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default ChatPage;