export interface Message {
  id: string;
  text: string;
  user: string;
  createdAt: any;
  isSystem?: boolean;
  timestamp?: number;
}

export interface ChatUser {
  email: string;
  displayName?: string;
  photoURL?: string;
  isOnline?: boolean;
  lastSeen?: any;
}