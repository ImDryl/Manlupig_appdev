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

function AuthNav() {
  return (
    <Stack.Navigator 
        initialRouteName={ROUTES.LOGIN} 
        screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
      
    </Stack.Navigator>
  );
}

export default AuthNav;