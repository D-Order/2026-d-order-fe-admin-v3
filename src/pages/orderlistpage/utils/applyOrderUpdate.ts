import type { OrderBoxData, OrderItem } from '../compoenents/orderbox/OrderBox';
import type { AdminOrderUpdateMessage } from '../types/orderManagementWs';
import { mapStatus } from './mapSnapshotToOrderBoxData';

/**
 * ADMIN_ORDER_UPDATE 수신 시 기존 목록에 반영.
 * - item.id(order_menu_id)로 항목 찾아 status 변경
 * - status === 'cancelled' 이면 해당 항목 리스트에서 제외
 */
export function applyOrderUpdate(
  prev: OrderBoxData[],
  data: AdminOrderUpdateMessage['data']
): OrderBoxData[] {
  const itemId = data.item.id;
  const apiStatus = data.item.status;
  const isCancelled = String(apiStatus).toLowerCase() === 'cancelled';

  return prev
    .map((table) => {
      const items = table.items
        .map((item) => {
          if (item.id !== itemId) return item;
          if (isCancelled) return null;
          return { ...item, status: mapStatus(apiStatus) };
        })
        .filter((item): item is OrderItem => item != null);
      return { ...table, items };
    })
    .filter((table) => table.items.length > 0);
}
