import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import { IMG } from '../../utils';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { resetRegister, userRegister } from '../../app/reducers/auth';
import type { RootState } from '../../app/reducers';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

type RegisterProps = {
  navigation: RegisterNavigationProp;
};

const MIN_PASSWORD_LENGTH = 6;

export default function Register({ navigation }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const {
    isRegistering,
    isRegisterSuccess,
    registerError,
    registerMessage,
  } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    if (registerError) {
      Alert.alert('Sign Up Failed', registerError);
    }
  }, [registerError]);

  React.useEffect(() => {
    if (isRegisterSuccess && registerMessage) {
      Alert.alert('Account Created', registerMessage, [
        {
          text: 'Go to Login',
          onPress: () => {
            dispatch(resetRegister());
            navigation.navigate('Login');
          },
        },
      ]);
    }
  }, [isRegisterSuccess, registerMessage, dispatch, navigation]);

  React.useEffect(() => {
    return () => {
      dispatch(resetRegister());
    };
  }, [dispatch]);

  const handleRegister = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password || !confirmPassword) {
      Alert.alert('Hold up!', 'Please fill in email and both password fields.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(
        'Weak password',
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    dispatch(userRegister({ email: trimmedEmail, password }));
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: IMG.LOGO }} style={styles.logo} />
      <Text style={styles.headerTitle}>Create Account</Text>
      <Text style={styles.subHeader}>Join us today!</Text>

      <View style={styles.card}>
        <CustomTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isRegistering}
        />

        <CustomTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isRegistering}
        />

        <CustomTextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isRegistering}
        />

        <Text style={styles.hint}>
          App sign-up is verified automatically. You can log in right away.
        </Text>

        <CustomButton
          label="Sign Up"
          onPress={handleRegister}
          loading={isRegistering}
          containerStyle={styles.registerButton}
        />

        <View style={styles.footerInline}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={isRegistering}
          >
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
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 8,
  },
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
