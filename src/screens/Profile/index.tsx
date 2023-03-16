import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '../../components';
import { useDispatch } from 'react-redux';
import { clearTokens } from '../../core/store/_reducers/authSlice';
import { request } from '../../utils/services';
import { useSelector } from 'react-redux';

const Search = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    ({ authSlice }: any) => authSlice.accessToken,
  );
  const refreshToken = useSelector(
    ({ authSlice }: any) => authSlice.refreshToken,
  );
  const isSignedIn = useSelector(({ authSlice }: any) => authSlice.isSignedIn);

  const [dataProfile, setDataProfile] = useState<any>();

  const _getProfile = useCallback(() => {
    request(
      {
        method: 'get',
        endpoint: '/user/profile',
        headers: { Authorization: `Bearer ${accessToken}` },
      },
      refreshToken,
      dispatch,
      isSignedIn,
    )
      .then(response => {
        const data = JSON.parse(response.data);
        console.log(data, '/user/profile');
        setDataProfile(data);
      })
      .catch(() => {
        return [];
      })
      .finally(() => {});
  }, [accessToken, dispatch, isSignedIn, refreshToken]);

  useEffect(() => {
    _getProfile();
  }, [_getProfile]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
        <View style={{ marginHorizontal: 16 }}>
          <Text
            type="regular"
            size={14}
            align={'center'}
            style={{ marginBottom: 32 }}>
            {JSON.stringify(dataProfile)}
          </Text>
        </View>
        <View style={{ marginHorizontal: 16 }}>
          <Text
            type="regular"
            size={14}
            align={'left'}
            style={{ marginBottom: 32 }}>
            <Text
              type="bold"
              size={14}
              align={'left'}
              style={{ marginBottom: 32 }}>
              Access Token:{' '}
            </Text>
            {accessToken}
          </Text>
        </View>
        <View style={{ marginHorizontal: 16 }}>
          <Text
            type="regular"
            size={14}
            align={'left'}
            style={{ marginBottom: 32 }}>
            <Text
              type="bold"
              size={14}
              align={'left'}
              style={{ marginBottom: 32 }}>
              Refresh Token:{' '}
            </Text>
            {refreshToken}
          </Text>
        </View>
        <Button
          style={{ marginHorizontal: 16 }}
          onPress={() => dispatch(clearTokens())}
          type="primary"
          title="Logout"></Button>
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
