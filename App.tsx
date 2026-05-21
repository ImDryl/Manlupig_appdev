import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureAppStore from './src/app/reducers';
import rootSaga from './src/app/sagas';
import AppNav from './src/navigations';
import { Toast, toastConfig } from './src/components/alertMsg';
import { CartProvider } from './src/context/CartContext';
import LoginWelcomeToast from './src/components/LoginWelcomeToast';

const { store, persistor, runSaga } = configureAppStore();
runSaga(rootSaga);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#c27100" />
          </View>
        }
        persistor={persistor}
      >
        <CartProvider>
          <View style={{ flex: 1 }}>
            <LoginWelcomeToast />
            <AppNav />
            <Toast config={toastConfig} />
          </View>
        </CartProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
