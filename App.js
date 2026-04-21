import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureAppStore from './src/app/reducers';
import rootSaga from './src/app/sagas';
import AppNav from './src/navigations';

const { store, persistor, runSaga } = configureAppStore();
runSaga(rootSaga);

const App = () => {
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
        <View style={{ flex: 1 }}>
          <AppNav />
        </View>
      </PersistGate>
    </Provider>
  );
};

export default App;
