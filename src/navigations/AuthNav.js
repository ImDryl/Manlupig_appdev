import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';

// Utils (Make sure LOGIN and REGISTER are defined in your utils file!)
import { ROUTES } from '../utils';

const Stack = createStackNavigator();

function AuthNav() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.LOGIN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
    </Stack.Navigator>
  );
}

export default AuthNav;
