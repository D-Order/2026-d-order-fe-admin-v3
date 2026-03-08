import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import UserService from './UserService';

export const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const isAuthEndpoint = (url?: string) =>
  url?.includes('/api/v2/manager/auth/') ||
  url?.includes('/api/v3/django/auth/');

// 요청 인터셉터: 로그인/회원가입/refresh URL에는 Authorization 제외
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthEndpoint(config.url)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (token: string | null, error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const redirectToLogin = () => {
  window.location.href = '/login';
};

// 응답 인터셉터: 401 시 v3는 refresh API로 재발급, v2는 기존 로직
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      originalRequest.url?.includes('/api/v2/manager/auth/') &&
      error.response?.status === 401
    ) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(
        new Error('리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.')
      );
    }

    if (
      originalRequest.url?.includes('/api/v3/django/auth/refresh/') &&
      error.response?.status === 401
    ) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(
        new Error('토큰이 만료되었습니다. 다시 로그인해주세요.')
      );
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const isV3Request = originalRequest.url?.includes('/api/v3/');

      try {
        if (isV3Request) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('refresh 토큰이 없습니다.');

          const data = await UserService.refreshTokenV3(refreshToken);
          const newAccessToken = data.access;
          setAccessToken(newAccessToken);
          if (data.refresh) {
            localStorage.setItem('refreshToken', data.refresh);
          }
          processQueue(newAccessToken, null);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } else {
          const res = await instance.get('/api/v2/manager/auth/');
          const newAccessToken = res.data?.data?.access;
          if (!newAccessToken) throw new Error('토큰이 응답에 없습니다.');

          setAccessToken(newAccessToken);
          processQueue(newAccessToken, null);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        }
      } catch (err) {
        processQueue(null, err as AxiosError);
        clearTokens();
        redirectToLogin();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

//이미지처리로직 수정
export const instatnceWithImg: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 10000,
});

// 요청 인터셉터 - 토큰을 헤더에 추가
instatnceWithImg.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthEndpoint(config.url)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터 - 401 시 instance와 동일하게 v3/v2 refresh 후 재시도
instatnceWithImg.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      originalRequest.url?.includes('/api/v2/manager/auth/') &&
      error.response?.status === 401
    ) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(
        new Error('리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.')
      );
    }

    if (
      originalRequest.url?.includes('/api/v3/django/auth/refresh/') &&
      error.response?.status === 401
    ) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(
        new Error('토큰이 만료되었습니다. 다시 로그인해주세요.')
      );
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(instatnceWithImg(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const isV3Request = originalRequest.url?.includes('/api/v3/');

      try {
        if (isV3Request) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('refresh 토큰이 없습니다.');

          const data = await UserService.refreshTokenV3(refreshToken);
          const newAccessToken = data.access;
          setAccessToken(newAccessToken);
          if (data.refresh) {
            localStorage.setItem('refreshToken', data.refresh);
          }
          processQueue(newAccessToken, null);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instatnceWithImg(originalRequest);
        } else {
          const res = await instance.get('/api/v2/manager/auth/');
          const newAccessToken = res.data?.data?.access;
          if (!newAccessToken) throw new Error('토큰이 응답에 없습니다.');

          setAccessToken(newAccessToken);
          processQueue(newAccessToken, null);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instatnceWithImg(originalRequest);
        }
      } catch (err) {
        processQueue(null, err as AxiosError);
        clearTokens();
        redirectToLogin();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.code === 'ECONNABORTED') {
      window.location.href = '/error';
    }

    return Promise.reject(error);
  }
);
