import React, { FC, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Text from '../text';
import { useNavigation } from '@react-navigation/core';
import { Feather } from '@expo/vector-icons';
import { defaultColors } from '../../../../themes';

interface HeaderProps {
  title: string;
}

const statusBarHeight = getStatusBarHeight();

const Header: FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultColors.white,
        // backgroundColor: 'pink',
        height: 56 + statusBarHeight,
        elevation: 20,
      }}>
      <View
        style={{
          marginTop: statusBarHeight,
          flexDirection: 'row',
          alignItems: 'center',
          height: 56,
          width: wp(100),
          justifyContent: 'space-between',
        }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            height: 56,
            width: 56,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather
            name="chevron-left"
            size={25}
            color={defaultColors.textFooterDate}
          />
        </Pressable>

        <Text type="bold" size={18}>
          {title}
        </Text>
        <Pressable
          style={{
            height: 56,
            width: 56,
            // backgroundColor: 'hotpink',
            justifyContent: 'center',
            alignItems: 'center',
          }}></Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
    height: 48 + statusBarHeight,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
});

export default Header;
