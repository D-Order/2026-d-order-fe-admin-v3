import styled from 'styled-components';

export const OrderBoxWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 0.75rem;
  gap: 0.75rem;
`;

export const OrderBoxHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

export const OrderBoxTableNumber = styled.div`
  ${({ theme }) => theme.fonts.Medium14};
  color: ${({ theme }) => theme.colors.Gray01};
  background-color: ${({ theme }) => theme.colors.Gray02};
  padding: 0 0.625rem;
  box-sizing: border-box;
  border-radius: 9999px;
`;

export const OrderBoxTableTime = styled.div`
  ${({ theme }) => theme.fonts.Bold16};
  color: ${({ theme }) => theme.colors.Black01};
`;

export const OrderBoxTableContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
`;
