// src/pages/Dashboard/_hooks/useStatisticsWSLite.ts
import { useEffect, useRef } from "react";
import type { DashboardData } from "../_services/dashboard.types";

const TYPE_INIT = "INIT_STATISTICS";
const TYPE_PATCH = "STATISTICS_UPDATED";
const TYPE_ERROR = "ERROR";

type InitMsg = { type: typeof TYPE_INIT; data: DashboardData };
type PatchMsg = { type: typeof TYPE_PATCH; data: Partial<DashboardData> };
type ErrMsg = { type: typeof TYPE_ERROR; code: number; message: string };
type WsMsg = InitMsg | PatchMsg | ErrMsg | any;

function toWebSocketOrigin(raw: string): string {
  const b = raw.trim().replace(/\/+$/, "");
  if (!b) return "";
  if (b.startsWith("wss://") || b.startsWith("ws://")) return b;
  if (b.startsWith("https://")) return b.replace("https://", "wss://");
  if (b.startsWith("http://")) return b.replace("http://", "ws://");
  return "";
}

export default function useStatisticsWSLite({
  onInit,
  onPatch,
  onError,
}: {
  onInit: (full: DashboardData) => void;
  onPatch: (patch: Partial<DashboardData>) => void;
  onError?: (code: number, message: string) => void;
}) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("[WS STAT] accessToken 없음");
      return;
    }

    const base = toWebSocketOrigin(import.meta.env.VITE_WS_URL || "");
    if (!base) {
      console.error("[WS STAT] VITE_WS_URL 비어있거나 유효한 WS 오리진이 아님");
      return;
    }

    const url = `${base}/ws/statistics/?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      // 연결되자마자 REFRESH 요청
      ws.send(JSON.stringify({ type: "REFRESH" }));
    };

    ws.onmessage = (ev) => {
      try {
        const msg: WsMsg = JSON.parse(ev.data);
        if (msg?.type === TYPE_INIT) {
          onInit(msg.data);
        } else if (msg?.type === TYPE_PATCH) {
          onPatch(msg.data);
        } else if (msg?.type === TYPE_ERROR) {
          onError?.(msg.code, msg.message);
        }
      } catch {
        // PONG 등 non-JSON 무시
      }
    };

    ws.onerror = (e) => {
      console.error("[WS STAT] ERROR", e);
    };

    ws.onclose = (ev) => {
      wsRef.current = null;
      // 비정상 종료만 재연결 시도
      if (![1000, 1001].includes(ev.code)) {
        setTimeout(() => {
          // 단순 새로고침 필요 → 훅 다시 마운트 되며 재연결됨
        }, 2000);
      }
    };

    return () => {
      try {
        ws.close(1000, "unmount");
      } catch {}
      wsRef.current = null;
    };
  }, []);
}
