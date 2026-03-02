/**
 * Order 관리 WebSocket URL 생성
 * - 쿠키 기반 인증 사용 (credentials 자동 전송)
 * - VITE_BASE_URL 또는 VITE_WS_URL 기반
 */

const WS_PATH = '/ws/django/booth/orders/management/';

function getWsBaseUrl(): string {
  const wsBase = (import.meta.env.VITE_WS_URL ?? '').toString().replace(/\/+$/, '');
  if (wsBase) return wsBase;

  const httpBase = (import.meta.env.VITE_BASE_URL ?? '').toString().replace(/\/+$/, '');
  if (!httpBase) return '';

  if (httpBase.startsWith('https://')) return httpBase.replace('https://', 'wss://');
  if (httpBase.startsWith('http://')) return httpBase.replace('http://', 'ws://');
  return '';
}

export function getOrderManagementWsUrl(): string {
  const base = getWsBaseUrl();
  if (!base) return '';
  return `${base}${WS_PATH}`;
}
