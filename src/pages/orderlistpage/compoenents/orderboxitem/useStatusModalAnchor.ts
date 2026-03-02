import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { AnchorRect, ModalPlacement } from '../StatusChangeModal/StatusChangeModal.types';
import { getModalPlacement } from './utils/getModalPlacement';

/**
 * 상태 변경 모달의 앵커(버튼) 위치·배치를 관리하는 훅.
 * ref와 isModalOpen만 넘기면 anchorRect, placement를 반환.
 */
export function useStatusModalAnchor(
  anchorRef: RefObject<HTMLDivElement | null>,
  isModalOpen: boolean
): { anchorRect: AnchorRect | null; placement: ModalPlacement } {
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null);
  const [placement, setPlacement] = useState<ModalPlacement>('top');

  useLayoutEffect(() => {
    if (!isModalOpen || !anchorRef.current) {
      setAnchorRect(null);
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    setAnchorRect({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setPlacement(getModalPlacement(rect.top));
  }, [isModalOpen, anchorRef]);

  return { anchorRect, placement };
}
