'use client';
import LoginForm from '@/components/auth/LoginForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute requireAuth={false} redirectTo="/chat">
      <LoginForm />
    </ProtectedRoute>
  );
}