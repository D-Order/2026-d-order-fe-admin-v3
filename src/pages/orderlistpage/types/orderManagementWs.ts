/**
 * Order 관리 WebSocket
 * WS URL: /ws/django/booth/orders/management/
 * Event Types: ADMIN_ORDER_SNAPSHOT, ADMIN_NEW_ORDER, ADMIN_ORDER_UPDATE, ADMIN_ORDER_COMPLETED, ADMIN_ORDER_CANCELLED, ADMIN_MENU_AGGREGATION
 */

export const ADMIN_ORDER_SNAPSHOT = 'ADMIN_ORDER_SNAPSHOT';
export const ADMIN_NEW_ORDER = 'ADMIN_NEW_ORDER';
export const ADMIN_ORDER_UPDATE = 'ADMIN_ORDER_UPDATE';
export const ADMIN_ORDER_COMPLETED = 'ADMIN_ORDER_COMPLETED';
export const ADMIN_ORDER_CANCELLED = 'ADMIN_ORDER_CANCELLED';
export const ADMIN_MENU_AGGREGATION = 'ADMIN_MENU_AGGREGATION';

/** 스냅샷 메시지 한 건 (서버 주문 항목) */
export interface AdminOrderSnapshotItem {
  order_menu_id?: number;
  order_id?: number;
  menu_name: string;
  menu_image?: string | null;
  quantity: number;
  status: string; // e.g. pending | cooked | served 또는 한글
  table_num: number;
  from_set?: boolean;
  set_id?: number | null;
  set_name?: string | null;
  created_at?: string;
}

export interface AdminOrderSnapshotMessage {
  type: typeof ADMIN_ORDER_SNAPSHOT;
  data: {
    orders: AdminOrderSnapshotItem[];
  };
}

export function isAdminOrderSnapshotMessage(
  msg: unknown
): msg is AdminOrderSnapshotMessage {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    (msg as AdminOrderSnapshotMessage).type === ADMIN_ORDER_SNAPSHOT &&
    Array.isArray((msg as AdminOrderSnapshotMessage).data?.orders)
  );
}

/** 새 오더 전송: 새 오더 생성 시 (data.orders: 주문 배열, 각 주문에 table_num, time_ago, items) */
export interface AdminNewOrderItem {
  order_item_id?: number;
  menu_name: string;
  image?: string | null;
  quantity: number;
  fixed_price?: number;
  item_total_price?: number;
  status: string;
  is_set?: boolean;
}

export interface AdminNewOrderMessage {
  type: typeof ADMIN_NEW_ORDER;
  data: {
    orders: {
      order_id: number;
      table_num: number;
      table_usage_id?: number;
      order_status?: string;
      time_ago?: string;
      has_coupon?: boolean;
      items: AdminNewOrderItem[];
    }[];
  };
}

export function isAdminNewOrderMessage(msg: unknown): msg is AdminNewOrderMessage {
  const m = msg as AdminNewOrderMessage;
  return (
    typeof msg === 'object' &&
    msg !== null &&
    m.type === ADMIN_NEW_ORDER &&
    Array.isArray(m.data?.orders)
  );
}

/** 오더 업데이트: 특정 아이템 상태 변경 시 (cooking→cooked, cooked→serving, serving→served, cancelled) */
export interface AdminOrderUpdateMessage {
  type: typeof ADMIN_ORDER_UPDATE;
  data: {
    order_id: number;
    item: {
      id: number; // 업데이트된 아이템(order_menu_id)
      status: string; // cooking | cooked | serving | served | cancelled
      is_all_served: boolean;
    };
  };
}

export function isAdminOrderUpdateMessage(
  msg: unknown
): msg is AdminOrderUpdateMessage {
  const m = msg as AdminOrderUpdateMessage;
  return (
    typeof msg === 'object' &&
    msg !== null &&
    m.type === ADMIN_ORDER_UPDATE &&
    typeof m.data?.order_id === 'number' &&
    typeof m.data?.item?.id === 'number' &&
    typeof m.data.item.status === 'string'
  );
}

/** 오더 서빙 전부 완료: 오더 내 아이템 전부 서빙 완료 시 → 목록에서 빌지 제거 */
export interface AdminOrderCompletedMessage {
  type: typeof ADMIN_ORDER_COMPLETED;
  data: {
    order_id: number;
    table_num: number;
    table_usage_id?: number;
    order_status: string; // e.g. "COMPLETED"
    updated_at?: string;
  };
}

/** 서버가 ORDER_COMPLETED 로 보낼 수도 있음 */
export const ORDER_COMPLETED = 'ORDER_COMPLETED';

export type OrderCompletedPayload = AdminOrderCompletedMessage['data'];

export function isAdminOrderCompletedMessage(
  msg: unknown
): msg is { type: string; data: OrderCompletedPayload } {
  const m = msg as { type?: string; data?: { order_id?: number; table_num?: number } };
  return (
    typeof msg === 'object' &&
    msg !== null &&
    (m.type === ADMIN_ORDER_COMPLETED || m.type === ORDER_COMPLETED) &&
    typeof m.data?.order_id === 'number' &&
    typeof m.data?.table_num === 'number'
  );
}

/** 오더 취소: 취소된 아이템을 목록에서 제거 */
export interface AdminOrderCancelledMessage {
  type: typeof ADMIN_ORDER_CANCELLED;
  data: {
    order_id: number;
    item_id: number; // 취소된 아이템
    refund_amount?: number;
    new_total_sales?: number;
  };
}

export function isAdminOrderCancelledMessage(
  msg: unknown
): msg is AdminOrderCancelledMessage {
  const m = msg as AdminOrderCancelledMessage;
  return (
    typeof msg === 'object' &&
    msg !== null &&
    m.type === ADMIN_ORDER_CANCELLED &&
    typeof m.data?.order_id === 'number' &&
    typeof m.data?.item_id === 'number'
  );
}

/** 메뉴별 집계: 음식/음료 수량 집계 (서버가 ADMIN_MENU_AGGREGATION 또는 MENU_AGGREGATION 로 전송) */
export const MENU_AGGREGATION = 'MENU_AGGREGATION';

export interface MenuAggregationMessage {
  type: typeof ADMIN_MENU_AGGREGATION | typeof MENU_AGGREGATION;
  data: {
    food_summary: { menu_name: string; total_quantity: number }[];
    beverage_summary: { menu_name: string; total_quantity: number }[];
  };
}

export function isMenuAggregationMessage(
  msg: unknown
): msg is MenuAggregationMessage {
  const m = msg as MenuAggregationMessage;
  return (
    typeof msg === 'object' &&
    msg !== null &&
    (m.type === ADMIN_MENU_AGGREGATION || m.type === MENU_AGGREGATION) &&
    Array.isArray(m.data?.food_summary) &&
    Array.isArray(m.data?.beverage_summary)
  );
}
