// tableView/_apis/getTableDetail.ts
import { instance } from "@services/instance";

// ── 1. 서버 응답 원형 (새 API 명세 기준) ──
export interface RawOrderItem {
  name: string;
  quantity: number;
  fixed_price: number;
  created_at: string;
}

export interface RawTableDetail {
  table_number: string; // 새 명세에서는 문자열로 내려옴
  table_total_price: number;
  order_items: RawOrderItem[];
}

export interface RawResponse {
  message: string;
  data: RawTableDetail;
}

// ── 2. UI 친화 타입 (기존 컴포넌트 호환 유지) ──
export type OrderDetail = {
  menu_name: string;
  quantity: number;
  price: number;
  created_at: string;
  // 기존 UI(취소 모달 등)에서 에러가 나지 않도록 옵셔널로 남겨둠
  menu_image?: string | null;
  order_id?: number;
  order_item_id?: number;
  type?: string;
  order_item_ids?: number[];
};

export type TableDetailData = {
  table_num: number;
  table_amount: number;
  table_status?: "IN_USE" | "AVAILABLE" | "unknown"; // 새 상세 API에는 없으므로 옵셔널 처리
  created_at?: string | null;
  orders: OrderDetail[];
};

export type TableDetailResponse = {
  message: string;
  data: TableDetailData;
};

// ── 3. 데이터 정규화 함수 ──
const normalize = (raw: RawTableDetail): TableDetailData => {
  const table_num = Number(raw.table_number) || 0;
  const table_amount = raw.table_total_price ?? 0;

  const orders: OrderDetail[] = Array.isArray(raw.order_items)
    ? raw.order_items.map((o) => ({
        menu_name: o.name,
        quantity: o.quantity,
        price: o.fixed_price,
        created_at: o.created_at,
        menu_image: null, // 이미지 정보가 내려오지 않으므로 기본값
      }))
    : [];

  return {
    table_num,
    table_amount,
    orders,
    table_status: "IN_USE", // 상세를 본다는 건 보통 사용 중임을 의미
  };
};

// ── 4. API 호출 함수 ──
export const getTableDetail = async (tableNum: number): Promise<TableDetailResponse> => {
  try {
    // URL v3로 변경 (경로 맨 뒤 슬래시 제거)
    const res = await instance.get<RawResponse>(`/api/v3/django/booth/tables/${tableNum}`);
    const body = res.data;

    if (!body || !body.data) {
      throw new Error(body?.message ?? "데이터가 비어 있습니다.");
    }

    const data = normalize(body.data);

    return {
      message: body.message ?? "테이블 상세 조회 성공",
      data,
    };
  } catch (e: any) {
    const serverMsg =
      e?.response?.data?.message ??
      e?.message ??
      "테이블 상세 조회 실패";
    throw new Error(serverMsg);
  }
};