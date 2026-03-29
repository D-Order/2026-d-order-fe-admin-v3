import { useState, useCallback, useRef } from 'react';
import { isAxiosError } from 'axios';
import * as S from './OrderListPage.styled';

import OrderList from './compoenents/OrderList/OrderList';
import AmountBox from './compoenents/amountBox/AmountBox';
import type { AmountItem } from './compoenents/amountBox/AmountBox';
import type { OrderBoxData } from './compoenents/orderbox/OrderBox';
import type { OrderStatus } from './compoenents/orderboxitem/OrderBoxItem.styled';
import type { EditableStatus } from './compoenents/orderboxitem/OrderBoxItem';
import { useOrderManagementWebSocket } from './hooks/useOrderManagementWebSocket';
import { updateOrderItemStatus } from './apis/updateOrderItemStatus';
import { mapEditableStatusToApiStatus } from './utils/mapEditableStatusToApiStatus';
import { mapStatus } from './utils/mapSnapshotToOrderBoxData';

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderBoxData[]>([]);
  const [foodItems, setFoodItems] = useState<AmountItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<AmountItem[]>([]);

  useOrderManagementWebSocket(setOrders, (food, beverage) => {
    setFoodItems(food);
    setDrinkItems(beverage);
  });

  const [openTarget, setOpenTarget] = useState<{
    tableIndex: number;
    itemIndex: number;
  } | null>(null);
  const statusSubmittingRef = useRef(false);

  const handleOrderItemLongPress = useCallback(
    (tableIndex: number, itemIndex: number) => {
      setOpenTarget({ tableIndex, itemIndex });
    },
    [],
  );

  const handleStatusSelect = useCallback(
    async (newStatus: EditableStatus) => {
      if (openTarget == null || statusSubmittingRef.current) return;

      const { tableIndex, itemIndex } = openTarget;
      const orderItemId = orders[tableIndex]?.items[itemIndex]?.id;

      if (orderItemId == null) {
        alert('order_item_id가 없어 상태를 변경할 수 없습니다.');
        return;
      }

      statusSubmittingRef.current = true;
      try {
        const target_status = mapEditableStatusToApiStatus(newStatus);
        console.log('[OrderList] POST /api/v3/django/order/status/', {
          order_item_id: orderItemId,
          target_status,
        });

        const res = await updateOrderItemStatus({
          order_item_id: orderItemId,
          target_status,
        });

        const d = res.data;
        const nextUiStatus: OrderStatus = d?.status
          ? mapStatus(d.status)
          : (newStatus as OrderStatus);

        console.log('[OrderList] 상태 변경 응답', res);

        if (d?.all_items_served) {
          setOrders((prev) => {
            const oid = prev[tableIndex]?.orderId;
            if (oid != null) {
              return prev.filter((box) => box.orderId !== oid);
            }
            return prev.filter((_, i) => i !== tableIndex);
          });
        } else {
          setOrders((prev) =>
            prev.map((tableRow, ti) =>
              ti !== tableIndex
                ? tableRow
                : {
                    ...tableRow,
                    items: tableRow.items.map((rowItem, ii) =>
                      ii !== itemIndex
                        ? rowItem
                        : { ...rowItem, status: nextUiStatus },
                    ),
                  },
            ),
          );
        }

        setOpenTarget(null);
      } catch (err) {
        let message = '상태 변경에 실패했습니다.';
        if (isAxiosError(err)) {
          const data = err.response?.data as
            | { message?: string; detail?: string }
            | undefined;
          if (typeof data?.message === 'string') message = data.message;
          else if (typeof data?.detail === 'string') message = data.detail;
        }
        alert(message);
      } finally {
        statusSubmittingRef.current = false;
      }
    },
    [openTarget, orders],
  );

  const handleModalClose = useCallback(() => {
    setOpenTarget(null);
  }, []);

  return (
    <S.Wrapper>
      <S.LeftSide>
        <OrderList
          orders={orders}
          openTarget={openTarget}
          onOrderItemLongPress={handleOrderItemLongPress}
          onStatusSelect={handleStatusSelect}
          onModalClose={handleModalClose}
        />
      </S.LeftSide>
      <S.RightSide>
        <S.AmountSection $heightRatio={60}>
          <AmountBox title="음식 집계" items={foodItems} />
        </S.AmountSection>
        <S.AmountSection $heightRatio={40}>
          <AmountBox title="음료 집계" items={drinkItems} />
        </S.AmountSection>
      </S.RightSide>
    </S.Wrapper>
  );
}
