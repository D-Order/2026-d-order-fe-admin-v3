import styled, { css } from 'styled-components';

export type OrderStatus = '조리중' | '서빙중' | '서빙완료' | '서빙수락';

/** hex 색상에 투명도 적용. 예: withAlpha('#FF6E3F', 0.2) → 20% 불투명 */
const withAlpha = (hex: string, alpha: number) =>
  `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;

const statusStyles: Record<OrderStatus, { bg: string; text: string }> = {
  조리중: {
    bg: withAlpha('#FF6E3F', 0.2),
    text: '#FF6E3F',
  },
  서빙중: {
    bg: withAlpha('#FF6E3F', 0.9),
    text: '#FFFFFF',
  },
  서빙완료: {
    bg: withAlpha('#6A6A6A', 0.5),
    text: '#F2F2F2',
  },
  서빙수락: {
    bg: withAlpha('#FFD232', 0.6),
    text: '#BE5D3A',
  },
};

export const OrderBoxItemWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
`;

export const ItemInfoHalf = styled.div`
  display: flex;
  width: 50%;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ItemInfoHalf2 = styled.div`
  display: flex;
  width: 40%;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.25rem;
  min-width: 0;
  flex: 1;
`;

export const ItemImage = styled.div`
  width: 3.125rem; // 50px
  height: 3.125rem; // 50px
  background-color: ${({ theme }) => theme.colors.Gray01};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ItemInfoName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
  flex: 1;
`;

export const SetPill = styled.span`
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  background-color: ${({ theme }) => theme.colors.Orange01};
  color: ${({ theme }) => theme.colors.White};
  ${({ theme }) => theme.fonts.SemiBold10};
`;

/** 조리중·서빙수락: SemiBold15 / 서빙중·서빙완료: Medium16. 색상: 서빙중·서빙수락 #888888, 서빙완료 #C0C0C0, 조리중 Black01 */
const menuQuantityStyles: Record<
  OrderStatus,
  { font: 'SemiBold15' | 'Medium16'; color: string }
> = {
  조리중: { font: 'SemiBold15', color: '#2A2A2A' },
  서빙중: { font: 'Medium16', color: '#888888' },
  서빙완료: { font: 'Medium16', color: '#C0C0C0' },
  서빙수락: { font: 'SemiBold15', color: '#888888' },
};

export const MenuName = styled.span<{ $status: OrderStatus }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme, $status }) => theme.fonts[menuQuantityStyles[$status].font]};
  color: ${({ $status }) => menuQuantityStyles[$status].color};
`;

export const Quantity = styled.span<{ $status: OrderStatus }>`
  ${({ theme, $status }) => theme.fonts[menuQuantityStyles[$status].font]};
  color: ${({ $status }) => menuQuantityStyles[$status].color};
`;

export const StatusBadge = styled.span<{ $status: OrderStatus }>`
  width: 90px;
  height: 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.5rem;
  border-radius: 9999px;
  box-sizing: border-box;
  ${({ $status }) => {
    const s = statusStyles[$status];
    return css`
      background-color: ${s.bg};
      color: ${s.text};
    `;
  }}
  ${({ theme }) => theme.fonts.SemiBold14};
`;
