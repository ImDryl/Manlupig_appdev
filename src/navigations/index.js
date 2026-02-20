import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Import the two Navigators we just separated
import AuthNav from './AuthNav';
import MainNav from './MainNav';

export default function AppNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Change to true to test MainNav

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNav /> : <AuthNav />}
    </NavigationContainer>
  );
}
