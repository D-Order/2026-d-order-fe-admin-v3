/**
 * WebSocket URL 생성 유틸
 *
 * 로컬 개발 환경 문제:
 *   - vite cookieDomainRewrite로 인해 쿠키가 localhost 도메인으로 저장됨
 *   - WS가 wss://dev.dorder-api.shop 으로 직접 연결하면 localhost 쿠키를 안 보냄 → 인증 실패
 *   - 해결: 로컬에서는 wss://localhost:port 로 연결 → vite proxy(/ws)가 백엔드로 포워딩
 *           → proxy가 localhost 쿠키를 그대로 백엔드에 전달 → 인증 성공
 *
 * 프로덕션:
 *   - VITE_WS_URL(wss://prod.dorder-api.shop) 로 직접 연결
 *   - 쿠키 Domain=.dorder-api.shop → admin.dorder-api.shop과 같은 도메인 → 정상 전달
 */
export function getWsUrl(path: string): string {
  if (import.meta.env.DEV) {
    // 로컬: vite proxy 경유 (wss://localhost:5173/ws/...)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${path}`;
  }
  // 프로덕션: VITE_WS_URL 직접 사용
  const base = (import.meta.env.VITE_WS_URL ?? '').toString().replace(/\/+$/, '');
  return base ? `${base}${path}` : '';
}
