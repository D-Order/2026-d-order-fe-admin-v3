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
  getOrderWsErrorInfo,
} from '../types/orderManagementWs';

const AUTH_FAILURE_CLOSE_CODE = 4001;
/** JWT/세션 없음 (Django AdminOrderManagementConsumer._authenticate) */
const NO_BOOTH_CLOSE_CODE = 4003;

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

    /** StrictMode 이중 effect 시 CONNECTING 상태에서 close() 하면 브라우저 경고가 남 — 언마운트면 open 직후에만 닫음 */
    let aborted = false;

    ws.onopen = () => {
      if (aborted) {
        try {
          ws.close(1000, 'unmount');
        } catch {
          /* noop */
        }
        return;
      }
      setIsConnected(true);
      console.log('[OrderManagementWS] 연결됨');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        const type = (msg && typeof msg.type === 'string' && msg.type) || '(unknown)';
        console.log('[OrderManagementWS] 수신:', type, msg);
        const errInfo = getOrderWsErrorInfo(msg);
        if (errInfo) {
          console.error('[OrderManagementWS] error payload', errInfo);
          const codeStr = errInfo.code != null ? String(errInfo.code) : '';
          if (
            errInfo.code === 'AUTH_ERROR' ||
            codeStr === '401' ||
            errInfo.code === 401
          ) {
            window.location.href = '/login';
          }
          return;
        }
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
      if (e.code === NO_BOOTH_CLOSE_CODE) {
        console.warn(
          '[OrderManagementWS] close 4003 — 로그인은 되었으나 부스(booth) 미연결. 계정/DB 확인.',
        );
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
      aborted = true;
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.close(1000, 'unmount');
        } catch {
          /* noop */
        }
      }
      // CONNECTING이면 여기서 close() 호출하지 않음 → onopen에서 aborted 보고 종료
      wsRef.current = null;
      setIsConnected(false);
    };
  }, []);

  return { isConnected };
}
