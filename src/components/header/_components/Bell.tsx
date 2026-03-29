import styled from 'styled-components';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import BellModal from './BellModal';
import { dummyNotifications } from '../dummy/dummyNotifications';

interface BellProps {
  active: boolean; // 배지 노출 여부 (hasUnread)
  onClick: () => void;
  modalOpen: boolean;
  onCloseModal: () => void;
}
//actice나중에 추가 - API 연결 후 hasUnread 기반으로 active 재연결 필요
const Bell = ({ onClick, modalOpen, onCloseModal }: BellProps) => {
  // 미처리 알림 수 (더미 데이터 기반 — API 연결 시 교체)
  const activeCount = dummyNotifications.filter((n) => !n.isProcessed).length;

  // 아웃사이드 클릭 감지 제거 — 오버레이(Overlay)가 전체 화면을 덮어
  // 클릭 아웃사이드를 처리하므로 중복 처리 불필요.
  // 모달 내부 클릭 시 닫힘 현상도 이 리스너가 원인이었음.

  return (
    <BellWrapper onClick={onClick}>
      <img src={IMAGE_CONSTANTS.BELL} alt='알림 종 아이콘' />
      {/* 미처리 알림 있을 때 숫자 배지 표시 (더미 데이터 기반 — API 연결 시 active 조건 재연결) */}
      {activeCount > 0 && <Badge>{activeCount}</Badge>}
      <BellModal $active={modalOpen} onClose={onCloseModal} />
    </BellWrapper>
  );
};

export default Bell;

const BellWrapper = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const Badge = styled.div`
  position: absolute;
  top: -2px;
  right: -1px;
  min-width: 12px;
  height: 12px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.Point};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 1;
  box-sizing: border-box;

  ${({ theme }) => theme.fonts.SemiBold10}
  color: ${({ theme }) => theme.colors.Black01};
`;
