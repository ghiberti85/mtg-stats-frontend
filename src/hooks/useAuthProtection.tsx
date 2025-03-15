// hooks/useAuthProtection.tsx
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../store';
import { useEffect } from 'react';

export default function useAuthProtection() {
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);
}
