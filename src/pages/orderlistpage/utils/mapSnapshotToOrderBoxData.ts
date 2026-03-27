import type { OrderBoxData, OrderItem } from '../compoenents/orderbox/OrderBox';
import type { OrderStatus } from '../compoenents/orderboxitem/OrderBoxItem.styled';
import type { AdminOrderSnapshotItem } from '../types/orderManagementWs';

const BASE_URL = (import.meta.env.VITE_BASE_URL ?? '').toString().replace(/\/+$/, '');

/** API status → UI OrderStatus (조리중/서빙중/서빙완료/서빙수락/조리완료) */
export function mapStatus(apiStatus: string): OrderStatus {
  const s = String(apiStatus).toLowerCase();
  if (s === 'pending' || s === 'cooking' || s === '조리중') return '조리중';
  if (s === 'cooked' || s === '조리완료') return '조리완료';
  if (s === 'served' || s === '서빙완료') return '서빙완료';
  if (s === '서빙중') return '서빙중';
  if (s === '서빙수락') return '서빙수락';
  if (s === 'serving') return '서빙중';
  if (s === 'cancelled') return '조리중'; // 취소 시 리스트에서 제외하므로 임시 매핑
  return '조리중';
}

/** created_at 기준 "N분전" 형태 (간단 버전) */
function formatTableTime(createdAt?: string): string {
  if (!createdAt) return '00분전';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '00분전';
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (diffMin < 0) return '00분전';
  if (diffMin < 60) return `${diffMin}분전`;
  const h = Math.floor(diffMin / 60);
  return `${h}시간전`;
}

export function mapSnapshotToOrderBoxData(
  orders: AdminOrderSnapshotItem[]
): OrderBoxData[] {
  const byTable = new Map<number, { items: OrderItem[]; earliestAt?: string }>();

  for (const o of orders) {
    const tableNum = Number(o.table_num) || 1;
    const item: OrderItem = {
      set_menu: Boolean(o.from_set),
      menuName: o.menu_name ?? '',
      quantity: Number(o.quantity) || 1,
      status: mapStatus(o.status),
    };
    if (o.order_menu_id != null) item.id = o.order_menu_id;
    if (o.menu_image) {
      item.imageUrl = o.menu_image.startsWith('http') ? o.menu_image : `${BASE_URL}${o.menu_image}`;
    }
    const entry = byTable.get(tableNum) ?? { items: [] };
    entry.items.push(item);
    if (o.created_at) {
      const prev = entry.earliestAt ? new Date(entry.earliestAt).getTime() : Infinity;
      if (new Date(o.created_at).getTime() < prev) entry.earliestAt = o.created_at;
    }
    byTable.set(tableNum, entry);
  }

  return Array.from(byTable.entries())
    .sort(([a], [b]) => a - b)
    .map(([tableNumber, { items, earliestAt }]) => ({
      tableNumber,
      tableTime: formatTableTime(earliestAt),
      items,
    }));
}
