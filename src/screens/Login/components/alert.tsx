import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Animated, Pressable } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Button, Text } from '../../../components';
import SvgComponent from '../../../assets/icons/ic_exclamation';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ isOpen, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onClose());
    }
  }, [isOpen, onClose, fadeAnim]);

  const handlePressClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => onClose());
  };

  const backgroundFadeAnim = React.useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (isOpen) {
      Animated.timing(backgroundFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isOpen, backgroundFadeAnim]);

  return (
    <Modal transparent statusBarTranslucent visible={isOpen}>
      <Pressable onPress={handlePressClose} style={styles.backgroundButton}>
        <Animated.View
          style={[styles.modalOverlay, { opacity: backgroundFadeAnim }]}>
          <Pressable onPress={null}>
            <Animated.View
              style={[styles.containerAlert, { opacity: fadeAnim }]}>
              <SvgComponent style={[styles.mt8]} />
              <Text type="bold" size={21} align={'center'} style={styles.mt16}>
                Oops...
              </Text>
              <Text
                type="regular"
                size={16}
                align={'center'}
                style={styles.mt16}>
                You entered an invalid username/email/phone number or password.
                Please try again.
              </Text>
              <Button
                type="primary"
                title="OK"
                onPress={handlePressClose}
                style={{ width: wp(100) - 64, marginTop: 16 + 8 }}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  backgroundButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 4,
  },
  closeButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    color: 'blue',
    textDecorationLine: 'underline',
  },
  containerAlert: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 4,
    width: wp(100) - 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mt16: { marginTop: 16 },
  mt8: { marginTop: 8 },
});

export default Alert;
