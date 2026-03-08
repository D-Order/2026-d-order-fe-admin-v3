import styled from 'styled-components';

export const Wrapper = styled.div<{ $visible: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 380px;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;

export const Label = styled.div<{ $error: boolean; $success: boolean }>`
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ $error, $success, theme }) =>
    $error
      ? theme.colors.Error
      : $success
        ? theme.colors.Success
        : theme.colors.Focused};
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input<{ $error: boolean; $success: boolean }>`
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ theme }) => theme.colors.Black01};
  width: 100%;
  min-width: 8rem;
  box-sizing: border-box;
  padding: 1rem;
  padding-right: 2.25rem;
  border: 1px solid
    ${({ $error, $success, theme }) =>
      $error
        ? theme.colors.Error
        : $success
          ? theme.colors.Success
          : 'rgba(192, 192, 192, 0.50)'};

  border-radius: 25px;

  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }

  -webkit-appearance: none;
  appearance: none;

  &::placeholder {
    ${({ theme }) => theme.fonts.SemiBold16};
    color: ${({ theme }) => theme.colors.Focused};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background-color: #f5f5f5;
  }
`;

export const Message = styled.div<{ $error: boolean }>`
  ${({ theme }) => theme.fonts.SemiBold14};
  color: ${({ $error, theme }) =>
    $error ? theme.colors.Error : theme.colors.Success};
`;

export const Helper = styled.div`
  ${({ theme }) => theme.fonts.SemiBold14};
  color: ${({ theme }) => theme.colors.Focused};
`;

export const Icon = styled.img`
  position: absolute;
  right: 12px;
  width: 24px;
  cursor: pointer;
  pointer-events: auto;
`;

export const Icon2 = styled.img`
  position: absolute;
  right: 48px;
  width: 24px;
  cursor: pointer;
  pointer-events: auto;
`;
