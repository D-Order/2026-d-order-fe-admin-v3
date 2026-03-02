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

export const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  flex-shrink: 0;
  width: 300px;
  height: ${PAGE_HEIGHT};
  max-height: ${PAGE_HEIGHT};
  min-height: 0;
  padding: 1.25rem;
  overflow: hidden;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.Bg};
  box-shadow: 4px 0 10px 2px rgba(0, 0, 0, 0.25);
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
