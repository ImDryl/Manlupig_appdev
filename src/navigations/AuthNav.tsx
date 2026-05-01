import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';

// Utils
import { ROUTES } from '../utils';

const Stack = createStackNavigator();

// AuthNav.js into .tsx
function AuthNav() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
    </Stack.Navigator>
  );
}

export default AuthNav;
