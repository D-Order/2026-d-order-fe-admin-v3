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
  // 👇 Axios가 자동으로 csrftoken 쿠키를 읽어서 X-CSRFToken 헤더에 넣도록 지시
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
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

/** refresh·csrf-token 재귀 방지, 요청당 1회만 */
function shouldAttemptV3RefreshRetry(originalRequest: any): boolean {
  const url = originalRequest?.url as string | undefined;
  if (!url?.includes('/api/v3/')) return false;
  if (url.includes('/api/v3/django/auth/refresh/')) return false;
  if (isCsrfTokenEndpoint(url)) return false;
  if (originalRequest.__v3RefreshFallback) return false;
  return true;
}

/**
 * 401 처리·403 CSRF 1회 이후에도 남은 v3 실패용: refresh 1회 후 동일 요청 재전송.
 * (403이 아닌 오류는 여기서 곧바로 refresh 경로에 해당.)
 * 진행 중인 refresh가 있으면 failedQueue에 묶음.
 */
async function v3RefreshFallbackRetry(
  error: AxiosError,
  originalRequest: any,
  client: AxiosInstance,
): Promise<AxiosResponse | false> {
  if (!shouldAttemptV3RefreshRetry(originalRequest)) return false;

  originalRequest.__v3RefreshFallback = true;

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (_token: string | null) => {
          client(originalRequest)
            .then((res) => resolve(res))
            .catch(() => resolve(false));
        },
        reject,
      });
    });
  }

  isRefreshing = true;
  try {
    await UserService.refreshTokenV3();
    processQueue(null, null);
    return await client(originalRequest);
  } catch {
    processQueue(null, error as AxiosError);
    return false;
  } finally {
    isRefreshing = false;
  }
}

// 요청 인터셉터: 로그인/회원가입/refresh URL에는 Authorization 제외
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthEndpoint(config.url)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 👇 핵심 해결 로직: POST, PATCH 등 안전하지 않은 메서드일 때 직접 쿠키에서 꺼내서 헤더에 강제 주입!
    if (isUnsafeMethod(config.method)) {
      const csrfCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1];
      if (csrfCookie) {
        config.headers['X-CSRFToken'] = csrfCookie;
      }
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

/**
 * v3 오류 처리 순서 (같은 요청 config 기준):
 * - 401 → 토큰 재발급(refresh) + 재시도 (대기 중이면 failedQueue)
 * - 403(/api/v3/) → 먼저 CSRF 토큰 발급·재시도 1회 → 그 응답이 또 실패하면 아래로
 * - 그 밖의 v3 실패 → 토큰 재발급 1회 + 재시도 (v3RefreshFallbackRetry)
 *
 * 즉 403은 「오류 → CSRF → (여전히 실패 시 다음 인입에서) 토큰 재발급」,
 * 그 외는 「오류 → 토큰 재발급」에 가깝게 이어짐.
 */
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

    // v3 + 403: 토큰 재발급보다 먼저 CSRF 1회 (메서드 무관, csrf-token 자기 호출 제외)
    if (
      error.response?.status === 403 &&
      !originalRequest._csrfRetry &&
      originalRequest.url?.includes('/api/v3/') &&
      !isCsrfTokenEndpoint(originalRequest.url)
    ) {
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

    const v3Retried = await v3RefreshFallbackRetry(
      error,
      originalRequest,
      instance,
    );
    if (v3Retried !== false) return v3Retried;

    return Promise.reject(error);
  },
);

// 이미지 인스턴스도 동일하게 추가해 줍니다.
export const instatnceWithImg: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  // 👇 추가
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 10000,
});

// 요청 인터셉터 - 토큰을 헤더에 추가
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthEndpoint(config.url)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 🚨 핵심 수정: POST, PATCH 등 안전하지 않은 메서드일 때
    if (isUnsafeMethod(config.method) && !isCsrfTokenEndpoint(config.url)) {
      // 1. 브라우저 쿠키에서 csrftoken 찾기
      let csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1];

      // 2. 만약 쿠키에 토큰이 없다면, 에러 맞기 전에 '미리' 서버에서 받아오기 (선빵)
      if (!csrfToken) {
        try {
          csrfToken = await fetchCsrfToken() ?? undefined;
        } catch (e) {
          console.error("CSRF 토큰 사전 발급 실패", e);
        }
      }

      // 3. 토큰이 확보되었다면 헤더에 주입
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
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

    // v3 + 403: instance와 동일 — 먼저 CSRF, 이후 실패 시 말단에서 refresh
    if (
      error.response?.status === 403 &&
      !originalRequest._csrfRetry &&
      originalRequest.url?.includes('/api/v3/') &&
      !isCsrfTokenEndpoint(originalRequest.url)
    ) {
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

    const v3RetriedImg = await v3RefreshFallbackRetry(
      error,
      originalRequest,
      instatnceWithImg,
    );
    if (v3RetriedImg !== false) return v3RetriedImg;

    if (error.code === 'ECONNABORTED') {
      window.location.href = '/error';
    }

    return Promise.reject(error);
  },
);
