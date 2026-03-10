import React from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Alert,
  DevSettings,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMG } from '../utils';

const ProfileScreen = () => {
  // 1. The Logout Function
  const handleLogout = async () => {
    try {
      // Tear up the VIP ticket in the phone's memory
      await AsyncStorage.removeItem('userToken');

      Alert.alert('Logged Out', 'You have been securely logged out.');

      // Instantly refresh the app to trigger the Gatekeeper in index.js
      DevSettings.reload();
    } catch (error) {
      console.log('Error clearing token:', error);
      Alert.alert('Error', 'There was a problem logging out.');
    }
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
