import * as S from './TabTitle.styled';

export type TabStatus = 'click' | 'deactivated';

export type TabItem = {
  value: string;
  status: TabStatus;
  type: string;
  label: string;
};

export type TabTitleProps = {
  value: string;
  status: TabStatus;
  type: string;
  label: string;
  onClick?: (value: string) => void;
};

export default function TabTitle({
  value,
  status,
  type,
  label,
  onClick,
}: TabTitleProps) {
  return (
    <S.Tab
      type="button"
      $active={status === 'click'}
      data-tab-type={type}
      onClick={() => onClick?.(value)}
    >
      {label}
    </S.Tab>
  );
}
