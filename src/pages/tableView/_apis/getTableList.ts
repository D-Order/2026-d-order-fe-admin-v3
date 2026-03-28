// tableView/_apis/getTableList.ts
import { instance } from "@services/instance";

// ── 1. 서버 응답 원형 (API 명세 기준) ──
export interface RawOrder {
  name: string;
  quantity: number;
  created_at: string;
}

export interface RawTableGroup {
  representative_table: number;
}

export interface RawTableItem {
  table_num: number;
  status: "IN_USE" | "AVAILABLE";
  group: RawTableGroup | null;
  accumulated_amount: number | null;
  started_at: string | null;
  order_list: RawOrder[];
}

export interface RawResponse {
  message: string;
  data: RawTableItem[];
}

// ── 2. UI 친화 타입 (컴포넌트 호환 유지) ──
export type LatestOrder = {
  name: string;
  qty: number;
  createdAt: string; // 기존 가격(price) 대신 주문 시간으로 대체
};

export type TableItem = {
  tableNum: number;
  status: "IN_USE" | "AVAILABLE";
  group: { representativeTable: number } | null; // 병합 정보 추가
  amount: number;
  startedAt: string | null; // 기존 createdAt 대신 startedAt으로 의미 명확화
  latestOrders: LatestOrder[];
};

export type TableListResponse = {
  message: string;
  data: TableItem[];
};

// ── 3. 데이터 정규화 함수 ──
const normalize = (raw: RawTableItem): TableItem => {
  return {
    tableNum: raw.table_num,
    status: raw.status,
    group: raw.group ? { representativeTable: raw.group.representative_table } : null,
    amount: raw.accumulated_amount ?? 0,
    startedAt: raw.started_at,
    latestOrders: Array.isArray(raw.order_list)
      ? raw.order_list.slice(0, 3).map((o) => ({
          name: o.name,
          qty: o.quantity,
          createdAt: o.created_at,
        }))
      : [],
  };
};

// ── 4. API 호출 함수 ──
export const getTableList = async (): Promise<TableListResponse> => {
  const res = await instance.get<RawResponse>("/api/v3/django/booth/tables");
  const body = res.data;

  if (!Array.isArray(body?.data)) {
    throw new Error(body?.message ?? "데이터 형식이 올바르지 않습니다.");
  }

  // 데이터 매핑 및 table_num 기반 정렬 (요구사항 반영)
  const data = body.data
    .map(normalize)
    .sort((a, b) => a.tableNum - b.tableNum);

  return {
    message: body.message ?? "테이블 목록 조회 성공",
    data,
  };
};