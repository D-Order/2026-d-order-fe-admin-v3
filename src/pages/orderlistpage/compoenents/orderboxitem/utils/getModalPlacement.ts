import type { ModalPlacement } from '../../StatusChangeModal/StatusChangeModal.types';

/** 위쪽 여유 공간(px) 이하면 아래 표시 */
const DEFAULT_SPACE_NEEDED_ABOVE = 200;

/**
 * 앵커 top 기준으로 모달을 위/아래 중 어디에 띄울지 결정하는 순수 함수.
 * @param anchorTop - 앵커 요소의 getBoundingClientRect().top
 * @param spaceNeededAbove - 위쪽으로 필요한 최소 공간(px). 기본 200
 */
export function getModalPlacement(
  anchorTop: number,
  spaceNeededAbove = DEFAULT_SPACE_NEEDED_ABOVE
): ModalPlacement {
  return anchorTop < spaceNeededAbove ? 'bottom' : 'top';
}
