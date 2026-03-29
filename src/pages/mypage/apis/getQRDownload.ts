// mypage/apis/getQRDownload.ts
import axios, { AxiosError } from "axios";
import { instance } from "@services/instance"; // ✅ 전역 인스턴스 사용

/** QR 조회 응답 인터페이스 */
export interface QrResponseData {
    qr_image_url: string;
}

export interface ApiEnvelope<T> {
    message: string;
    data: T | null;
}

export interface ApiErrorBody {
    detail?: string;
    message?: string;
}

function normalizeAndThrow(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ApiErrorBody>;
        const status = err.response?.status ?? 0;
        const body = err.response?.data;

        const msg =
        body?.detail ||
        body?.message ||
        (status === 401
            ? "자격 인증 데이터가 제공되지 않았습니다."
            : status === 404
            ? "QR 코드를 찾을 수 없습니다."
            : "QR 코드 조회 중 오류가 발생했습니다.");

        console.error(`[QR][${status}]`, msg);
        throw new Error(msg);
    }
    
    console.error("[QR] 알 수 없는 오류", error);
    throw new Error("QR 코드 처리 중 오류가 발생했습니다.");
}

/** 1) QR 이미지 URL 조회 API 호출 */
export async function getManagerQRUrl(): Promise<string> {
    try {
        const res = await instance.get<ApiEnvelope<QrResponseData>>(
        "/api/v3/django/booth/mypage/qr-download"
        );
        
        const url = res.data.data?.qr_image_url;
        if (!url) {
        throw new Error("QR 코드 URL이 존재하지 않습니다.");
        }
        return url;
    } catch (e) {
        normalizeAndThrow(e);
    }
}

export async function downloadManagerQR(filename = "booth-qr.png"): Promise<void> {
    try {
        // 1. URL 받아오기
        const qrUrl = await getManagerQRUrl();

        // 2. 해당 URL에서 이미지 Blob 가져오기 (CORS 문제가 없다면 fetch 사용)
        const imageRes = await fetch(qrUrl);
        if (!imageRes.ok) throw new Error("이미지를 가져오는 데 실패했습니다.");
        
        const blob = await imageRes.blob();
        const objectUrl = window.URL.createObjectURL(blob);

        // 3. 브라우저 다운로드 트리거
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(objectUrl);

        console.info("[QR] 다운로드 완료:", filename);
    } catch (e: any) {
        console.error("[QR] 다운로드 실패", e);
        // URL을 직접 여는 폴백(Fallback) 처리 - CORS 이슈로 fetch가 막힐 경우 새 창에서 열기
        if (e.message === "이미지를 가져오는 데 실패했습니다." || e.name === "TypeError") {
        getManagerQRUrl().then(url => {
            window.open(url, "_blank");
        }).catch(console.error);
        } else {
        throw e;
        }
    }
}