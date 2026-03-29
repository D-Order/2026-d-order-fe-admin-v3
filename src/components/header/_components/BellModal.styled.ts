import styled from 'styled-components';

// 모달 열릴 때 배경을 어둡게 처리하는 오버레이
export const Overlay = styled.div<{ $active: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
  opacity: ${(props) => (props.$active ? 1 : 0)};
  pointer-events: ${(props) => (props.$active ? 'auto' : 'none')};
  transition: opacity 0.25s ease;
`;

// 화면 상/우/하 20px 여백, 좌측은 콘텐츠가 채움
export const BellModalWrapper = styled.div<{ $active: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  bottom: 20px;
  width: 412px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.Bg};
  border-radius: 16px;
  box-shadow: -4px 4px 32px rgba(0, 0, 0, 0.18);
  z-index: 100;

  transform: translateX(
    ${(props) => (props.$active ? '0' : 'calc(100% + 20px)')}
  );
  opacity: ${(props) => (props.$active ? 1 : 0)};
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
  pointer-events: ${(props) => (props.$active ? 'auto' : 'none')};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 63px;
  background-color: ${({ theme }) => theme.colors.Gray01};
  border-bottom: 1px solid #e2e2e2;
`;

export const ModalTitle = styled.span`
  ${({ theme }) => theme.fonts.ExtraBold18}
  color: ${({ theme }) => theme.colors.Black02};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.Black02};
  ${({ theme }) => theme.fonts.SemiBold16}
`;

export const EmptyText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0;
  ${({ theme }) => theme.fonts.SemiBold14}
  color: rgba(42, 42, 42, 0.4);
`;

export const NotificationItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e2e2;
  &:last-child {
    border-bottom: none;
  }
`;

/* 테이블 번호 + 시간이 같은 줄에 배치되는 상단 행 */
export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableNumber = styled.span<{ $isProcessed: boolean }>`
  ${({ theme }) => theme.fonts.Bold18}
  color: ${({ $isProcessed, theme }) =>
    $isProcessed ? theme.colors.Focused : theme.colors.Orange01};
`;

export const ItemTypeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) => theme.fonts.Bold18}
  color: ${({ theme }) => theme.colors.Black01};
`;

export const ProcessedBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  background: #ebebeb;
  ${({ theme }) => theme.fonts.Bold12}
  color: #888;
`;

export const ItemTime = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) => theme.fonts.Medium14}
  color: ${({ theme }) => theme.colors.Focused};
  white-space: nowrap;
  flex-shrink: 0;
`;
