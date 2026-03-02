import { instance } from './instance';

export interface SignupRequest {
  username: string;
  password: string;
  booth_name: string;
  table_num: number;
  order_check_password: string;
  account: number;
  depositor: string;
  bank: string;
  seat_type: 'PT' | 'PP' | 'NO';
  seat_tax_person: number;
  seat_tax_table: number;
  table_limit_hours: number;
}

/** v3: POST /api/v3/django/auth/signup/ - 부스 관리자 계정 생성 */
export interface SignupRequestV3 {
  username: string;
  password: string;
  booth_data: {
    name: string;
    table_max_cnt: number;
    account: number;
    depositor: string;
    bank: string;
    seat_type: 'PT' | 'PP' | 'NO';
    seat_fee_person: number;
    seat_fee_table: number;
    table_limit_hours: number;
  };
}

export interface SignupResponseV3 {
  message: string;
  data: { username: string; booth_id: number };
}

/** 오류 시 서버 응답 (필드별 메시지 배열) */
export interface SignupErrorDataV3 {
  username?: string[];
  booth_data?: {
    seat_type?: string[];
    name?: string[];
    table_max_cnt?: string[];
    account?: string[];
    depositor?: string[];
    bank?: string[];
    seat_fee_person?: string[];
    seat_fee_table?: string[];
    table_limit_hours?: string[];
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

/** v2: POST /api/v2/manager/auth/ */
export interface LoginResponse {
  message: string;
  code: number;
  token: {
    access: string;
  };
  data: {
    manager_id: number;
    booth_id: number;
  };
}

/** v3: POST /api/v3/django/auth/ - 운영자 로그인 */
export interface LoginResponseV3 {
  message: string;
  data: {
    username: string;
    booth_id: number;
  };
  token?: { access: string; refresh?: string };
}

/** v3: POST /api/v3/django/auth/refresh/ - JWT 토큰 재발급 (인증 불필요, refresh 토큰으로 요청) */
export interface RefreshRequestV3 {
  refresh: string;
}

export interface RefreshResponseV3 {
  access: string;
  refresh?: string;
}

const UserService = {
  postSignup: async (data: SignupRequest) => {
    const response = await instance.post('/api/v2/manager/signup/', data);
    return response.data;
  },

  /** v3: POST /api/v3/django/auth/signup/ - 부스 관리자 계정 생성 */
  postSignupV3: async (data: SignupRequestV3): Promise<SignupResponseV3> => {
    const response = await instance.post<SignupResponseV3>(
      '/api/v3/django/auth/signup/',
      data,
    );
    if (
      !response.data?.data?.username ||
      response.data?.data?.booth_id == null
    ) {
      throw new Error('회원가입 응답이 올바르지 않습니다.');
    }
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await instance.post('/api/v2/manager/auth/', data);

      if (!response.data?.token?.access) {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }

      localStorage.setItem('Booth-ID', String(response.data.data.booth_id));

      return response.data;
    } catch (error: any) {
      throw new Error('로그인 응답이 올바르지 않습니다.');
    }
  },

  /** v3: POST /api/v3/django/auth/ - 운영자 로그인 */
  loginV3: async (data: LoginRequest): Promise<LoginResponseV3> => {
    const response = await instance.post<LoginResponseV3>(
      '/api/v3/django/auth/',
      data,
    );
    if (
      !response.data?.data?.username ||
      response.data?.data?.booth_id == null
    ) {
      throw new Error('로그인 응답이 올바르지 않습니다.');
    }
    return response.data;
  },

  /** v3: POST /api/v3/django/auth/refresh/ - Access Token 재발급 (refresh 토큰만 필요) */
  refreshTokenV3: async (
    refreshToken: string
  ): Promise<RefreshResponseV3> => {
    const response = await instance.post<RefreshResponseV3>(
      '/api/v3/django/auth/refresh/',
      { refresh: refreshToken } satisfies RefreshRequestV3,
    );
    if (!response.data?.access) {
      throw new Error('토큰 재발급 응답이 올바르지 않습니다.');
    }
    return response.data;
  },
};

export default UserService;
