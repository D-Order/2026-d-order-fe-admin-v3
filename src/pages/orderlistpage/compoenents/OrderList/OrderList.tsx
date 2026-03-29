import { Fragment } from 'react';
import * as S from './OrderList.styled';

import CategoryBox from '../categorybox/CategoryBox';
import OrderBox, { type OrderBoxData } from '../orderbox/OrderBox';

import SadAcoImage from '@assets/icons/SadAcoco.png';

export type OpenTarget = { tableIndex: number; itemIndex: number } | null;

export type OrderListProps = {
  orders: OrderBoxData[];
  openTarget: OpenTarget;
  onOrderItemLongPress: (tableIndex: number, itemIndex: number) => void;
  onStatusSelect: (
    newStatus: import('../orderboxitem/OrderBoxItem').EditableStatus,
  ) => void;
  onModalClose: () => void;
};

export default function OrderList({
  orders,
  openTarget,
  onOrderItemLongPress,
  onStatusSelect,
  onModalClose,
}: OrderListProps) {
  const isEmpty = orders.length === 0;

  return (
    <S.OrderListWrapper>
      <CategoryBox />
      {isEmpty ? (
        <S.EmptyStateWrapper>
          <S.EmptyStateImage src={SadAcoImage} alt='' />
          <S.EmptyStateText>{`요청이 없어요..\n이참에 쉬어볼까요?`}</S.EmptyStateText>
        </S.EmptyStateWrapper>
      ) : (
        orders.map((order, index) => (
          <Fragment
            key={
              order.orderId != null
                ? `o-${order.orderId}`
                : `i-${index}-t-${order.tableNumber}`
            }
          >
            <OrderBox
              tableNumber={order.tableNumber}
              tableTime={order.tableTime}
              items={order.items}
              tableIndex={index}
              openTarget={openTarget}
              onOrderItemLongPress={onOrderItemLongPress}
              onStatusSelect={onStatusSelect}
              onModalClose={onModalClose}
            />
            {orders.length > 1 && index < orders.length - 1 && (
              <S.OrderBoxDivider />
            )}
          </Fragment>
        ))
      )}
    </S.OrderListWrapper>
  );
}
