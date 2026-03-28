import styled from 'styled-components';

const PAGE_HEIGHT = 'calc(100vh - 63px)';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  height: ${PAGE_HEIGHT};
  max-height: ${PAGE_HEIGHT};
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

export const LeftSide = styled.div`
  flex: 1;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.Bg};
  box-sizing: border-box;
  padding: 1.25rem;
`;

/** 뷰포트에 따라 음식·음료 집계 패널 폭이 200px~300px 사이에서 변함 */
export const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: clamp(200px, 22vw + 80px, 300px);
  max-width: 100%;
  height: ${PAGE_HEIGHT};
  max-height: ${PAGE_HEIGHT};
  min-height: 0;
  padding: clamp(0.75rem, 1.5vw, 1.25rem);
  overflow: hidden;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.Bg};
  box-shadow: 4px 0 10px 2px rgba(0, 0, 0, 0.25);

  @media (max-width: 900px) {
    width: clamp(180px, 26vw, 260px);
  }

  @media (max-width: 640px) {
    width: clamp(160px, 32vw, 220px);
    padding: 0.625rem 0.5rem;
  }
`;

export const AmountSection = styled.div<{ $heightRatio: number }>`
  flex: 0 0 ${({ $heightRatio }) => $heightRatio}%;
  min-height: 0;
  max-height: ${({ $heightRatio }) => $heightRatio}%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;
