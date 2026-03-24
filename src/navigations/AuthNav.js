import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ProfileScreen from '../screens/ProfileScreen';

// Utils
import { ROUTES } from '../utils';

const Stack = createStackNavigator();

// AuthNav.js
function AuthNav() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
    </Stack.Navigator>
  );
}

export default AuthNav;
