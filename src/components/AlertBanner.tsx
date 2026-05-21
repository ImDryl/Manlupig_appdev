import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type AlertBannerType = 'error' | 'success' | 'info';

type AlertBannerProps = {
  type: AlertBannerType;
  message: string;
  title?: string;
  onDismiss?: () => void;
};

const STYLES: Record<
  AlertBannerType,
  { bg: string; border: string; text: string; title: string }
> = {
  error: {
    bg: '#fef2f2',
    border: '#fecaca',
    text: '#991b1b',
    title: 'Error',
  },
  success: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#166534',
    title: 'Success',
  },
  info: {
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#92400e',
    title: 'Notice',
  },
};

export default function AlertBanner({
  type,
  message,
  title,
  onDismiss,
}: AlertBannerProps) {
  const palette = STYLES[type];
  const heading = title ?? palette.title;

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: palette.bg, borderColor: palette.border },
      ]}
    >
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: palette.text }]}>{heading}</Text>
        <Text style={[styles.message, { color: palette.text }]}>{message}</Text>
      </View>
      {onDismiss ? (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Dismiss alert"
        >
          <Text style={[styles.dismiss, { color: palette.text }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  textWrap: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  dismiss: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
});
