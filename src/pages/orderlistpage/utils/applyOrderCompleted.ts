import type { OrderBoxData } from '../compoenents/orderbox/OrderBox';
import type { OrderCompletedPayload } from '../types/orderManagementWs';

/**
 * ADMIN_ORDER_COMPLETED / ORDER_COMPLETED 수신 시: 해당 테이블 빌지를 목록에서 제거.
 * (오더 내 아이템 전부 서빙 완료 시 서버가 전송)
 */
export function applyOrderCompleted(
  prev: OrderBoxData[],
  data: OrderCompletedPayload
): OrderBoxData[] {
  const tableNum = data.table_num;
  return prev.filter(
    (table) => Number(table.tableNumber) !== Number(tableNum)
  );
}
