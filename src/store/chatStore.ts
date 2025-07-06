import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatState {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  connectedUsers: number;
  setConnectedUsers: (count: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  isTyping: false,
  setIsTyping: (typing) => set({ isTyping: typing }),
  connectedUsers: 0,
  setConnectedUsers: (count) => set({ connectedUsers: count }),
}));