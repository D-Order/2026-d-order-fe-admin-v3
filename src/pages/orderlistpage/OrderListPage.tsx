import { useState, useCallback } from 'react';
import * as S from './OrderListPage.styled';

import OrderList from './compoenents/OrderList/OrderList';
import AmountBox from './compoenents/amountBox/AmountBox';
import type { AmountItem } from './compoenents/amountBox/AmountBox';
import type { OrderBoxData } from './compoenents/orderbox/OrderBox';
import type { OrderStatus } from './compoenents/orderboxitem/OrderBoxItem.styled';
import type { EditableStatus } from './compoenents/orderboxitem/OrderBoxItem';
import { useOrderManagementWebSocket } from './hooks/useOrderManagementWebSocket';

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

  const handleOrderItemLongPress = useCallback(
    (tableIndex: number, itemIndex: number) => {
      setOpenTarget({ tableIndex, itemIndex });
    },
    [],
  );

  const handleStatusSelect = useCallback(
    (newStatus: EditableStatus) => {
      if (openTarget == null) return;
      setOrders((prev) =>
        prev.map((table, ti) =>
          ti !== openTarget.tableIndex
            ? table
            : {
                ...table,
                items: table.items.map((item, ii) =>
                  ii !== openTarget.itemIndex
                    ? item
                    : { ...item, status: newStatus as OrderStatus },
                ),
              },
        ),
      );
      setOpenTarget(null);
    },
    [openTarget],
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
