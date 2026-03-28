// src/components/toast/Toast.styled.ts
import styled, { keyframes } from "styled-components";

// 3초간 나타났다가 서서히 사라지는 애니메이션
const fadeAnimation = keyframes`
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
`;

export const ToastWrapper = styled.div`
    /* 지정해주신 절대 위치 (고정) */
    position: fixed;
    top: 3.75rem;
    left: 26.5625rem;
    z-index: 9999; /* 다른 요소들보다 무조건 위에 오도록 */

    /* 지정해주신 Flex 및 Layout 스타일 */
    display: inline-flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    box-sizing: border-box;

    /* Hug 처리 (최소 크기 보장 및 컨텐츠에 맞게 늘어남) */
    width: fit-content;
    min-width: 10.875rem;
    min-height: 3.25rem;

    /* 디자인 요소 */
    border-radius: 8px;
    background: var(--Main-Orange-Orange_01, #FF6E3F);
    
    /* 텍스트 스타일 (테마 연동) */
    color: #FFF;
    ${({ theme }) => theme.fonts.Bold14}; /* 텍스트 크기는 임의로 지정했습니다 */

    /* 애니메이션 및 기타 설정 */
    animation: ${fadeAnimation} 3s ease-in-out forwards;
    pointer-events: none; /* 팝업이 떠있는 동안 뒤에 있는 요소를 클릭할 수 있게 함 */
`;