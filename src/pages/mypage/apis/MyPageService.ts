import { AxiosResponse } from 'axios';
import { instance } from '../../../services/instance';

export interface My {
  user: number;
  booth: number;
  booth_name: string;
  table_num: number;
  order_check_password: string;
  account: string;
  depositor: string;
  bank: string;
  seat_type: string;
  seat_tax_person: number;
  seat_tax_table: number;
}

export interface MyResponse {
  message: string;
  code: number;
  data: My;
}

class MyPageService {
  static async getMyPage(): Promise<My> {
    try {
      const response: AxiosResponse<MyResponse> = await instance.get(
        '/api/manager/mypage/',
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateMyPage(data: Partial<My>): Promise<My> {
    try {
      const response: AxiosResponse<MyResponse> = await instance.patch(
        `/api/manager/mypage/`,
        data,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async downloadQrCode(booth_id: number): Promise<void> {
    try {
      // 로그아웃 API 호출 - responseType: 'blob'로 설정하여 바이너리 데이터 받기
      const response = await instance.get(
        `/api/booth/qr-download/?booth_id=${booth_id}`,
        {
          responseType: 'blob',
        },
      );

      // 응답 데이터가 Blob인지 확인
      const blob = new Blob([response.data]);

      // Blob URL 생성
      const url = URL.createObjectURL(blob);

      // 다운로드 링크 생성 및 클릭
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${booth_id}.png`;
      document.body.appendChild(a);
      a.click();

      // 리소스 정리
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      return;
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      // refresh 토큰 가져오기 시도
      const refreshToken = localStorage.getItem('refreshToken');

      // API 요청 데이터 준비
      const payload = refreshToken ? { refresh: refreshToken } : {};

      // 로그아웃 API 호출
      const response = await instance.post('/api/manager/logout/', payload);

      // 응답 확인
      if (response.status === 200) {
        // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        return;
      } else {
        throw new Error(`로그아웃 실패: ${response.status}`);
      }
    } catch (error) {
      // 에러가 발생해도 토큰은 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      throw error;
    }
  }
}

export default MyPageService;
