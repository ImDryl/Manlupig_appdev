import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { IMG, ROUTES, showError, showInfo } from '../../utils';
import {
  clearLoginError,
  userGoogleLogin,
  userLogin,
} from '../../app/reducers/auth';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/reducers';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import { _signInwithGoogle } from '../../utils/firebase';

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage } = useSelector(
    (state: RootState) => state.auth,
  );

  const busy = isLoading || googleLoading;
  const lastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (isError && errorMessage && errorMessage !== lastErrorRef.current) {
      lastErrorRef.current = errorMessage;
      showError('Login Failed', errorMessage);
      dispatch(clearLoginError());
    }
    if (!isError) {
      lastErrorRef.current = null;
    }
  }, [isError, errorMessage, dispatch]);

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      showInfo('Hold up!', 'Please enter your email and password.');
      return;
    }

    dispatch(userLogin({ email: email.trim(), password }));
  };

  const handleGoogleLogin = async () => {
    if (busy) {
      return;
    }

    setGoogleLoading(true);

    try {
      const result = await _signInwithGoogle();
      if (result.ok) {
        dispatch(userGoogleLogin({ idToken: result.idToken }));
        return;
      }
      if (!result.cancelled) {
        showError('Google Sign-In', result.message);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Google sign-in failed';
      showError('Google Sign-In', message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={IMG.LOGO} style={styles.logo} resizeMode="contain" />
      <Text style={styles.headerTitle}>Welcome Back</Text>
      <Text style={styles.subHeader}>Sign in to continue</Text>

      <View style={styles.card}>
        <CustomTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          editable={!busy}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <CustomTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!busy}
        />

        <CustomButton
          label="Log In"
          onPress={handleLogin}
          loading={isLoading}
          disabled={googleLoading}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <GoogleSignInButton
          onPress={handleGoogleLogin}
          loading={googleLoading}
          disabled={isLoading}
        />

        <View style={styles.footerInline}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.REGISTER)}
            disabled={busy}
          >
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

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
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  footerInline: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e6e6e6',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 14,
  },
});
