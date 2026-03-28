import styled from "styled-components";

export const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    width: 87%;
    margin-top: 2.25rem;
    margin-left: 3.0625rem;
    background-color: ${({ theme }) => theme.colors.Bg};
`;

export const Title = styled.div`
    ${({ theme }) => theme.fonts.ExtraBold20};
    color: ${({ theme }) => theme.colors.Black01};
    font-size: 1.25rem;
    font-weight: 800;
    font-style: normal;
    line-height: normal;
    margin-bottom: 2.1875rem;
`;

export const Input = styled.input`
    border-radius: 0.375rem;
    max-width: 5rem;
    ${({ theme }) => theme.fonts.Bold16};
    background-color: ${({ theme }) => theme.colors.Orange00};
    color: ${({ theme }) => theme.colors.Black01};
    font-size: 1rem;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
    border: none;
    outline: none;

    &:focus {
        border: none;
        outline: none;
    }
`;

export const AccountInput = styled.input`
    border-radius: 0.375rem;
    max-width: 10rem;
    ${({ theme }) => theme.fonts.Bold16};
    background-color: ${({ theme }) => theme.colors.Bg};
    color: ${({ theme }) => theme.colors.Black01};
    font-size: 1rem;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
    border: none;
    outline: none;

    &:focus {
        border: none;
        outline: none;
    }
`;

export const NameInput = styled.input`
    padding: 0.5rem 0;
    border-radius: 0.375rem;
    min-width: 8rem;
    max-width: 300px;
    ${({ theme }) => theme.fonts.Bold16};
    background-color: ${({ theme }) => theme.colors.Bg};
    color: ${({ theme }) => theme.colors.Black01};
    font-size: 1rem;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
    border: none;
    outline: none;

    &:focus {
        border: none;
        outline: none;
    }
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    border: 0.0625rem solid rgba(192, 192, 192, 0.50);
    border-radius: 0.625rem;
`;

export const Row = styled.section`
    display: flex;
    flex-direction: column;
`

export const InfoRowComponent = styled.div`
    display: flex;
    margin: 1.6875rem 0.75rem;
`;

export const label = styled.div`
    display: flex;
    width: 9rem;
`

export const Value = styled.div`
    ${({ theme }) => theme.fonts.Bold16};
    color: ${({ theme }) => theme.colors.Black01};
    font-size: 1rem;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
    flex: 1;
`;

export const FeeTag = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.Orange00};
    color: ${({ theme }) => theme.colors.Orange01};
    ${({ theme }) => theme.fonts.Bold16};
    width: 4.625rem;
    height: 1.75rem;
    font-weight: 700;
    border-radius: 0.3125rem;
    margin-right: 0.625rem;
`;

export const BanckContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: ${({ theme }) => theme.colors.Orange00};
    color: ${({ theme }) => theme.colors.Orange01};
    min-width: 5.813rem;
    height: 1.75rem;
    font-weight: 700;
    width: fit-content; 
    white-space: nowrap;
    padding: 3px 9px;
    border-radius: 5px;
`;

export const DropdownWrapper = styled.div`
    position: absolute;
    top: 100%; 
    left: 0;
    width: 10.188rem;
    z-index: 99;
    border-radius: 5px;
`;

export const DropButton = styled.button`
    display: flex;
    align-items: center;
    cursor: pointer;
`;

export const Drop = styled.img`
    display: flex;
    width: 0.938rem;
    height: 0.938rem;
`;

export const BankTag = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.Orange00};
    color: ${({ theme }) => theme.colors.Orange01};
    ${({ theme }) => theme.fonts.Bold16};
    min-width: 4.625rem;
    height: 1.75rem;
    font-weight: 700;
    border-radius: 0.3125rem;
    padding: 3px 8px;
`;

export const ColorSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.Orange00};
    color: ${({ theme }) => theme.colors.Orange01};
    ${({ theme }) => theme.fonts.Bold16};
    width: fit-content;
    height: 1.75rem;
    font-weight: 700;
    border-radius: 0.3125rem;
    padding: 3px 0.8rem;
`;

export const OwnerTag = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(192, 192, 192, 0.30);
    color: ${({ theme }) => theme.colors.Focused};
    ${({ theme }) => theme.fonts.Bold16};
    width: fit-content;
    height: 1.75rem;
    font-weight: 700;
    border-radius: 0.3125rem;
    padding: 3px 0.8rem;
    width: fit-content;
`;

export const ButtonGroup = styled.div`
    display: flex;
    margin-left: auto;
    margin-right: 1.6875rem;
    gap: 0.9375rem;
`;

export const ModifyButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.625rem;
    border: 0.0625rem solid ${({ theme }) => theme.colors.Focused};
    width: 3.375rem;
    height: 2.5rem;

    span {
        color: ${({ theme }) => theme.colors.Focused};
        ${({ theme }) => theme.fonts.SemiBold16};
        font-weight: 600;
        font-style: normal;
    }
`;

export const ConfirmButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.625rem;
    background-color: ${({ theme }) => theme.colors.Orange01};
    width: 3.375rem;
    height: 2.5rem;

    span {
        color: ${({ theme }) => theme.colors.Bg};
        ${({ theme }) => theme.fonts.SemiBold16};
        font-weight: 600;
        font-style: normal;
    }
`;

export const CancelButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.625rem;
    border: 0.0625rem solid ${({ theme }) => theme.colors.Focused};
    width: 3.375rem;
    height: 2.5rem;

    span {
        color: ${({ theme }) => theme.colors.Focused};
        ${({ theme }) => theme.fonts.SemiBold16};
        font-weight: 600;
        font-style: normal;
    }
`;

export const BottomContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    gap: 0.375rem;
    cursor: pointer;

    span {
        color: ${({ theme }) => theme.colors.Focused};
        ${({ theme }) => theme.fonts.Bold14};
    }
`;

export const QrContainer = styled.div`
    display: flex;
    gap: 0.375rem;
`

export const QrImg = styled.img`
    width: 1.125rem;
    aspect-ratio: 1/1;
`;

export const LogoutContainer = styled.div`
    display: flex;
    gap: 0.375rem;
    margin-left: 0.75rem;
    pointer: cursor;
`

export const LogoutImg = styled.img`
    width: 1.125rem;
    aspect-ratio: 1/1;
`;