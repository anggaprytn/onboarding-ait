import React, { useState, useMemo, useCallback } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Text } from '../../components';
import { Alert } from './components';
import { defaultColors } from '../../themes';
import { styles } from './styles';
import { request } from '../../utils/services';
import { setAuthTokens } from '../../core/store/_reducers/authSlice';

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email format is invalid.')
    .required('Email is required'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      'Password format is invalid.',
    )
    .required('Password is required'),
});

const Home = () => {
  const guestAccessToken = useSelector(
    ({ authSlice }: any) => authSlice.guestAccessToken,
  );
  const guestRefreshToken = useSelector(
    ({ authSlice }: any) => authSlice.guestRefreshToken,
  );
  const isSignedIn = useSelector(({ authSlice }: any) => authSlice.isSignedIn);

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState('eye-off');
  const { control, handleSubmit, setError, clearErrors, formState, getValues } =
    useForm<FormData>({
      resolver: yupResolver(schema),
      mode: 'onChange',
    });

  const onSubmit: SubmitHandler<FormData> = data => {
    console.log(data.email);
    handleLogin(data.email, data.password);
  };

  const handlePressPrivacyPolicy = useCallback(() => {
    navigation.navigate('PrivacyPolicy');
  }, [navigation]);

  const handlePressTermsAndConditions = useCallback(() => {
    navigation.navigate('TermsAndConditions');
  }, [navigation]);

  const [alertOpen, setAlertOpen] = useState(false);
  const handleOpenAlert = useCallback(() => setAlertOpen(true), []);
  const handleCloseAlert = useCallback(() => setAlertOpen(false), []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prevShowPassword => !prevShowPassword);
    setPasswordIcon(prevPasswordIcon =>
      prevPasswordIcon === 'eye' ? 'eye-off' : 'eye',
    );
  }, []);

  const handleChange = async (fieldName: keyof FormData, value: string) => {
    try {
      await schema.validateAt(fieldName, {
        ...getValues(),
        [fieldName]: value,
      });
      clearErrors(fieldName);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setError(fieldName, {
          type: 'manual',
          message: error.message,
        });
      }
    }
  };

  const handleLogin = useCallback(
    (email: string, password: string) => {
      setIsLoading(true);
      request(
        {
          method: 'post',
          endpoint: '/user/auth/login',
          body: {
            email,
            password,
          },
          headers: {
            Authorization: `Bearer ${guestAccessToken}`,
          },
        },
        guestRefreshToken,
        dispatch,
        isSignedIn,
      )
        .then(response => {
          let data = JSON.parse(response.data);
          console.log(data, 'data login');
          console.log(data.meta.code, 'data login 2');

          if (data.meta.code === 400) {
            handleOpenAlert();
          } else if (data.meta.code === 200) {
            dispatch(
              setAuthTokens({
                accessToken: data.data.access_token,
                refreshToken: data.data.refresh_token,
              }),
            );
          } else {
            // error hanlder
          }
        })
        .catch(e => {
          // return [];
          console.log(e, 'error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [
      dispatch,
      guestAccessToken,
      guestRefreshToken,
      handleOpenAlert,
      isSignedIn,
    ],
  );

  const renderTermsAndConditions = useMemo(() => {
    return (
      <View style={styles.containerFooter}>
        <Text type="regular" size={16}>
          By logging in, you agree to our
        </Text>
        <Text type="regular" size={16}>
          <Text
            onPress={handlePressTermsAndConditions}
            style={styles.underline}
            type="bold"
            underline
            size={16}>
            Terms & Conditions
          </Text>
          {' and '}
          <Text
            onPress={handlePressPrivacyPolicy}
            style={styles.underline}
            type="bold"
            underline
            size={16}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    );
  }, [handlePressPrivacyPolicy, handlePressTermsAndConditions]);

  const renderHeader = useMemo(() => {
    return (
      <View style={styles.containerHeader}>
        <Text type="bold" size={36}>
          Login
        </Text>
        <Text type={'medium'} size={17} style={styles.mt4}>
          Welcome back! Let's login to your account
        </Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      {/* Header */}
      {renderHeader}
      {/* Form */}
      <View style={styles.containerForm}>
        <Text type="medium" size={18}>
          Email
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={{ justifyContent: 'center' }}>
              <TextInput
                onChangeText={inputValue => {
                  onChange(inputValue);
                  handleChange('email', inputValue);
                }}
                value={value}
                placeholder="Email"
                style={[
                  styles.textInputEmail,
                  {
                    borderColor: formState.errors.email
                      ? defaultColors.error
                      : defaultColors.textFooterDate,
                  },
                ]}
              />
              {value.length > 0 && (
                <Pressable
                  onPress={() => onChange('')}
                  style={{
                    backgroundColor: 'transparent',
                    height: 48,
                    width: 48,
                    top: 4,
                    position: 'absolute',
                    right: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Feather
                    name="x"
                    size={24}
                    color={defaultColors.textFooterDate}
                  />
                </Pressable>
              )}
            </View>
          )}
          name="email"
          defaultValue=""
        />
        {formState.errors.email && (
          <Text
            type="regular"
            size={16}
            style={styles.mt4}
            color={defaultColors.error}>
            {formState.errors.email.message}
          </Text>
        )}
        <Text type="medium" size={18} style={styles.mt24}>
          Password
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={{ justifyContent: 'center' }}>
              <TextInput
                onChangeText={inputValue => {
                  onChange(inputValue);
                  handleChange('password', inputValue);
                }}
                value={value}
                placeholder="Password"
                secureTextEntry={!showPassword}
                style={[
                  styles.textInputPassword,
                  {
                    borderColor: formState.errors.password
                      ? defaultColors.error
                      : defaultColors.textFooterDate,
                  },
                ]}
              />
              <Pressable
                onPress={togglePasswordVisibility}
                style={{
                  backgroundColor: 'transparent',
                  height: 48,
                  width: 48,
                  top: 4,
                  position: 'absolute',
                  right: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name={`${passwordIcon}` as 'eye-off' | 'eye'}
                  size={24}
                  color={defaultColors.textFooterDate}
                />
              </Pressable>
            </View>
          )}
          name="password"
          defaultValue=""
        />

        {formState.errors.password && (
          <Text
            type="regular"
            size={16}
            color={defaultColors.error}
            style={styles.mt4}>
            {formState.errors.password.message}
          </Text>
        )}
      </View>
      {/* Login Button */}
      <Button
        disable={!formState.isValid}
        type={!formState.isValid ? 'disabled' : 'primary'}
        title={`${isLoading ? 'Loading...' : 'Login'}`}
        style={styles.btnLogin}
        onPress={handleSubmit(onSubmit)}
      />

      {/* Terms & Conditions and Privacy Policy */}
      {renderTermsAndConditions}
      <Alert isOpen={alertOpen} onClose={handleCloseAlert} />
    </View>
  );
};

export default Home;
