import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IMG, showConfirm, showSuccess } from '../utils';
import { resetLogin } from '../app/reducers/auth';
import type { RootState } from '../app/reducers';
import { signOutGoogle } from '../utils/firebase';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const authData = useSelector((state: RootState) => state.auth?.data) as {
    data?: { user?: { email?: string } };
    user?: { email?: string };
    message?: string;
  } | null;

  const email =
    authData?.data?.user?.email ??
    authData?.user?.email ??
    'Signed in';

  const handleLogout = () => {
    showConfirm(
      'Log Out',
      'Are you sure you want to log out?',
      async () => {
        await signOutGoogle();
        dispatch(resetLogin());
        showSuccess('Logged Out', 'You have been signed out successfully.');
      },
      { confirmText: 'Log Out', destructive: true },
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: IMG.LOGO }} style={styles.logo} />
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{email}</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
