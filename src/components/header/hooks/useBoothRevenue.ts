// src/components/Header/hooks/useBoothRevenue.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import BoothService from '@services/BoothService';

const useBoothRevenue = () => {
  const [boothName, setBoothName] = useState<string>('부스 로딩 중...');
  const [totalRevenues, setTotalRevenues] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const shouldReconnect = () =>
    document.visibilityState === 'visible' && navigator.onLine;

  const closeSocket = useCallback(() => {
    clearRetryTimer();
    const ws = wsRef.current;
    if (
      ws &&
      (ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING)
    ) {
      try {
        ws.close();
      } catch {}
    }
    wsRef.current = null;
  }, []);

  const connect = useCallback(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('로그인이 필요합니다.');
      return;
    }
    if (!shouldReconnect()) return;

    const curr = wsRef.current;
    if (
      curr &&
      (curr.readyState === WebSocket.OPEN ||
        curr.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const wsUrl = `wss://api.test-d-order.store/ws/revenue/?token=${accessToken}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setError(null);
      retryCountRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (
          message?.type === 'REVENUE_SNAPSHOT' ||
          message?.type === 'REVENUE_UPDATE'
        ) {
          const next = Number(message.totalRevenue) || 0;
          setTotalRevenues(next);
        }
      } catch (e) {
        console.error('🔴 [REVENUE] 메시지 파싱 오류:', e);
      }
    };

    ws.onerror = () => {
      setError('매출 실시간 업데이트 중 오류가 발생했습니다.');
    };

    ws.onclose = () => {
      if (shouldReconnect()) {
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 15000); // 1s → 15s
        retryCountRef.current += 1;
        clearRetryTimer();
        retryTimerRef.current = window.setTimeout(() => {
          connect();
        }, delay) as unknown as number;
      }
    };
  }, []);

  useEffect(() => {
    let aborted = false;

    const fetchBoothName = async () => {
      const boothId =
        localStorage.getItem('Booth-ID') ?? localStorage.getItem('boothId');
      if (!boothId) {
        setError('부스 정보가 없습니다.');
        return;
      }
      try {
        const response = await BoothService.getBoothName(boothId);
        if (aborted) return;
        if (response?.data?.booth_name) {
          setError(null);
          setBoothName(response.data.booth_name);
        } else {
          setError(response?.message ?? '부스 정보를 가져오지 못했습니다.');
        }
      } catch {
        if (!aborted) setError('부스 정보를 가져오지 못했습니다.');
      }
    };

    fetchBoothName();

    const handleVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchBoothName();
      }
    };
    document.addEventListener('visibilitychange', handleVisible);

    return () => {
      aborted = true;
      document.removeEventListener('visibilitychange', handleVisible);
    };
  }, []);

  useEffect(() => {
    connect();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        connect();
      } else {
        closeSocket();
      }
    };
    const handleOnline = () => connect();
    const handleOffline = () => closeSocket();

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearRetryTimer();
      closeSocket();
    };
  }, [connect, closeSocket]);

  return { boothName, totalRevenues, error };
};

export default useBoothRevenue;
