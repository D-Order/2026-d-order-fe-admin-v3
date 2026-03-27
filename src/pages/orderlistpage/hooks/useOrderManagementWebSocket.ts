import { useEffect, useRef, useState } from 'react';
import type { OrderBoxData } from '../compoenents/orderbox/OrderBox';
import { getOrderManagementWsUrl } from '../utils/getOrderManagementWsUrl';
import { mapSnapshotToOrderBoxData } from '../utils/mapSnapshotToOrderBoxData';
import { applyNewOrder } from '../utils/applyNewOrder';
import { applyOrderUpdate } from '../utils/applyOrderUpdate';
import { applyOrderCompleted } from '../utils/applyOrderCompleted';
import { applyOrderCancelled } from '../utils/applyOrderCancelled';
import {
  isAdminOrderSnapshotMessage,
  isAdminNewOrderMessage,
  isAdminOrderUpdateMessage,
  isAdminOrderCompletedMessage,
  isAdminOrderCancelledMessage,
  isMenuAggregationMessage,
} from '../types/orderManagementWs';

const AUTH_FAILURE_CLOSE_CODE = 4001;

export type MenuAggregationCallback = (
  food: { menuName: string; quantity: number }[],
  beverage: { menuName: string; quantity: number }[]
) => void;

export function useOrderManagementWebSocket(
  setOrders: (orders: OrderBoxData[] | ((prev: OrderBoxData[]) => OrderBoxData[])) => void,
  onMenuAggregation?: MenuAggregationCallback
) {
  const wsRef = useRef<WebSocket | null>(null);
  const setOrdersRef = useRef(setOrders);
  setOrdersRef.current = setOrders;
  const onMenuAggregationRef = useRef(onMenuAggregation);
  onMenuAggregationRef.current = onMenuAggregation;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const url = getOrderManagementWsUrl();
    if (!url) {
      console.warn('[OrderManagementWS] WS URL 없음 (VITE_WS_URL 또는 VITE_BASE_URL 확인)');
      return;
    }

    console.log('[OrderManagementWS] 연결 시도:', url);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('[OrderManagementWS] 연결됨');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        const type = (msg && typeof msg.type === 'string' && msg.type) || '(unknown)';
        console.log('[OrderManagementWS] 수신:', type, msg);
        if (isAdminOrderSnapshotMessage(msg)) {
          const next = mapSnapshotToOrderBoxData(msg.data.orders);
          setOrdersRef.current(next);
        } else if (isAdminNewOrderMessage(msg)) {
          setOrdersRef.current((prev) => applyNewOrder(prev, msg.data));
        } else if (isAdminOrderUpdateMessage(msg)) {
          setOrdersRef.current((prev) => applyOrderUpdate(prev, msg.data));
        } else if (isAdminOrderCompletedMessage(msg)) {
          setOrdersRef.current((prev) => applyOrderCompleted(prev, msg.data));
        } else if (isAdminOrderCancelledMessage(msg)) {
          setOrdersRef.current((prev) => applyOrderCancelled(prev, msg.data));
        } else if (isMenuAggregationMessage(msg) && onMenuAggregationRef.current) {
          const food = (msg.data.food_summary ?? []).map((row) => ({
            menuName: row.menu_name ?? '',
            quantity: Number(row.total_quantity) || 0,
          }));
          const beverage = (msg.data.beverage_summary ?? []).map((row) => ({
            menuName: row.menu_name ?? '',
            quantity: Number(row.total_quantity) || 0,
          }));
          onMenuAggregationRef.current(food, beverage);
        }
      } catch {
        // non-JSON 등 무시
      }
    };

    ws.onerror = () => {
      // 1006 등 close 상세는 onclose에서 처리
      console.warn('[OrderManagementWS] 연결 오류 (상세는 onclose code 확인)');
    };

    ws.onclose = (e) => {
      wsRef.current = null;
      setIsConnected(false);
      console.log('[OrderManagementWS] 연결 종료', e.code, e.reason || '(없음)');
      if (e.code === AUTH_FAILURE_CLOSE_CODE) {
        window.location.href = '/login';
        return;
      }
      if (e.code === 1006) {
        console.warn(
          '[OrderManagementWS] 1006 Abnormal Closure — 연결이 정상 종료되지 않았습니다. 확인할 것: ' +
            '1) 현재 페이지와 WS 도메인이 같아서 쿠키가 전송되는지, ' +
            '2) 서버가 해당 경로에서 WebSocket Upgrade를 지원하는지, ' +
            '3) 프록시/로드밸런서 WS 설정, ' +
            '4) SSL 인증서 유효 여부. ' +
            'Network 탭에서 해당 WS 요청 선택 후 Headers/Response 확인 권장.'
        );
      }
    };

    return () => {
      try {
        ws.close(1000, 'unmount');
      } catch {}
      wsRef.current = null;
      setIsConnected(false);
    };
  }, []);

  return { isConnected };
}
