import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen, { type MainStackParamList } from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
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
      <Stack.Screen name={ROUTES.ORDERS} component={OrdersScreen} />
      <Stack.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

export default MainNav;
