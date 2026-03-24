import React from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Alert,
  DevSettings,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { IMG } from '../utils';
import { resetLogin } from '../redux/reducers/authReducer';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  // 1. The Logout Function
  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          dispatch(resetLogin());
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'blue',
        borderWidth: 3,
      }}
    >
      <Image
        source={{
          uri: IMG.LOGO,
        }}
        style={{
          width: 200,
          height: 200,
        }}
      />
      <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
        ProfileScreen
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: '#ff3b30',
          paddingHorizontal: 40,
          paddingVertical: 12,
          borderRadius: 8,
          marginTop: 40,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
