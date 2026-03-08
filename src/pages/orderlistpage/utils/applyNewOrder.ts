import type { OrderBoxData, OrderItem } from '../compoenents/orderbox/OrderBox';
import type { AdminNewOrderMessage } from '../types/orderManagementWs';
import { mapStatus } from './mapSnapshotToOrderBoxData';

const BASE_URL = (import.meta.env.VITE_BASE_URL ?? '').toString().replace(/\/+$/, '');

/**
 * ADMIN_NEW_ORDER 수신 시: 새 주문(들)을 기존 목록에 합침.
 * 같은 table_num이 있으면 해당 테이블에 items 추가, 없으면 새 테이블 추가.
 */
export function applyNewOrder(
  prev: OrderBoxData[],
  data: AdminNewOrderMessage['data']
): OrderBoxData[] {
  if (!Array.isArray(data.orders) || data.orders.length === 0) return prev;

  const tables = new Map<number | string, OrderBoxData>();
  for (const t of prev) {
    const k = typeof t.tableNumber === 'number' ? t.tableNumber : Number(t.tableNumber) || t.tableNumber;
    tables.set(k, { ...t, items: [...t.items] });
  }

  for (const order of data.orders) {
    const tableNum = Number(order.table_num) || 1;
    const tableTime = order.time_ago ?? '00분전';
    const newItems: OrderItem[] = (order.items ?? []).map((row) => {
      const item: OrderItem = {
        set_menu: Boolean(row.is_set),
        menuName: row.menu_name ?? '',
        quantity: Number(row.quantity) || 1,
        status: mapStatus(row.status),
      };
      if (row.order_item_id != null) item.id = row.order_item_id;
      if (row.image) {
        item.imageUrl = String(row.image).startsWith('http') ? row.image : `${BASE_URL}${row.image}`;
      }
      return item;
    });

    const existing = tables.get(tableNum);
    if (existing) {
      existing.items.push(...newItems);
    } else {
      tables.set(tableNum, { tableNumber: tableNum, tableTime, items: newItems });
    }
  }

  return Array.from(tables.entries())
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, table]) => table);
}
