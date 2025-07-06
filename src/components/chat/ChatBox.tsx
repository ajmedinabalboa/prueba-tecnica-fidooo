'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Typography,
} from '@mui/material';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
} from 'firebase/firestore';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useChatService } from '@/hooks/useChatService';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ChatHeader from './ChatHeader';

const ChatBox: React.FC = () => {
  const { user } = useAuthStore();
  const { messages, setMessages, isTyping, setIsTyping, connectedUsers, setConnectedUsers } = useChatStore();
  const { sendMessage: sendChatGPTMessage, loading: gptLoading, error: gptError } = useChatService();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Conectar a Firestore y escuchar mensajes en tiempo real
  useEffect(() => {
    if (!user) return;

    console.log('👂 [FIRESTORE] Configurando listener de mensajes...');
    let unsubscribeMessages: () => void;
    
    try {
      // Crear query para mensajes ordenados por fecha
      const q = query(collection(db, 'messages'), orderBy('createdAt'));
      
      // Escuchar cambios en tiempo real
      unsubscribeMessages = onSnapshot(
        q, 
        (snapshot) => {
          console.log('📨 [FIRESTORE] Nuevos mensajes recibidos:', snapshot.docs.length);
          
          const msgs: Message[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Message[];
          
          console.log('💬 [FIRESTORE] Mensajes procesados:', msgs.length);
          setMessages(msgs);
          setIsConnected(true);
          setConnectionError(null);
        },
        (error) => {
          console.error('❌ [FIRESTORE] Error listening to messages:', error);
          setConnectionError('Error de conexión con la base de datos');
          setIsConnected(false);
        }
      );

      // Simular contador de usuarios conectados
      const connectedCount = Math.floor(Math.random() * 5) + 1;
      setConnectedUsers(connectedCount);
      console.log('👥 [FIRESTORE] Usuarios conectados simulados:', connectedCount);

    } catch (error) {
      console.error('❌ [FIRESTORE] Error setting up listener:', error);
      setConnectionError('Error al conectar con la base de datos');
    }

    return () => {
      if (unsubscribeMessages) {
        console.log('🔌 [FIRESTORE] Desconectando listener...');
        unsubscribeMessages();
      }
    };
  }, [user, setMessages, setConnectedUsers]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Función para enviar mensajes CON ChatGPT real
  const sendMessage = async (messageText: string) => {
    if (!user || !messageText.trim()) return;

    console.log('🚀 [CHAT] === INICIANDO ENVÍO DE MENSAJE ===');
    console.log('👤 [CHAT] Usuario:', user.email);
    console.log('💬 [CHAT] Mensaje:', messageText);
    
    setLoading(true);
    
    try {
      // 1. Guardar mensaje del usuario en Firestore
      console.log('💾 [FIRESTORE] Guardando mensaje del usuario...');
      const userMessage: Partial<Message> = {
        text: messageText,
        user: user.email!,
        createdAt: serverTimestamp(),
        isSystem: false,
      };

      await addDoc(collection(db, 'messages'), userMessage);
      console.log('✅ [FIRESTORE] Mensaje del usuario guardado');

      // 2. Mostrar indicador de escritura
      console.log('⌨️ [CHAT] Activando indicador de escritura...');
      setIsTyping(true);

      // 3. Llamar al backend de ChatGPT
      console.log('🤖 [CHAT] Llamando al backend de ChatGPT...');
      const gptResponse = await sendChatGPTMessage(messageText);
      
      if (gptResponse) {
        console.log('✅ [CHAT] Respuesta de ChatGPT recibida:', gptResponse.text.substring(0, 50) + '...');
        
        // 4. Guardar respuesta de ChatGPT en Firestore
        console.log('💾 [FIRESTORE] Guardando respuesta de ChatGPT...');
        const gptMessage: Partial<Message> = {
          text: gptResponse.text,
          user: 'ChatGPT',
          createdAt: serverTimestamp(),
          isSystem: true,
        };
        
        await addDoc(collection(db, 'messages'), gptMessage);
        console.log('✅ [FIRESTORE] Respuesta de ChatGPT guardada');
      } else {
        console.error('❌ [CHAT] No se recibió respuesta de ChatGPT. Error:', gptError);
        
        // Mensaje de error
        const errorMessage: Partial<Message> = {
          text: gptError || 'Lo siento, no pude procesar tu mensaje en este momento. Por favor, intenta de nuevo.',
          user: 'ChatGPT',
          createdAt: serverTimestamp(),
          isSystem: true,
        };
        
        await addDoc(collection(db, 'messages'), errorMessage);
        console.log('💾 [FIRESTORE] Mensaje de error guardado');
      }

    } catch (error) {
      console.error('💥 [CHAT] Error general:', error);
      setConnectionError('Error al enviar el mensaje');
      
      // Mensaje de error en el chat
      const errorMessage: Partial<Message> = {
        text: 'Error de conexión. Por favor, intenta de nuevo.',
        user: 'ChatGPT',
        createdAt: serverTimestamp(),
        isSystem: true,
      };
      
      try {
        await addDoc(collection(db, 'messages'), errorMessage);
      } catch (dbError) {
        console.error('❌ [FIRESTORE] Error guardando mensaje de error:', dbError);
      }
    } finally {
      console.log('🏁 [CHAT] Finalizando envío de mensaje');
      setIsTyping(false);
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del chat */}
      <ChatHeader 
        userEmail={user.email!}
        connectedUsers={connectedUsers}
        isOnline={isConnected}
      />

      {/* Área de mensajes */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'grey.50',
      }}>
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
        }}>
          {/* Indicador de conexión */}
          {!isConnected && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              gap: 1
            }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                Conectando a Firestore...
              </Typography>
            </Box>
          )}

          {/* Mensaje de bienvenida */}
          {messages.length === 0 && isConnected ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
              textAlign: 'center',
              gap: 2
            }}>
              <Typography variant="h6" gutterBottom>
                🤖 ¡Chat con ChatGPT Activo! 
              </Typography>
              <Typography variant="body2">
                Conectado a OpenAI y Firebase Firestore
              </Typography>
              <Typography variant="body2">
                Envía tu primer mensaje para obtener una respuesta de ChatGPT
              </Typography>
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: 'primary.light', 
                borderRadius: 2,
                color: 'white'
              }}>
                <Typography variant="caption">
                  ✅ Autenticación: Activa<br/>
                  ✅ Firestore: Conectado<br/>
                  ✅ ChatGPT: Habilitado
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  currentUserEmail={user.email || ''}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input de mensajes */}
      <MessageInput 
        onSendMessage={sendMessage} 
        loading={loading || gptLoading}
        disabled={!isConnected}
      />

      {/* Error snackbar */}
      <Snackbar
        open={!!connectionError}
        autoHideDuration={6000}
        onClose={() => setConnectionError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setConnectionError(null)} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {connectionError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatBox;