import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect } from 'react';

// 개발 중 임시로 주석 처리
import useAuthRedirect from '@hooks/useAuthRedirect';

import Header from '@components/header/Header';
import SideBar from '@components/sideBar/SideBar';

const DefaultLayout = () => {
  // 개발 중 임시로 주석 처리
  useAuthRedirect();
  const location = useLocation();

  // 라우트 변경 감지를 위한 로그 (디버깅용)
  useEffect(() => {}, [location.pathname]);

  return (
    <Wrapper>
      <Header />
      <MainContainer>
        <SideBarWrapper>
          <SideBar />
        </SideBarWrapper>
        <Contents>
          <Outlet />
        </Contents>
      </MainContainer>
    </Wrapper>
  );
};

export default DefaultLayout;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: calc(var(--vh, 1vh) * 100);
  /* padding-top: 3.5rem; */

  background-color: ${({ theme }) => theme.colors.Bg};
`;

const MainContainer = styled.div`
  display: flex;
  flex-grow: 1;
`;
const SideBarWrapper = styled.div`
  display: flex;
  width: 100px;

  padding-top: 73px;
  padding-left: 92px;
  box-sizing: border-box;
`;
const Contents = styled.main`
  padding-top: 63px;
  box-sizing: border-box;
  display: flex;
  flex-grow: 1;
  min-width: 0;
  overflow-x: hidden;
`;
