// mypage/apis/getManagerPatch.ts
import axios, { AxiosError } from "axios";

export type SeatType = "PT" | "PP" | "NO";

export interface BoothMyPageData {
  name: string;
  table_max_cnt: number; // 변경 불가능한 값이지만 인터페이스 유지를 위해 포함
  bank: string;
  account: string;
  depositor: string;
  seat_type: SeatType;
  seat_fee_person: number;
  seat_fee_table: number;
  table_limit_hours: string | number;
}

export interface ApiEnvelope<T> {
  message: string;
  data: T | null;
}

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 쿠키 자동 전송 (🔒 인증 필요)
  // Django 기본 CSRF 설정
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  headers: { "Content-Type": "application/json" },
});

function normalizeAndThrow(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    const status = err.response?.status ?? 500;
    const body = err.response?.data;

    // 400 에러의 경우 필드별 에러 배열이 올 수 있으므로 이를 처리
    let message = "부스 정보 수정 중 오류가 발생했습니다.";
    
    if (status === 400 && typeof body === "object") {
      // 첫 번째 에러 메시지를 추출하여 표시
      const firstKey = Object.keys(body)[0];
      if (Array.isArray(body[firstKey])) {
          message = `${firstKey}: ${body[firstKey][0]}`;
      } else {
          message = "입력한 값이 유효하지 않습니다.";
      }
    } else if (status === 401) {
      message = "자격 인증 데이터가 제공되지 않았습니다. 다시 로그인해주세요.";
    }

    console.error("[PATCH manager][ERROR]", { status, body });
    throw { message, code: status, data: null };
  }
  throw { message: "부스 정보 수정 중 오류가 발생했습니다.", code: 500, data: null };
}

export function normalizeSeatFields(patch: Partial<BoothMyPageData>) {
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

/** PATCH /api/v3/django/booth/mypage/ */
export async function patchManagerInfo(
  payload: Partial<BoothMyPageData>
): Promise<ApiEnvelope<BoothMyPageData>> {
  // 1) 과금 규칙 보정 (비활성화된 금액은 0으로 처리)
  const body: any = normalizeSeatFields(payload);

  // 2) 변경 불가능한 값 제외 (안전 처리)
  if ('table_max_cnt' in body) {
    delete body.table_max_cnt;
  }

  // 3) 숫자 캐스팅 (유효한 정수값 전송 목적)
  if (body.seat_fee_person != null) body.seat_fee_person = Number(body.seat_fee_person);
  if (body.seat_fee_table != null) body.seat_fee_table = Number(body.seat_fee_table);
  if (body.table_limit_hours != null) body.table_limit_hours = Number(body.table_limit_hours);

  try {
    const res = await api.patch<ApiEnvelope<BoothMyPageData>>(
      "/api/v3/django/booth/mypage/", 
      body
    );
    return res.data;
  } catch (e) {
    return normalizeAndThrow(e);
  }
}