import type { OrderBoxData } from '../compoenents/orderbox/OrderBox';
import type { AdminNewOrderMessage } from '../types/orderManagementWs';
import { mapWsLineItemToOrderItem } from './mapSnapshotToOrderBoxData';

/**
 * ADMIN_NEW_ORDER 수신 시: 주문 단위로 목록에 반영.
 * 동일 `order_id`가 이미 있으면 items만 이어 붙임(중복 푸시 대비).
 */
export function applyNewOrder(
  prev: OrderBoxData[],
  data: AdminNewOrderMessage['data']
): OrderBoxData[] {
  if (!Array.isArray(data.orders) || data.orders.length === 0) return prev;

  const next = prev.map((b) => ({ ...b, items: [...b.items] }));

  for (const order of data.orders) {
    const oid = order.order_id;
    const idx = next.findIndex((b) => b.orderId === oid);
    const newItems = (order.items ?? []).map((row) => mapWsLineItemToOrderItem(row));
    const tableTime = order.time_ago ?? '00분전';

    if (idx >= 0) {
      next[idx] = {
        ...next[idx],
        items: [...next[idx].items, ...newItems],
        tableTime: tableTime || next[idx].tableTime,
      };
    } else {
      next.push({
        orderId: oid,
        tableNumber: Number(order.table_num) || 1,
        tableTime,
        items: newItems,
      });
    }
  }

  return next;
}
