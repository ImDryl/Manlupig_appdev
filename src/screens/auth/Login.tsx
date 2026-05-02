import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { IMG } from '../../utils';
import { USER_LOGIN_COMPLETED } from '../../app/actions';
import { userLogin } from '../../app/reducers/auth';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { _signInwithGoogle } from '../../utils/firebase';

// rename into tsx
// fix errors

// const Login: React.FC = {} => {

// }

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage } = useSelector(
    (state: any) => state.auth,
  );

  // isloading:boolean;
  // isError: boolean:
  // data: {
  //   status: boolean;
  //   message: String;

  // }
  // (val: string)
  // (val: number | string ) =>

  React.useEffect(() => {
    if (isError && errorMessage) {
      Alert.alert('Login Failed', errorMessage);
    }
  }, [isError, errorMessage]);

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Hold up!', 'Please enter your username and password.');
      return;
    }

    dispatch(userLogin({ username: username.trim(), password }));
  };

  const handleGoogleLogin = async () => {
    const result = await _signInwithGoogle();
    if (result.ok) {
      dispatch({
        type: USER_LOGIN_COMPLETED,
        payload: { provider: 'google', user: result.userInfo },
      });
      return;
    }
    if (!result.cancelled) {
      Alert.alert('Google sign-in', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: IMG.LOGO }} style={styles.logo} />
      <Text style={styles.headerTitle}>Welcome Back</Text>
      <Text style={styles.subHeader}>Sign in to continue</Text>

      <View style={styles.card}>
        <CustomTextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          editable={!isLoading}
          autoCapitalize="none"
        />

        <CustomTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <CustomButton
          label="Log In"
          onPress={handleLogin}
          loading={isLoading}
        />

        <GoogleSigninButton
          style={styles.googleSignInButton}
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Light}
          onPress={handleGoogleLogin}
        />

        <View style={styles.footerInline}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
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
  googleSignInButton: {
    marginTop: 10,
  },
});
