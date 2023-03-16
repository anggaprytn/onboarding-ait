import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../utils/hooks';
import { useSelector } from 'react-redux';

import Login from '../screens/Login';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import TermsAndConditions from '../screens/TermsAndConditions';

import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Search from '../screens/Search';

import BottomTabs from './BottomTabs';

export type RootStackParamList = {
  Login: undefined;
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  Home: undefined;
  Profile: undefined;
  BottomTabs: undefined;
  Search: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'BottomTabs'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: 'transparent',
          },
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: 'transparent',
          },
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const UnauthenticatedStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: 'transparent',
          },
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: 'transparent',
          },
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const { guestAuthenticate } = useAuth();
  const isSignedIn = useSelector(({ authSlice }: any) => authSlice.isSignedIn);

  useEffect(() => {
    if (!isSignedIn) {
      guestAuthenticate();
    }
  }, [guestAuthenticate, isSignedIn]);

  return isSignedIn ? <AuthenticatedStack /> : <UnauthenticatedStack />;
};

export default RootNavigator;
