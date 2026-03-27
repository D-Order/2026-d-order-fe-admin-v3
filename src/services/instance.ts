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

const isCsrfTokenEndpoint = (url?: string) =>
  url?.includes('/api/v3/django/auth/csrf-token/');

const isUnsafeMethod = (method?: string) => {
  const m = (method || 'GET').toUpperCase();
  return !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(m);
};

const fetchCsrfToken = async (): Promise<string | null> => {
  const res = await instance.get('/api/v3/django/auth/csrf-token/');
  const token = res.data?.csrfToken;
  return typeof token === 'string' ? token : null;
};

// 요청 인터셉터: 로그인/회원가입/refresh URL에는 Authorization 제외
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthEndpoint(config.url)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (token: string | null, error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
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
        new Error('리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.'),
      );
    }

    if (
      originalRequest.url?.includes('/api/v3/django/auth/refresh/') &&
      error.response?.status === 401
    ) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(
        new Error('토큰이 만료되었습니다. 다시 로그인해주세요.'),
      );
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string | null) => {
              if (token)
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
          await UserService.refreshTokenV3();
          processQueue(null, null);
          return instance(originalRequest);
        } else {
          const res = await instance.get('/api/v2/manager/auth/');
          const newAccessToken = res.data?.data?.access;
          if (!newAccessToken) throw new Error('토큰이 응답에 없습니다.');

          localStorage.setItem('accessToken', newAccessToken);
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

    // CSRF 실패(대개 403) 시 토큰을 발급받고 원 요청 1회 재시도
    if (
      error.response?.status === 403 &&
      !originalRequest._csrfRetry &&
      isUnsafeMethod(originalRequest.method) &&
      !isCsrfTokenEndpoint(originalRequest.url)
    ) {
      const detail = (error.response.data as any)?.detail;
      const isCsrfError =
        typeof detail === 'string' ? detail.toLowerCase().includes('csrf') : false;

      if (isCsrfError) {
        originalRequest._csrfRetry = true;
        try {
          const csrfToken = await fetchCsrfToken();
          if (csrfToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers['X-CSRFToken'] = csrfToken;
          }
          return instance(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
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
  (error: AxiosError) => Promise.reject(error),
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
        new Error('리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.'),
      );
    }

    if (
      originalRequest.url?.includes('/api/v3/django/auth/refresh/') &&
      error.response?.status === 401
    ) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(
        new Error('토큰이 만료되었습니다. 다시 로그인해주세요.'),
      );
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string | null) => {
              if (token)
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
          await UserService.refreshTokenV3();
          processQueue(null, null);
          return instatnceWithImg(originalRequest);
        } else {
          const res = await instance.get('/api/v2/manager/auth/');
          const newAccessToken = res.data?.data?.access;
          if (!newAccessToken) throw new Error('토큰이 응답에 없습니다.');

          localStorage.setItem('accessToken', newAccessToken);
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

    // CSRF 실패(대개 403) 시 토큰을 발급받고 원 요청 1회 재시도
    if (
      error.response?.status === 403 &&
      !originalRequest._csrfRetry &&
      isUnsafeMethod(originalRequest.method) &&
      !isCsrfTokenEndpoint(originalRequest.url)
    ) {
      const detail = (error.response.data as any)?.detail;
      const isCsrfError =
        typeof detail === 'string' ? detail.toLowerCase().includes('csrf') : false;

      if (isCsrfError) {
        originalRequest._csrfRetry = true;
        try {
          const csrfToken = await fetchCsrfToken();
          if (csrfToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers['X-CSRFToken'] = csrfToken;
          }
          return instatnceWithImg(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }
    }

    if (error.code === 'ECONNABORTED') {
      window.location.href = '/error';
    }

    return Promise.reject(error);
  },
);
