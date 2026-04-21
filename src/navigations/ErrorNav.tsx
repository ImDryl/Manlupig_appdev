import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ErrorScreen from '../screens/ErrorScreen';

const Stack = createStackNavigator();

export default function ErrorNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ErrorScreen"
        component={ErrorScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
