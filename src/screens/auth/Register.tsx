import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { IMG } from '../../utils';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

type RegisterProps = {
  navigation: RegisterNavigationProp;
};

export default function Register({ navigation }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    console.log('Registering:', name);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: IMG.LOGO }} style={styles.logo} />
      <Text style={styles.headerTitle}>Create Account</Text>
      <Text style={styles.subHeader}>Join us today!</Text>

      <View style={styles.card}>
        <CustomTextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
        />

        <CustomTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton
          label="Sign Up"
          onPress={handleRegister}
          containerStyle={styles.registerButton}
        />

        <View style={styles.footerInline}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
    alignItems: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 40 },
  registerButton: {
    marginTop: 8,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerInline: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  footerText: { color: '#666', textAlign: 'center' },
  linkText: { color: '#007AFF', fontWeight: 'bold' },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
});
