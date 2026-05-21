import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { alertContent } from '../../utils/alertContent';

type ToastRenderProps = {
  text1?: string;
  text2?: string;
};

export type AlertMessageProps = {
  title: string;
  message: string;
  position?: 'top' | 'bottom';
  visibilityTime?: number;
  onHide?: () => void;
};

type ToastKind = 'success' | 'error' | 'info';

const TOAST_THEME: Record<
  ToastKind,
  { borderLeftColor: string; backgroundColor: string }
> = {
  success: { borderLeftColor: '#2e7d32', backgroundColor: '#effcf2' },
  error: { borderLeftColor: '#c62828', backgroundColor: '#fff2f0' },
  info: { borderLeftColor: '#e65100', backgroundColor: '#fff6ea' },
};

function CustomToast({
  kind,
  text1,
  text2,
}: ToastRenderProps & { kind: ToastKind }) {
  const title = text1 ?? '';
  const message = text2 ?? '';
  const theme = TOAST_THEME[kind];
  const render =
    kind === 'success'
      ? alertContent.customSuccess
      : kind === 'error'
        ? alertContent.customError
        : alertContent.customInfo;

  return (
    <View
      style={[
        styles.toast,
        {
          borderLeftColor: theme.borderLeftColor,
          backgroundColor: theme.backgroundColor,
        },
      ]}
    >
      {render({ title, message })}
    </View>
  );
}

export const toastConfig = {
  success: (props: ToastRenderProps) => (
    <CustomToast kind="success" {...props} />
  ),
  error: (props: ToastRenderProps) => <CustomToast kind="error" {...props} />,
  info: (props: ToastRenderProps) => <CustomToast kind="info" {...props} />,
};

export const showInfo = ({
  title,
  message,
  position = 'top',
  visibilityTime = 3000,
  onHide,
}: AlertMessageProps) => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    position,
    visibilityTime,
    onHide,
  });
};

export const showSuccess = ({
  title,
  message,
  position = 'top',
  visibilityTime = 3000,
  onHide,
}: AlertMessageProps) => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position,
    visibilityTime,
    onHide,
  });
};

export const showError = ({
  title,
  message,
  position = 'top',
  visibilityTime = 3000,
  onHide,
}: AlertMessageProps) => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position,
    visibilityTime,
    onHide,
  });
};

export { Toast };

const styles = StyleSheet.create({
  toast: {
    width: '92%',
    minHeight: 72,
    borderLeftWidth: 6,
    borderRadius: 10,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});
