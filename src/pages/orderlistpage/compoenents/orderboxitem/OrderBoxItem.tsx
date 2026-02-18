import * as S from './OrderBoxItem.styled';
import type { OrderStatus } from './OrderBoxItem.styled';

/* 조리중 1, 서빙중 2, 서빙완료 3, 서빙수락 4 — src/assets/icons/buttonIcon/ 에 1.svg, 2.svg, 3.svg, 4.svg 넣기 */
import statusIcon1 from '@assets/icons/buttonIcon/Button1.png';
import statusIcon2 from '@assets/icons/buttonIcon/Button2.png';
import statusIcon3 from '@assets/icons/buttonIcon/Button3.png';
import statusIcon4 from '@assets/icons/buttonIcon/Button4.png';

const STATUS_ICONS: Record<OrderStatus, string> = {
  조리중: statusIcon1,
  서빙중: statusIcon2,
  서빙완료: statusIcon3,
  서빙수락: statusIcon4,
};

export type OrderBoxItemProps = {
  imageUrl?: string;
  set_menu: boolean;
  menuName: string;
  quantity: number;
  status: OrderStatus;
};

const STATUS_ICON_SIZE = 10;

function StatusIcon({ status }: { status: OrderStatus }) {
  const src = STATUS_ICONS[status];
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      width={STATUS_ICON_SIZE}
      height={STATUS_ICON_SIZE}
      style={{ display: 'block', flexShrink: 0 }}
    />
  );
}

export default function OrderBoxItem({
  imageUrl,
  set_menu,
  menuName,
  quantity,
  status,
}: OrderBoxItemProps) {
  return (
    <S.OrderBoxItemWrapper>
      <S.ItemInfoHalf>
        <S.ItemInfo>
          <S.ItemImage>
            {imageUrl ? (
              <img src={imageUrl} alt="" />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#E0E0E0',
                }}
              />
            )}
          </S.ItemImage>
          <S.ItemInfoName>
            {set_menu && <S.SetPill>세트</S.SetPill>}
            <S.MenuName $status={status}>{menuName}</S.MenuName>
          </S.ItemInfoName>
        </S.ItemInfo>
      </S.ItemInfoHalf>
      <S.ItemInfoHalf2>
        <S.Quantity $status={status}>{quantity}</S.Quantity>
        <S.StatusBadge $status={status}>
          <StatusIcon status={status} />
          {status}
        </S.StatusBadge>
      </S.ItemInfoHalf2>
    </S.OrderBoxItemWrapper>
  );
}
