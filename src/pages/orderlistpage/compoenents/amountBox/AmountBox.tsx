import * as S from './AmountBox.styled';

import ListIcon from '@assets/icons/buttonIcon/icon/Vector.png';

export type AmountItem = {
  menuName: string;
  quantity: number;
};

export type AmountBoxProps = {
  title: string;
  items: AmountItem[];
};

export default function AmountBox({ title, items }: AmountBoxProps) {
  return (
    <S.AmountBoxWrapper>
      <S.Section>
        <S.SectionTitle>
          <S.SectionTitleIcon>
            <img
              src={ListIcon}
              alt=""
              style={{ width: '16px', height: '20px' }}
            />
          </S.SectionTitleIcon>
          {title}
        </S.SectionTitle>
        <S.SectionList>
          {items.map((item, index) => {
            const isZero = item.quantity === 0;
            return (
              <S.Row key={index}>
                <S.MenuName $isZero={isZero}>{item.menuName}</S.MenuName>
                <S.Quantity $isZero={isZero}>{item.quantity}</S.Quantity>
              </S.Row>
            );
          })}
        </S.SectionList>
      </S.Section>
    </S.AmountBoxWrapper>
  );
}
