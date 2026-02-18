import styled from 'styled-components';

export const Tab = styled.button<{ $active: boolean }>`
  ${({ theme }) => theme.fonts.Bold18};
  width: fit-content;
  min-width: fit-content;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.Orange01 : theme.colors.Focused};
  border-radius: 0;
  padding: 0.625rem;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.Orange01};
  }
`;
