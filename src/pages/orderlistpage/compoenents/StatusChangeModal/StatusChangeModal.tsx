import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as S from './StatusChangeModal.styled';
import type {
  EditableStatus,
  StatusChangeModalProps,
} from './StatusChangeModal.types';

export type { AnchorRect, ModalPlacement, EditableStatus } from './StatusChangeModal.types';

const CardContent = ({
  onSelect,
  placement = 'top',
}: {
  onSelect: (s: EditableStatus) => void;
  placement?: 'top' | 'bottom';
}) => (
  <S.ModalCard $placement={placement} role="dialog" aria-label="주문 상태 변경">
    <S.StatusButton조리중 type="button" onClick={() => onSelect('조리중')}>
      <img src={S.BUTTON_ICON.조리중} alt="" />
      조리중
    </S.StatusButton조리중>
    <S.StatusButton조리완료 type="button" onClick={() => onSelect('조리완료')}>
      <img src={S.BUTTON_ICON.조리완료} alt="" />
      조리완료
    </S.StatusButton조리완료>
    <S.StatusButton서빙완료 type="button" onClick={() => onSelect('서빙완료')}>
      <img src={S.BUTTON_ICON.서빙완료} alt="" />
      서빙완료
    </S.StatusButton서빙완료>
  </S.ModalCard>
);

export default function StatusChangeModal({
  onSelect,
  onClose,
  skipBackdrop,
  anchorRect,
  placement = 'top',
}: StatusChangeModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (skipBackdrop) {
    if (anchorRect) {
      return createPortal(
        <S.CardPortaledWrap
          $anchorLeft={anchorRect.left}
          $anchorTop={anchorRect.top}
          $anchorWidth={anchorRect.width}
          $anchorHeight={anchorRect.height}
          $placement={placement}
        >
          <CardContent onSelect={onSelect} placement={placement} />
        </S.CardPortaledWrap>,
        document.body,
      );
    }
    return (
      <S.CardOnlyWrap>
        <CardContent onSelect={onSelect} />
      </S.CardOnlyWrap>
    );
  }
}
