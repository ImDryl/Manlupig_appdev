import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type AlertMessageConfig = {
  title: string;
  message: string;
};

function AlertMessageBody({ title, message }: AlertMessageConfig) {
  return (
    <View style={styles.body}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export const alertContent = {
  customError: ({ title, message }: AlertMessageConfig) => (
    <AlertMessageBody title={title} message={message} />
  ),
  customSuccess: ({ title, message }: AlertMessageConfig) => (
    <AlertMessageBody title={title} message={message} />
  ),
  customInfo: ({ title, message }: AlertMessageConfig) => (
    <AlertMessageBody title={title} message={message} />
  ),
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});
