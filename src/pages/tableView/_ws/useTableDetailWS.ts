// tableView/_ws/useTableDetailWS.ts
import { useEffect, useRef } from "react";
import { TableWSPayload } from "./types";

interface UseTableDetailWSOptions {
    tableNum: number;
    onConnectionEstablished?: (data: any) => void;
    // 상세뷰에서 필요한 추가 이벤트(예: order_update) 콜백 등록
    onOrderUpdate?: (data: any) => void; 
}

const WS_BASE_URL = (import.meta.env.VITE_BASE_URL || "")
    .replace(/^http/, "ws")
    .replace(/\/$/, "");

export const useTableDetailWS = ({ tableNum, ...options }: UseTableDetailWSOptions) => {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!tableNum) return;

        let isMounted = true;
        
        const wsUrl = `${WS_BASE_URL}/ws/django/tables/${tableNum}/`;
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
        console.log(`[WS:TableDetail-${tableNum}] 연결됨`);
        };

        socket.onmessage = (event) => {
        if (!isMounted) return;
        try {
            const payload: TableWSPayload = JSON.parse(event.data);
            console.debug(`[WS:TableDetail-${tableNum}] 수신:`, payload);

            switch (payload.type) {
            case "connection_established":
                options.onConnectionEstablished?.(payload.data);
                break;
            case "order_update":
                options.onOrderUpdate?.(payload.data);
                break;
            default:
                break;
            }
        } catch (error) {
            console.error(`[WS:TableDetail-${tableNum}] 파싱 에러:`, error);
        }
        };

        socket.onclose = (event) => {
        console.log(`[WS:TableDetail-${tableNum}] 연결 종료:`, event.code);
        };

        return () => {
        isMounted = false;
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        };
    }, [tableNum]); 

    return { socket: wsRef.current };
};