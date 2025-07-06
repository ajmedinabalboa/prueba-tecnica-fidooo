'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useAuthGuard = ({ 
  redirectTo = '/', 
  requireAuth = true 
}: UseAuthGuardOptions = {}) => {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        router.push('/chat');
      }
    }
  }, [user, loading, router, redirectTo, requireAuth]);

  return { user, loading };
};