import React, { memo } from 'react';
import {
  Animated,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Text from '../text';
import styles from './styles';
import type { PropsButton } from './_types/button.types';

const Button: React.FC<PropsButton> = ({
  type,
  style,
  title,
  onPress,
  children,
  withOutRipple = false,
  withOutAnimate = false,
  disable = false,
}) => {
  const [state] = React.useState(new Animated.Value(1));

  const inAnimate = (): void => {
    Animated.spring(state, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const outAnimate = (): void => {
    Animated.spring(state, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle: Object = {
    transform: [{ scale: state }],
  };

  const types: any = [
    type === 'disabled' && styles.disabled,
    type === 'primary' && styles.primary,
    type === 'light' && styles.light,
    type === 'success' && styles.success,
  ];

  const textStyles: any = [
    type === 'disabled' && styles.textDark,
    type === 'primary' && styles.textPrimary,
    type === 'light' && styles.textLight,
    type === 'success' && styles.textDark,
  ];

  const Touchable: any =
    Platform.OS !== 'ios'
      ? withOutRipple
        ? TouchableOpacity
        : TouchableNativeFeedback
      : TouchableOpacity;

  return (
    <View>
      {disable ? (
        <View>
          {withOutAnimate ? (
            <View style={[types, style]}>
              {children ? (
                children
              ) : (
                <Text type="regular" size={18} style={textStyles}>
                  {title}
                </Text>
              )}
            </View>
          ) : (
            <Animated.View style={[animatedStyle, types, style]}>
              {children ? (
                children
              ) : (
                <Text type="regular" size={18} style={textStyles}>
                  {title}
                </Text>
              )}
            </Animated.View>
          )}
        </View>
      ) : (
        <Touchable
          activeOpacity={0.99}
          delayPressIn={0}
          useForeground={true}
          onPressIn={inAnimate}
          onPressOut={outAnimate}
          onPress={onPress}>
          {withOutAnimate ? (
            <View style={[types, style]}>
              {children ? (
                children
              ) : (
                <Text type="regular" size={18} style={textStyles}>
                  {title}
                </Text>
              )}
            </View>
          ) : (
            <Animated.View
              style={[styles.overflowHidden, animatedStyle, types, style]}>
              {children ? (
                children
              ) : (
                <Text type="regular" size={18} style={textStyles}>
                  {title}
                </Text>
              )}
            </Animated.View>
          )}
        </Touchable>
      )}
    </View>
  );
};

export default memo(Button);
