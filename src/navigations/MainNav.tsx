import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen, { type MainStackParamList } from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ROUTES } from '../utils';

const Stack = createStackNavigator<MainStackParamList>();

function MainNav() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.HOME}>
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default MainNav;
