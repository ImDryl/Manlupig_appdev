import { Alert, type AlertButton } from 'react-native';
import {
  showError as showErrorToast,
  showInfo as showInfoToast,
  showSuccess as showSuccessToast,
} from '../components/alertMsg';

export function showAlert(
  title: string,
  message: string,
  buttons?: AlertButton[],
): void {
  Alert.alert(title, message, buttons ?? [{ text: 'OK' }]);
}

export function showError(title: string, message: string): void {
  showErrorToast({ title, message });
}

export function showSuccess(
  title: string,
  message: string,
  onOk?: () => void,
): void {
  showSuccessToast({ title, message, onHide: onOk });
}

export function showInfo(title: string, message: string): void {
  showInfoToast({ title, message });
}

export function showConfirm(
  title: string,
  message: string,
  onConfirm: () => void,
  options?: { confirmText?: string; cancelText?: string; destructive?: boolean },
): void {
  showAlert(title, message, [
    { text: options?.cancelText ?? 'Cancel', style: 'cancel' },
    {
      text: options?.confirmText ?? 'OK',
      style: options?.destructive ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ]);
}

/** Extract message from Agrinest API login/register JSON */
export function getApiMessage(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof (payload as { message: unknown }).message === 'string'
  ) {
    return (payload as { message: string }).message;
  }
  return fallback;
}
