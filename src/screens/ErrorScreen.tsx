import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';

export type ErrorStackParamList = {
  ErrorScreen: { message?: string } | undefined;
  Home: undefined;
};

type Props = StackScreenProps<ErrorStackParamList, 'ErrorScreen'>;

export default function ErrorScreen({ navigation, route }: Props) {
  const message = route.params?.message ?? 'Something went wrong.';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚠️ Error</Text>
      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Home')}
      >
        <Text style={styles.buttonText}>Go Back Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
