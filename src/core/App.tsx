import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import RootNavigation from '../routes/RootNavigation';
import { store, persistor } from './store/_store/store';
import { useFont, useAuth } from '../utils/hooks';
import { PersistGate } from 'redux-persist/integration/react';

const MainApp = () => {
  const { loaded, error } = useFont();
  if (!loaded) {
    return null; // explicitly return null to indicate that nothing should be rendered
  }

  if (error) {
    console.error(error);
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default MainApp;
