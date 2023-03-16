import axios, { AxiosResponse } from 'axios';
import { BaseRequest, ResultType } from '../types';
import {
  setAuthTokens,
  setGuestTokens,
  clearTokens,
} from '../../core/store/_reducers/authSlice';

const createAxiosInstance = (
  refreshToken: string,
  dispatch: Function,
  isSignedIn: boolean,
) => {
  const instance = axios.create({
    baseURL: 'https://training.akarinti.tech/mobileapi',
    timeout: 15000,
  });

  instance.interceptors.response.use(
    response => response,
    async error => {
      console.log('Interceptor entered');
      const originalRequest = error.config;
      console.log(error.response.status, 'error.response.status');
      console.log(refreshToken, 'refreshToken');

      if (error.response.status === 401) {
        console.log(`401 error detected ${isSignedIn}`);

        const refreshUrl = isSignedIn
          ? 'https://training.akarinti.tech/mobileapi/user/auth/refresh'
          : 'https://training.akarinti.tech/mobileapi/oauth/refresh';

        try {
          console.log('Before axios.post');
          const response = await axios.post(refreshUrl, null, {
            headers: { Authorization: `Bearer ${refreshToken}` },
          });
          console.log('After axios.post');
          console.log(response, 'response after axios.post');

          // Check if the response status is still 401 after refreshing tokens
          if (response.status === 401 && isSignedIn) {
            console.log('Still 401 after refreshing tokens');
            dispatch(clearTokens());
            return Promise.reject(error);
          }

          dispatch(
            isSignedIn
              ? setAuthTokens({
                  accessToken: response.data.data.access_token,
                  refreshToken: response.data.data.refresh_token,
                })
              : setGuestTokens({
                  guestAccessToken: response.data.data.access_token,
                  guestRefreshToken: response.data.data.refresh_token,
                }),
          );

          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${response.data.data.access_token}`;

          return instance(originalRequest);
        } catch (err) {
          console.log('Error in axios.post', err);
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const request = async (
  {
    params,
    headers,
    body,
    endpoint,
    method,
    responseType = 'text',
  }: BaseRequest,
  refreshToken: string,
  dispatch: Function,
  isSignedIn: boolean,
): Promise<ResultType> => {
  const api = createAxiosInstance(refreshToken, dispatch, isSignedIn);

  let result: ResultType = {
    status: 'loading',
    data: null,
  };

  try {
    const res: AxiosResponse = await api({
      url: endpoint,
      method,
      data: body,
      headers,
      params,
      responseType: responseType,
    });

    const resultSuccess: ResultType = {
      status: res.data.status,
      data: res.data,
      message: res?.data?.message,
    };

    return Object.assign(result, resultSuccess);
  } catch ({ response }) {
    const resError: AxiosResponse<any> | any = response;
    const resultError: ResultType = {
      status: resError?.data.status,
      data: resError?.data,
      message: resError?.data?.message,
    };

    return Object.assign(result, resultError);
  }
};
