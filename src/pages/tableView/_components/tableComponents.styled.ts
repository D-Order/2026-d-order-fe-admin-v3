import styled, { css } from "styled-components";

//체크박스 반영
export const CardWrapper = styled.div<{ $isOverdue: boolean; $isSelected: boolean }>`
  background-color: ${({ theme, $isOverdue, $isSelected }) =>
    $isSelected ? theme.colors.Gray01 : ($isOverdue ? theme.colors.Point : theme.colors.Gray01)};  
  color: ${({ theme }) => theme.colors.Black01};
  
  border: ${({ theme, $isSelected }) => 
    $isSelected ? `2px solid ${theme.colors.Orange01}` : `2px solid ${theme.colors.Gray01}`};
  box-shadow: ${({ $isSelected }) => 
    $isSelected ? '0 0 8px 0 rgba(255, 110, 63, 0.20)' : 'none'};
  width: 8.5rem;
  height: 11.5rem;
  border-radius: 0.8rem;
  padding: 0.8rem 0.7rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease-in-out; 
  @media (min-width: 1180px) {
    width: 10rem;
    height: 12.2rem;
  }
  @media (min-width: 1366px) {
    width: 12.4rem;
    height: 16.2rem;
  }
  img {
    width: 100%;
  }
`;

// 만료 여부 반영
export const TableInfo = styled.div<{ $isOverdue: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.65rem;
  .tableNumber {
    margin-left:0.3rem;
    font-size: 0.8rem;
    font-weight: 700;
    ${({ theme }) => css(theme.fonts.Bold14)};
    @media (min-width: 1180px) {
      font-size: 1rem;
    }
    @media (min-width: 1366px) {
      font-size: 1.2rem;
    }
    
  }
  .orderTime {
    font-size: 0.6rem;
    font-weight: 600;
    color: ${({ theme, $isOverdue }) =>
    $isOverdue ? theme.colors.Orange01 : theme.colors.Black01};  ;
    ${({ theme }) => css(theme.fonts.SemiBold12)};
    @media (min-width: 1180px) {
      font-size: 0.8rem;
    }
    @media (min-width: 1366px) {
      font-size: 0.9rem;
    }
    
  }

  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 1.2rem;
    height: 1.2rem;
    aspect-ratio: 1 / 1;
    border-radius: 4px;
    border: 1px solid #E2E2E2;
    background: #FFF;
    cursor: pointer;
    position: relative;
    outline: none;
    margin: 0;
    /* 체크됐을 때 스타일선언 */
    &:checked {
      background-color: ${({ theme }) => theme.colors.Orange01};
      border-color: ${({ theme }) => theme.colors.Orange01};
      &::after {
        content: '✔';
        color: white;
        font-size: 20px;
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
`;

export const DivideLine = styled.div`
  width: 100%;
  height: 0.5px;
  background-color: rgba(192, 192, 192, 0.50);
  border-bottom: 1px solid #EBEBEB;
`;

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 위쪽(메뉴)과 아래쪽(더보기)을 양끝으로 찢음 */
  flex-grow: 1; /* DivideLine 아래부터 TotalPrice 위까지의 공간을 모두 차지함 */
  width: 100%;
  margin-bottom: 2rem; /* TotalPrice가 absolute로 붙어있으므로 하단 여백 확보 */
`;

export const MenuList = styled.div`
  width: 100%;
  min-height: 7.9rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  
  img {
    width: 100%;
  }
  
`;
export const ItemRow = styled.div`
  display: flex;
  flex-direction : column;
  justify-content: space-between;
  height: fit-content;
  gap: 0.5rem;
  min-height: 1.6rem;
  margin-top: 0.8rem;
  box-sizing: border-box;
  @media (min-width: 1180px) {
    gap: 0.7rem;
    min-height: 1.6rem;
    margin-top: 0.8rem;
    box-sizing: border-box;
  }
  @media (min-width: 1366px) {
    gap: 1rem;
    min-height: 1.6rem;
    margin-top: 1.3rem;
    box-sizing: border-box;
  }
`;
export const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: fit-content;

  .menuName {
    font-size: 0.75rem;
    ${({ theme }) => css(theme.fonts.Bold12)};
    @media (min-width: 1180px) {
      font-size: 0.8rem;
    }
    @media (min-width: 1366px) {
      font-size: 1rem;
    }
  }
  .menuAmount {
    font-size: 0.75rem;
    ${({ theme }) => css(theme.fonts.Medium12)};
    font-weight: 500;
    @media (min-width: 1180px) {
      font-size: 0.8rem;
    }
    @media (min-width: 1366px) {
      font-size: 1rem;
    }
  }
`;

export const ToDetail = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  color: ${({ theme }) => theme.colors.Orange01};
  font-size: 0.6rem;
  font-weight: 600;
  box-sizing: border-box;
  ${({ theme }) => css(theme.fonts.SemiBold10)};
  @media (min-width: 1180px) {
      font-size: 0.7rem;
    }
    @media (min-width: 1366px) {
      font-size: 0.8rem;
    }
`;

export const TotalPrice = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: absolute;
  bottom: 0.8rem;
  .totalPrice {
    margin-left: 0.7rem;
    font-size: 0.75rem;
    font-weight: 700;
    ${({ theme }) => css(theme.fonts.Bold12)};
    @media (min-width: 1180px) {
      font-size: 0.8rem;
    }
    @media (min-width: 1366px) {
      font-size: 1rem;
    }
  }
`;

export const EmptyImage = styled.img`
  width: 5rem !important; /* 이미지 크기 (적당히 조절 가능) */
  height: auto;
  opacity: 0.15; /* 투명도 조절 */
  position: absolute;
  top: 55%; /* 카드 중앙에 맞추기 위해 55% 정도로 설정 */
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none; /* 이미지가 클릭 이벤트를 방해하지 않도록 설정 */
`;

// grid style
export const GridWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 20px 0;
  box-sizing: border-box;
  user-select: none;
`;

/* 좌우 네비 */
const navBase = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 22px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover { opacity: 0.9; }
`;
export const NavButtonLeft = styled.button`${navBase}; left: 8px;`;
export const NavButtonRight = styled.button`${navBase}; right: 8px;`;

/* 뷰포트 */
export const GridViewport = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

/* ✅ 트랙: 전체 폭 = pageCount * 100% (부모 기준)
   ✅ 이동: 한 페이지당 (100 / pageCount)% 만큼 이동 */
export const PagesTrack = styled.div<{
  $pageCount: number;
  $currentPage: number;
}>`
  display: flex;
  width: ${({ $pageCount }) => $pageCount * 100}%;
  transform: ${({ $currentPage, $pageCount }) =>
    `translateX(-${$pageCount ? ($currentPage * 100) / $pageCount : 0}%)`};
  transition: transform 320ms ease-in-out;
`;

/* ✅ 각 페이지: 트랙 대비 (100 / pageCount)% */
export const PageGrid = styled.div<{ $pageCount: number }>`
  width: ${({ $pageCount }) => (100 / $pageCount)}%;
  padding: 0.5rem 8px; // 기본 패딩 (작은 화면용)
  box-sizing: border-box;

  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr)); 
  grid-template-rows: repeat(3, auto); 
  align-content: start; 
  
  row-gap: 12px;
  column-gap: 12px;

  min-height: 40rem; 
  
  // /* ✅ 가장 큰 화면 범위에서만 패딩 조정 */
  // @media (min-width: 1366px) {
  //   min-height: 52rem; 
  //   padding-top: 1rem; // 0.5rem에서 2rem으로 상단 여백 확대
  // }
  /* ✅ 가장 큰 화면 범위에서만 패딩 조정 */
  @media (min-width: 1366px) {
    min-height: 52rem; 
    padding-top: 1.2rem;
  }
`;

/* 인디케이터 (중복 정의 없게 유지) */
export const PageIndicatorWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  height: 20px;
  margin-bottom: 2px;
  @media (min-width: 1366px) {
    height: 30px;
    margin-top: 0.3rem;
  }
`;

export const Dot = styled.div<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "2rem" : "0.4rem")};
  height: 0.5rem;
  border-radius: 0.3rem;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.Orange01 : theme.colors.Gray01};
  transition: all 0.3s ease;
  cursor: pointer;
`;
