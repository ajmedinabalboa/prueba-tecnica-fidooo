'use client';
import React from 'react';
import {
  Paper,
  Typography,
  Chip,
  Box,
  Badge,
} from '@mui/material';
import {
  Circle as OnlineIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

interface ChatHeaderProps {
  userEmail: string;
  connectedUsers: number;
  isOnline: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  userEmail, 
  connectedUsers, 
  isOnline 
}) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        borderRadius: 0,
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        bgcolor: 'primary.main',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" component="h1" fontWeight={600}>
            💬 Chat en Tiempo Real
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Conectado como: {userEmail}
            </Typography>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <OnlineIcon 
                  sx={{ 
                    color: isOnline ? 'success.main' : 'grey.500',
                    fontSize: 12 
                  }} 
                />
              }
            >
              <Box />
            </Badge>
          </Box>
        </Box>
        
        <Box sx={{ textAlign: 'right' }}>
          
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatHeader;