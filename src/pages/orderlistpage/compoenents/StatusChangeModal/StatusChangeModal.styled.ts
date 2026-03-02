import styled, { css } from 'styled-components';
import statusIcon1 from '@assets/icons/buttonIcon/Button1.png';
import statusIcon5 from '@assets/icons/buttonIcon/Button5.svg';
import statusIcon3 from '@assets/icons/buttonIcon/Button3.png';
import type { EditableStatus } from './StatusChangeModal.types';

export type { EditableStatus } from './StatusChangeModal.types';

/** 모달 버튼: default + hover (스타일 전용) */
const MODAL_BUTTON_BG: Record<
  EditableStatus,
  { default: string; hover: string }
> = {
  조리중: { default: '#FFE2D9', hover: '#FFD3C5' },
  조리완료: { default: '#FFE484', hover: '#F8CE70' },
  서빙완료: { default: '#B4B4B4', hover: '#949494' },
};

const BUTTON_ICON: Record<EditableStatus, string> = {
  조리중: statusIcon1,
  조리완료: statusIcon5,
  서빙완료: statusIcon3,
};

/** 전체 화면 블러. 포탈 시 $forPortal=true(z 9998), 모달 내부에서는 z 0 */
export const BlurBackdrop = styled.div<{ $forPortal?: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${({ $forPortal }) => ($forPortal ? 9998 : 0)};
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  pointer-events: auto;
`;

/** skipBackdrop일 때 카드만 감쌀 래퍼. 배경/아이템 없이 카드 위치만 잡음 */
export const CardOnlyWrap = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(0%, -50%);
  z-index: 9999;
`;

/** body 포탈용. placement에 따라 버튼 위/아래에 카드 표시 */
export const CardPortaledWrap = styled.div<{
  $anchorLeft: number;
  $anchorTop: number;
  $anchorWidth: number;
  $anchorHeight: number;
  $placement: 'top' | 'bottom';
}>`
  position: fixed;
  left: ${({ $anchorLeft, $anchorWidth }) => $anchorLeft + $anchorWidth / 2}px;
  top: ${({ $anchorTop, $anchorHeight, $placement }) =>
    $placement === 'top' ? $anchorTop : $anchorTop + $anchorHeight}px;
  transform: ${({ $placement }) =>
    $placement === 'top'
      ? 'translate(-50%, calc(-100% - 2rem))'
      : 'translate(-50%, 2rem)'};
  z-index: 9999;
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
`;

/** 말풍선 꼬리: top이면 카드 아래·꼬리 아래로, bottom이면 카드 위·꼬리 위로 */
export const ModalCard = styled.div<{ $placement?: 'top' | 'bottom' }>`
  position: relative;
  background: ${({ theme }) => theme.colors.Gray01};
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 160px;
  pointer-events: auto;

  /* 말풍선 꼬리 (역삼각형) */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    ${({ theme, $placement }) =>
      $placement === 'bottom'
        ? css`
            top: 0;
            transform: translate(-50%, -100%);
            border-bottom: 0.5rem solid ${theme.colors.Gray01};
          `
        : css`
            bottom: 0;
            transform: translate(-50%, 100%);
            border-top: 0.5rem solid ${theme.colors.Gray01};
          `}
  }
`;

const buttonBase = `
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: background-color 0.12s ease;
  -webkit-tap-highlight-color: transparent;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    flex-shrink: 0;
  }
`;

export const StatusButton조리중 = styled.button`
  ${buttonBase}
  ${({ theme }) => theme.fonts.SemiBold16};
  background-color: ${MODAL_BUTTON_BG.조리중.default};
  color: #ff6e3f;
  &:hover {
    background-color: ${MODAL_BUTTON_BG.조리중.hover};
  }
`;

export const StatusButton조리완료 = styled.button`
  ${buttonBase}
  ${({ theme }) => theme.fonts.SemiBold16};
  background-color: ${MODAL_BUTTON_BG.조리완료.default};
  color: #be5d3a;
  &:hover {
    background-color: ${MODAL_BUTTON_BG.조리완료.hover};
  }
`;

export const StatusButton서빙완료 = styled.button`
  ${buttonBase}
  ${({ theme }) => theme.fonts.SemiBold16};
  background-color: ${MODAL_BUTTON_BG.서빙완료.default};
  color: #f2f2f2;
  &:hover {
    background-color: ${MODAL_BUTTON_BG.서빙완료.hover};
  }
`;

export { BUTTON_ICON };
