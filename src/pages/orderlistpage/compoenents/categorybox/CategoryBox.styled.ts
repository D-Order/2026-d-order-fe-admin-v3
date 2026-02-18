import styled from 'styled-components';

export const CategoryBoxWrapper = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.Gray01};

  overflow-x: auto;
  scrollbar-width: none;
`;
