import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/reducers';
import { showSuccess } from '../utils/alert';

/** Tracks welcome toast across Home mount/unmount (useRef alone resets each visit). */
let loginWelcomeShownThisSession = false;

export function resetLoginWelcomeAlert(): void {
  loginWelcomeShownThisSession = false;
}

type AuthPayload = {
  success?: boolean;
  message?: string;
  data?: { token?: string };
};

/** Shows welcome toast once after login, not on every Home visit. */
export function useAuthAlerts(options?: { showLoginSuccess?: boolean }) {
  const data = useSelector((state: RootState) => state.auth?.data);

  useEffect(() => {
    if (!data) {
      loginWelcomeShownThisSession = false;
      return;
    }

    if (!options?.showLoginSuccess || loginWelcomeShownThisSession) {
      return;
    }

    const payload = data as AuthPayload;
    if (payload.success && payload.message) {
      loginWelcomeShownThisSession = true;
      showSuccess('Welcome', payload.message);
    }
  }, [data, options?.showLoginSuccess]);
}
