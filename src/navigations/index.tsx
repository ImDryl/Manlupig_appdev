import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import AuthNav from './AuthNav';
import MainNav from './MainNav';
import type { RootState } from '../app/reducers';

type AppStackParamList = {
  Main: undefined;
  Auth: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

export default function AppNav() {
  const data = useSelector((state: RootState) => state.auth?.data ?? null);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {data ? (
          <Stack.Screen name="Main" component={MainNav} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNav} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
