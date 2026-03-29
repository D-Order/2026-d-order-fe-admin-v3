// mypage/apis/getManagers.ts
import axios, { AxiosError } from "axios";

/** 좌석 과금 타입 */
export type SeatType = "PT" | "PP" | "NO"; // Per Table / Per Person / No Seat Tax

/** 부스 마이페이지 정보 스키마 (data) */
export interface BoothMyPageData {
  name: string;
  table_max_cnt: number;
  bank: string;
  account: string; // 계좌번호는 보통 0으로 시작할 수 있어 string으로 관리하는 것이 안전합니다.
  depositor: string;
  seat_type: SeatType;
  seat_fee_person: number;
  seat_fee_table: number;
  table_limit_hours: string | number; // GET 시 문자열(ex: "2.00")로 올 수 있음
}

/** 공통 응답 래퍼 */
export interface ApiEnvelope<T> {
  message: string;
  data: T | null;
}

/** 오류 응답 형태 */
export interface ApiErrorBody {
  detail?: string;
  message?: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 쿠키 자동 전송 (🔒 인증 필요)
  headers: {
    "Content-Type": "application/json",
  },
});

/** 에러를 사람이 읽기 쉬운 형태로 변환하여 throw */
function normalizeAndThrow(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorBody>;
    const body = err.response?.data;
    const status = err.response?.status;

    const msg =
      body?.detail ||
      body?.message ||
      (status === 401
        ? "자격 인증 데이터가 제공되지 않았습니다."
        : status === 400
        ? "입력한 값이 유효하지 않습니다."
        : status === 403
        ? "접근 권한이 없습니다."
        : "요청 처리 중 오류가 발생했습니다.");

    const enriched = {
      message: msg,
      code: status ?? 500,
      data: null,
    };
    throw enriched;
  }

  // axios 외의 오류
  throw {
    message: "알 수 없는 오류가 발생했습니다.",
    code: 500,
    data: null,
  };
}

/** 부스 마이페이지 정보 조회 (GET /api/v3/django/booth/mypage/) */
export async function getManagerInfo(): Promise<ApiEnvelope<BoothMyPageData>> {
  try {
    const res = await api.get<ApiEnvelope<BoothMyPageData>>(
      "/api/v3/django/booth/mypage/"
    );
    return res.data;
  } catch (e) {
    normalizeAndThrow(e);
  }
}

/** 좌석 과금 타입에 따른 필드 정합성 보조: 비활성 과금 필드는 0으로 보정 */
export function normalizeSeatFields(
  patch: Partial<BoothMyPageData>
): Partial<BoothMyPageData> {
  if (!patch.seat_type) return patch;
  const next: Partial<BoothMyPageData> = { ...patch };

  if (patch.seat_type === "PP") {
    next.seat_fee_table = 0;
  } else if (patch.seat_type === "PT") {
    next.seat_fee_person = 0;
  } else if (patch.seat_type === "NO") {
    next.seat_fee_person = 0;
    next.seat_fee_table = 0;
  }
  return next;
}