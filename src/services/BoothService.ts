import { instance } from './instance';

export interface BoothNameResponse {
  message: string;
  data: { booth_name: string };
}

/**
 * 부스 관련 API 서비스
 */
const BoothService = {
  /**
   * 부스 이름 조회 (GET /api/v3/django/booth/{booth_id}/name/)
   */
  getBoothName: async (
    boothId: number | string,
  ): Promise<BoothNameResponse> => {
    const response = await instance.get<BoothNameResponse>(
      `/api/v3/django/booth/${boothId}/name/`,
    );
    return response.data;
  },
};

export default BoothService;
