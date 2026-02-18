import { Fragment } from 'react';
import * as S from './OrderList.styled';

import CategoryBox from '../categorybox/CategoryBox';
import OrderBox, { type OrderBoxProps } from '../orderbox/OrderBox';

import SadAcoImage from '@assets/icons/SadAco.png';

export type OrderListProps = {
  orders: OrderBoxProps[];
};

export default function OrderList({ orders }: OrderListProps) {
  const isEmpty = orders.length === 0;

  return (
    <S.OrderListWrapper>
      <CategoryBox />
      {isEmpty ? (
        <S.EmptyStateWrapper>
          <S.EmptyStateImage src={SadAcoImage} alt="" />
          <S.EmptyStateText>{`요청이 없어요..\n이참에 쉬어볼까요?`}</S.EmptyStateText>
        </S.EmptyStateWrapper>
      ) : (
        orders.map((order, index) => (
          <Fragment key={index}>
            <OrderBox
              tableNumber={order.tableNumber}
              tableTime={order.tableTime}
              items={order.items}
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
