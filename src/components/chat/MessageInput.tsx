'use client';
import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  loading, 
  disabled = false 
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || disabled) return;
    
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Paper 
      elevation={8} 
      sx={{ 
        p: 2, 
        borderRadius: 0,
        borderTop: '1px solid',
        borderTopColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          {/* Botones adicionales */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Tooltip title="Adjuntar archivo">
              <IconButton 
                size="small" 
                color="primary"
                disabled={disabled}
              >
                <AttachIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Emojis">
              <IconButton 
                size="small" 
                color="primary"
                disabled={disabled}
              >
                <EmojiIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Campo de texto */}
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            placeholder={disabled ? "Conectando..." : "Escribe tu mensaje..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || disabled}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'grey.50',
              },
            }}
          />

          {/* Botón de envío */}
          <Fab
            size="small"
            color="primary"
            type="submit"
            disabled={loading || !input.trim() || disabled}
            sx={{
              ml: 1,
              boxShadow: 2,
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.2s',
              },
              '&:disabled': {
                bgcolor: 'grey.300',
              },
            }}
          >
            <SendIcon />
          </Fab>
        </Box>
      </Box>
    </Paper>
  );
};

export default MessageInput;