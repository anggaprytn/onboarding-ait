import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  setAuthTokens,
  setGuestTokens,
} from '../../core/store/_reducers/authSlice';

const HOST = 'https://training.akarinti.tech/mobileapi';

const useAuth = () => {
  const dispatch = useDispatch();
  const refreshToken = useSelector((authSlice: any) => authSlice.refreshToken);
  const guestRefreshToken = useSelector(
    ({ authSlice }: any) => authSlice.guestRefreshToken,
  );

  const guestAuthenticate = useCallback(async () => {
    try {
      const response = await axios.post(`${HOST}/oauth/auth`, {
        app: 'test',
        key: 'oJi1WeLsmh7nVily0MrB',
      });

      if (response.data.meta.code === 200) {
        dispatch(
          setGuestTokens({
            guestAccessToken: response.data.data.access_token,
            guestRefreshToken: response.data.data.refresh_token,
          }),
        );
      }

      console.log(response, 'ress');
    } catch (error: any) {
      if (error.response.status === 400) {
        console.log('anjay');
      }
    }
  }, [dispatch]);

  const guestRefreshTokens = useCallback(async () => {
    console.log('guestRefreshTokens called', guestRefreshToken);

    try {
      const response = await axios.post(
        `${HOST}/oauth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${guestRefreshToken}`,
          },
        },
      );

      console.log('guestRefreshTokens response', response);

      if (response.data.meta.code === 200) {
        dispatch(
          setGuestTokens({
            guestAccessToken: response.data.data.access_token,
            guestRefreshToken: response.data.data.refresh_token,
          }),
        );
      } else {
        guestAuthenticate();
      }
    } catch (error: any) {
      console.log(JSON.stringify(error), 'error');
    }
  }, [dispatch, guestAuthenticate, guestRefreshToken]);

  const _refreshToken = useCallback(async () => {
    console.log('guestRefreshTokens called', guestRefreshToken);

    try {
      const response = await axios.post(
        `${HOST}/user/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      console.log('guestRefreshTokens response', response);

      if (response.data.meta.code === 200) {
        dispatch(
          setAuthTokens({
            accessToken: response.data.data.access_token,
            refreshToken: response.data.data.refresh_token,
          }),
        );
      }
    } catch (error: any) {
      console.log(JSON.stringify(error), 'error');
    }
  }, [dispatch, guestRefreshToken, refreshToken]);

  return {
    guestAuthenticate,
    guestRefreshTokens,
    _refreshToken,
  };
};

export default useAuth;
