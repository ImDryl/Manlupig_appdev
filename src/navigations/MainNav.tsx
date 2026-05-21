import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen, { type MainStackParamList } from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ROUTES } from '../utils';

const Stack = createStackNavigator<MainStackParamList>();

function MainNav() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SHOP}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.SHOP} component={ShopScreen} />
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.CART} component={CartScreen} />
      <Stack.Screen name={ROUTES.CHECKOUT} component={CheckoutScreen} />
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default MainNav;
