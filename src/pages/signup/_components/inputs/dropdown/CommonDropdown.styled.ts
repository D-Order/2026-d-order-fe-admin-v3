import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  max-width: 380px;
`;

export const Label = styled.label`
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ theme }) => theme.colors.Focused};
`;

export const CustomBox = styled.div<{ $isOpen: boolean; $radius?: string }>`
  ${({ theme }) => theme.fonts.SemiBold16};
  box-sizing: border-box;
  padding: 14px;
  border: 1px solid rgba(192, 192, 192, 0.5);
  background-color: ${({ theme }) => theme.colors.Bg};
  color: ${({ theme }) => theme.colors.Black01};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: ${({ $isOpen, $radius }) =>
    $isOpen
      ? `${$radius || '25px'} ${$radius || '25px'} 0 0`
      : $radius || '25px'};

  input {
    border: none;
    background: transparent;
    width: 100%;
    font: inherit;
    color: inherit;
    outline: none;
    cursor: pointer;

    &::placeholder {
      color: ${({ theme }) => theme.colors.Focused};
    }
  }
`;

export const ArrowIcon = styled.img<{ $isOpen: boolean }>`
  width: 24px;
  height: 24px;
  transform: rotate(${({ $isOpen }) => ($isOpen ? '0deg' : '180deg')});
  transition: transform 0.2s ease-in-out;
`;

export const OptionList = styled.ul`
  position: absolute;
  top: calc(100%);
  left: 0;
  width: calc(100% - 2px);
  max-height: 300px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.Bg};
  border: 1px solid rgba(192, 192, 192, 0.5);
  border-radius: 0px 0px 25px 25px;
  z-index: 10;
`;

export const Option = styled.li`
  padding: 20px;
  cursor: pointer;
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ theme }) => theme.colors.Black01};

  &:hover {
    background-color: ${({ theme }) => theme.colors.Orange00};
    color: ${({ theme }) => theme.colors.Orange01};
  }
`;
