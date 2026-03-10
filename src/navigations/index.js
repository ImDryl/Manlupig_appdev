import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the two Navigators 
import AuthNav from './AuthNav';
import MainNav from './MainNav';

export default function AppNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // This checks the phone's storage as soon as the app opens
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Look for the VIP ticket we saved in Login.js
        const token = await AsyncStorage.getItem('userToken');

        if (token !== null) {
          // If the token exists, let them into the main app!
          setIsAuthenticated(true);
        } else {
          // If no token, keep them at the login screen
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('Error checking for token:', error);
      } finally {
        // Stop the loading spinner once the check is done
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Show a loading spinner for a split second while checking storage
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#c27100" />
      </View>
    );
  }

  // Gatekeeper 
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNav /> : <AuthNav />}
    </NavigationContainer>
  );
}
