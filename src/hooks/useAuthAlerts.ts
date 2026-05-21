import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/reducers';
import { showSuccess } from '../utils/alert';

/** Shows a welcome alert once after a successful login on Home. */
export function useAuthAlerts(options?: { showLoginSuccess?: boolean }) {
  const { data } = useSelector((state: RootState) => state.auth);
  const loginSuccessShown = useRef(false);

  useEffect(() => {
    if (!options?.showLoginSuccess || !data || loginSuccessShown.current) {
      return;
    }

    const payload = data as { message?: string; success?: boolean };
    if (payload.success && payload.message) {
      loginSuccessShown.current = true;
      showSuccess('Welcome', payload.message);
    }
  }, [data, options?.showLoginSuccess]);
}
