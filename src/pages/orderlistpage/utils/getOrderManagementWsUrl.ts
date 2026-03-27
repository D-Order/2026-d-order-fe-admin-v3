/**
 * Order 관리 WebSocket URL 생성
 * Path: /ws/django/booth/orders/management/ (OpenAPI에 적힌 /api/.../booth/order/management/ 는 HTTP용일 수 있음)
 * - 쿠키 기반 인증 (브라우저 동일 조건에서 세션 쿠키 전송)
 * - VITE_BASE_URL 또는 VITE_WS_URL (https → wss 자동 변환)
 */

const WS_PATH = '/ws/django/booth/orders/management/';

/** http(s) 또는 이미 ws(s)인 베이스를 WebSocket 스킴으로 통일 */
function toWebSocketOrigin(base: string): string {
  const b = base.replace(/\/+$/, '');
  if (!b) return '';
  if (b.startsWith('wss://') || b.startsWith('ws://')) return b;
  if (b.startsWith('https://')) return b.replace('https://', 'wss://');
  if (b.startsWith('http://')) return b.replace('http://', 'ws://');
  return '';
}

function getWsBaseUrl(): string {
  const wsEnv = (import.meta.env.VITE_WS_URL ?? '').toString().trim();
  if (wsEnv) {
    const normalized = toWebSocketOrigin(wsEnv);
    if (normalized) return normalized;
  }

  const httpBase = (import.meta.env.VITE_BASE_URL ?? '').toString().replace(/\/+$/, '');
  return toWebSocketOrigin(httpBase);
}

export function getOrderManagementWsUrl(): string {
  const base = getWsBaseUrl();
  if (!base) return '';
  return `${base}${WS_PATH}`;
}
