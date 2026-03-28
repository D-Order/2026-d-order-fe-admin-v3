// tableView/_modal/CancelErrorModal.tsx
import styled, { css } from "styled-components";

interface Props {
    onClose: () => void;
    message?: string; // 부모 컴포넌트에서 받은 에러 메시지 렌더링
}

const CancelErrorModal: React.FC<Props> = ({ onClose, message }) => {
    return (
        <Overlay>
        <Modal>
            <TextWrapper>
            <p>주문 취소에 실패했습니다.</p>
            {/* 전달받은 에러 메시지가 있으면 노출합니다. */}
            {message && <p className="grayText">{message}</p>}
            </TextWrapper>
            <ButtonRow>
            <ButtonSingle onClick={onClose}>
                <button>확인</button>
            </ButtonSingle>
            </ButtonRow>
        </Modal>
        </Overlay>
    );
};

export default CancelErrorModal;


const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const Modal = styled.div`
    position: fixed;
    top: 30%;
    min-width: 24rem;
    min-height: 8rem;
    background: white;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
`;

const TextWrapper = styled.div`
    width: 100%;
    padding: 2.2rem 0 2rem;
    gap: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.Black02};
    ${({ theme }) => css(theme.fonts.Bold20)};
    .grayText {
        line-height: 23px;
        color: ${({ theme }) => theme.colors.Black02};
        ${({ theme }) => css(theme.fonts.SemiBold14)};
    }
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-height: 3.5rem;
    pointer: cursor;

`;

const ButtonSingle = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    button {
        color: ${({ theme }) => theme.colors.Orange01};
        ${({ theme }) => css(theme.fonts.Bold18)};
        pointer: cursor;
    }
`;
