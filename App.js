import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';

// 1. Import the Redux Provider and your custom Store
import { Provider } from 'react-redux';
import store from './src/redux/store';

import AppNav from './src/navigations';

const App = () => {
  return (
    // 2. Wrap your entire app inside the Provider so every screen can access the vault
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <AppNav />
      </View>
    </Provider>
  );
};

export default App;
