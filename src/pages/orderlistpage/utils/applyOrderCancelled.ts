import type { OrderBoxData } from '../compoenents/orderbox/OrderBox';
import type { AdminOrderCancelledMessage } from '../types/orderManagementWs';

/**
 * ADMIN_ORDER_CANCELLED 수신 시: 취소된 아이템(item_id)을 목록에서 제거.
 */
export function applyOrderCancelled(
  prev: OrderBoxData[],
  data: AdminOrderCancelledMessage['data']
): OrderBoxData[] {
  const itemId = data.item_id;

  return prev
    .map((table) => ({
      ...table,
      items: table.items.filter((item) => item.id !== itemId),
    }))
    .filter((table) => table.items.length > 0);
}
