import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  type User,
} from '@react-native-google-signin/google-signin';

/**
 * Web OAuth client ID (client_type 3) from `android/app/google-services.json`.
 * Required on Android for a valid sign-in / ID token with Firebase-backed projects.
 */
const GOOGLE_WEB_CLIENT_ID =
  '844470069577-g2mcsv5orb4i1p2gj9m4ldmcvn4hnu0i.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

function googleErrorMessage(error: unknown): string {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        return 'Sign-in was cancelled.';
      case statusCodes.IN_PROGRESS:
        return 'Sign-in is already in progress.';
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play services are missing or out of date. Use an emulator image with Google Play, or update Play services.';
      default:
        return error.message || 'Google sign-in failed. If this persists, add your debug SHA-1 in Firebase Console and download a fresh google-services.json.';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Google sign-in failed.';
}

export type GoogleSignInResult =
  | { ok: true; userInfo: User }
  | { ok: false; cancelled: true }
  | { ok: false; cancelled: false; message: string };

export async function _signInwithGoogle(): Promise<GoogleSignInResult> {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const response = await GoogleSignin.signIn();
    if (isSuccessResponse(response)) {
      return { ok: true, userInfo: response.data };
    }
    return { ok: false, cancelled: true };
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      error.code === statusCodes.SIGN_IN_CANCELLED
    ) {
      return { ok: false, cancelled: true };
    }
    return {
      ok: false,
      cancelled: false,
      message: googleErrorMessage(error),
    };
  }
}
