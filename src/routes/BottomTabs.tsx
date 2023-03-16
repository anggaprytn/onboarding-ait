/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import { Feather } from '@expo/vector-icons';
import { defaultColors } from '../themes';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const screenOptions = ({ route }: BottomTabScreenProps<any, any>) => ({
    headerShown: false,
    tabBarIcon: ({
      color,
      size,
    }: {
      focused: boolean;
      color: string;
      size: number;
    }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = 'home';
      } else if (route.name === 'Profile') {
        iconName = 'user';
      }

      return <Feather name={iconName} size={size} color={color} />;
    },
  });

  const tabBarOptions: any = {
    activeTintColor: defaultColors.buttonEnableBg,
    inactiveTintColor: 'gray',
    showLabel: false,
  };

  return (
    <Tab.Navigator screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
