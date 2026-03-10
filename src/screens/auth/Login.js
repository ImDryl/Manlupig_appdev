import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator, // Added for the loading spinner
} from 'react-native';
// 1. Import Redux hooks and your classic action
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../redux/actions/authActions';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 2. Initialize Dispatch and grab state from the Vault
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector(state => state.auth);

  // 3. Watch for the token. When it arrives, move to Home!
  React.useEffect(() => {
    if (token) {
      navigation.replace('HomeScreen');
    }
  }, [token]);

  // 4. Show an alert if the Saga reports a failure
  React.useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
    }
  }, [error]);

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Hold up!', 'Please enter both your username and password.');
      return;
    }

    // 5. Instead of AsyncStorage, we tell Redux to handle it!
    // This triggers your Saga -> Axios -> Symfony
    dispatch(loginRequest({ username, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Welcome Back</Text>
      <Text style={styles.subHeader}>Sign in to continue</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading} // Disable while loading
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading} // Disable while loading
        />
      </View>

      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {/* 6. Show a spinner if we are waiting for Symfony */}
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... (Your styles remain exactly the same)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 40 },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loginButton: {
    backgroundColor: '#c27100', // Your nice orange/gold color
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#666' },
  linkText: { color: '#007AFF', fontWeight: 'bold' },
});
