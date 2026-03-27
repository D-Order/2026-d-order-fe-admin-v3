/** 모달 앵커(버튼)의 화면 기준 사각형. 포탈 위치 계산용 */
export type AnchorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** 위쪽 공간 부족할 때만 아래 표시 */
export type ModalPlacement = 'top' | 'bottom';

/** 모달에서 선택 가능한 상태 (서빙중은 서버 전용, 조작 불가) */
export type EditableStatus = '조리중' | '조리완료' | '서빙완료';

export type StatusChangeModalProps = {
  onSelect: (status: EditableStatus) => void;
  onClose: () => void;
  skipBackdrop?: boolean;
  anchorRect?: AnchorRect | null;
  placement?: ModalPlacement;
};
