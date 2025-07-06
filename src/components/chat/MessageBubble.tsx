// filepath: frontend/src/components/chat/MessageBubble.tsx
'use client';
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Fade,
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  currentUserEmail: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserEmail }) => {
  const isCurrentUser = message.user === currentUserEmail;
  const isSystem = message.user === 'Sistema' || message.user === 'ChatGPT' || message.isSystem;
  
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvatarColor = () => {
    if (message.user === 'ChatGPT') return 'secondary.main';
    if (message.user === 'Sistema') return 'warning.main';
    if (isCurrentUser) return 'primary.main';
    return 'grey.600';
  };

  const getBubbleColor = () => {
    if (isCurrentUser) return 'primary.main';
    if (message.user === 'ChatGPT') return 'secondary.light';
    if (message.user === 'Sistema') return 'warning.light';
    return 'grey.100';
  };

  const getTextColor = () => {
    if (isCurrentUser) return 'white';
    return 'text.primary';
  };

  const getUserDisplayName = () => {
    if (message.user === 'ChatGPT') return 'ChatGPT';
    if (message.user === 'Sistema') return 'Sistema';
    if (isCurrentUser) return 'Tú';
    return message.user.split('@')[0];
  };

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: getAvatarColor(),
            width: 40, 
            height: 40,
            boxShadow: 2,
          }}
        >
          {isSystem ? <BotIcon /> : <PersonIcon />}
        </Avatar>
        
        <Box sx={{ maxWidth: '75%', minWidth: '120px' }}>
          {/* Usuario y timestamp */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 0.5,
            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
          }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {getUserDisplayName()}
            </Typography>
            {isSystem && (
              <Chip 
                label="IA" 
                size="small" 
                color="secondary" 
                sx={{ height: 18, fontSize: '0.7rem' }}
              />
            )}
            <TimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatTime(message.createdAt)}
            </Typography>
          </Box>

          {/* Burbuja del mensaje */}
          <Paper
            elevation={isCurrentUser ? 3 : 1}
            sx={{
              p: 2,
              bgcolor: getBubbleColor(),
              color: getTextColor(),
              borderRadius: 2,
              borderTopLeftRadius: isCurrentUser ? 2 : 0.5,
              borderTopRightRadius: isCurrentUser ? 0.5 : 2,
              position: 'relative',
              boxShadow: isCurrentUser ? 3 : 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: isCurrentUser ? 4 : 2,
              },
              '&::before': isCurrentUser ? {} : {
                content: '""',
                position: 'absolute',
                top: 0,
                left: -8,
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderRight: `8px solid ${isSystem ? 'rgba(220, 0, 78, 0.12)' : '#f5f5f5'}`,
                borderBottom: '8px solid transparent',
              },
              '&::after': isCurrentUser ? {
                content: '""',
                position: 'absolute',
                top: 0,
                right: -8,
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderLeft: '8px solid #1976d2',
                borderBottom: '8px solid transparent',
              } : {},
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                wordBreak: 'break-word',
                lineHeight: 1.4,
                fontSize: '0.95rem',
              }}
            >
              {message.text}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
};

export default MessageBubble;