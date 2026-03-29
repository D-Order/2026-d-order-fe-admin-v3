// tableView/_ws/useTablesWS.ts
import { useEffect, useRef } from "react";
import { TableWSPayload } from "./types";

interface UseTablesWSOptions {
    onConnectionEstablished?: (data: any) => void;
    onMergeTable?: (data: any) => void;
    onResetTable?: (data: any) => void;
    onEnterTable?: (data: any) => void;
    onOrderUpdate?: (data: any) => void;
    onError?: (data: any) => void;
}

const WS_BASE_URL = (import.meta.env.VITE_BASE_URL || "")
  .replace(/^http/, "ws") // http(s)를 ws(s)로 변환
  .replace(/\/$/, "");    // 맨 뒤 슬래시 제거

export const useTablesWS = (options: UseTablesWSOptions = {}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        let isMounted = true;

        const connect = () => {
        const wsUrl = `${WS_BASE_URL}/ws/django/booth/tables/`;
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
            console.log("[WS:Tables] 연결됨");
        };

        socket.onmessage = (event) => {
            if (!isMounted) return;
            try {
            const payload: TableWSPayload = JSON.parse(event.data);
            console.debug("[WS:Tables] 수신:", payload);

            switch (payload.type) {
                case "connection_established":
                options.onConnectionEstablished?.(payload.data);
                break;
                case "merge_table":
                options.onMergeTable?.(payload.data);
                break;
                case "reset_table":
                options.onResetTable?.(payload.data);
                break;
                case "enter_table":
                options.onEnterTable?.(payload.data);
                break;
                case "order_update":
                options.onOrderUpdate?.(payload.data);
                break;
                case "ERROR":
                console.error("[WS:Tables] 서버 에러:", payload.data);
                options.onError?.(payload.data);
                // SERVER_ERROR 시 즉시 재연결 로직 등 추가 가능
                break;
                default:
                console.warn("[WS:Tables] 알 수 없는 타입:", payload);
            }
            } catch (error) {
            console.error("[WS:Tables] 메시지 파싱 에러:", error);
            }
        };

        socket.onclose = (event) => {
            console.log("[WS:Tables] 연결 종료:", event.code);
            // 4001(인증 실패)가 아니면 3초 후 자동 재연결 시도
            if (isMounted && event.code !== 4001) {
            reconnectTimeoutRef.current = window.setTimeout(connect, 3000);
            }
        };

        socket.onerror = (error) => {
            console.error("[WS:Tables] 소켓 에러:", error);
        };
        };

        connect();

        return () => {
        isMounted = false;
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        };
    }, []); // 의존성 배열 비움 (마운트 시 1회 연결)

    return { socket: wsRef.current };
};