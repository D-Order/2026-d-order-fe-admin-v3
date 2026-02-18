import * as S from './OrderBox.styled';
import OrderBoxItem from '../orderboxitem/OrderBoxItem';
import type { OrderStatus } from '../orderboxitem/OrderBoxItem.styled';

export type OrderItem = {
  imageUrl?: string;
  set_menu: boolean;
  menuName: string;
  quantity: number;
  status: OrderStatus;
};

export type OrderBoxProps = {
  tableNumber: number | string;
  tableTime?: string;
  items: OrderItem[];
};

export default function OrderBox({
  tableNumber,
  tableTime = '00분전',
  items,
}: OrderBoxProps) {
  return (
    <S.OrderBoxWrapper>
      <S.OrderBoxHeader>
        <S.OrderBoxTableNumber>{tableNumber}</S.OrderBoxTableNumber>
        <S.OrderBoxTableTime>{tableTime}</S.OrderBoxTableTime>
      </S.OrderBoxHeader>
      <S.OrderBoxTableContent>
        {items.map((item, index) => (
          <OrderBoxItem
            key={index}
            imageUrl={item.imageUrl}
            set_menu={item.set_menu}
            menuName={item.menuName}
            quantity={item.quantity}
            status={item.status}
          />
        ))}
      </S.OrderBoxTableContent>
    </S.OrderBoxWrapper>
  );
}
