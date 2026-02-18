import * as S from './OrderListPage.styled';

import OrderList from './compoenents/OrderList/OrderList';
import AmountBox from './compoenents/amountBox/AmountBox';
import type { AmountItem } from './compoenents/amountBox/AmountBox';
import type { OrderBoxProps } from './compoenents/orderbox/OrderBox';

const orders: OrderBoxProps[] = [
  {
    tableNumber: 1,
    tableTime: '00분전',
    items: [
      {
        set_menu: false,
        menuName: '메뉴123123213123213명',
        quantity: 0,
        status: '조리중',
      },
      {
        set_menu: true,
        menuName: '메13413431431413413413413431413명',
        quantity: 0,
        status: '서빙중',
      },
      { set_menu: true, menuName: '메뉴명', quantity: 0, status: '서빙완료' },
      { set_menu: true, menuName: '메뉴명', quantity: 0, status: '서빙수락' },
    ],
  },
  {
    tableNumber: 2,
    tableTime: '05분전',
    items: [
      { set_menu: true, menuName: '피자 세트', quantity: 2, status: '조리중' },
      { set_menu: false, menuName: '콜라', quantity: 1, status: '서빙완료' },
    ],
  },
];

const foodItems: AmountItem[] = [
  {
    menuName:
      '난장이가볶아올린작은밥밥난장이가볶아올린작은밥밥난장이가볶아올린작은밥밥난장이가볶아올린작은밥밥',
    quantity: 16,
  },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
  { menuName: '난장이가볶아올린작은밥밥', quantity: 16 },
  { menuName: '피자', quantity: 0 },
  { menuName: '감자튀김', quantity: 8 },
  { menuName: '두부김치', quantity: 32 },
  { menuName: '제육볶음', quantity: 6 },
  { menuName: '차돌짬뽕탕', quantity: 9 },
];

const drinkItems: AmountItem[] = [
  { menuName: '콜라', quantity: 17 },
  { menuName: '사이다', quantity: 20 },
  { menuName: '보리차', quantity: 10 },
  { menuName: '토닉', quantity: 10 },
  { menuName: '탄산수', quantity: 6 },
];

export default function OrderListPage() {
  return (
    <S.Wrapper>
      <S.LeftSide>
        <OrderList orders={orders} />
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
