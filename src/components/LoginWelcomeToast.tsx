import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/reducers';
import { showSuccess } from '../utils';

type LoginPayload = {
  success?: boolean;
  message?: string;
  data?: { token?: string };
};

/**
 * Welcome toast once right after login — not on Home visits or app reopen with saved session.
 */
export default function LoginWelcomeToast() {
  const { data, isLoading } = useSelector((state: RootState) => state.auth);
  const prevIsLoadingRef = useRef(isLoading);
  const shownRef = useRef(false);

  useEffect(() => {
    if (!data) {
      shownRef.current = false;
      prevIsLoadingRef.current = isLoading;
      return;
    }

    const justFinishedLogin = prevIsLoadingRef.current && !isLoading;
    prevIsLoadingRef.current = isLoading;

    if (!justFinishedLogin || shownRef.current) {
      return;
    }

    const payload = data as LoginPayload;
    const message =
      payload.message ??
      (payload.success ? 'Login successful.' : undefined);

    if (payload.success !== false && message) {
      shownRef.current = true;
      showSuccess('Welcome', message);
    }
  }, [data, isLoading]);

  return null;
}
