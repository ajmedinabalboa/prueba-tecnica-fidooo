'use client';
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { SmartToy as BotIcon } from '@mui/icons-material';

const TypingIndicator: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: 2,
        animation: 'fadeIn 0.3s ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
        <BotIcon />
      </Avatar>
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          bgcolor: 'grey.100',
          borderRadius: 2,
          borderTopLeftRadius: 0.5,
        }}
      >
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          ChatGPT está escribiendo
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'secondary.main',
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                '@keyframes bounce': {
                  '0%, 80%, 100%': {
                    transform: 'scale(0)',
                  },
                  '40%': {
                    transform: 'scale(1)',
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TypingIndicator;