// tableView/_hooks/useTableDetail.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getTableDetail,
  type TableDetailData,
} from "../_apis/getTableDetail";
import {
  updateOrderQuantity as apiCancelItems,
  type CancelBatchItem,
  type CancelOrderResponse,
} from "../_apis/updateOrderQuantity";

type Status = "idle" | "loading" | "success" | "error";

export const useTableDetail = (tableNum: number) => {
  const [detail, setDetail] = useState<TableDetailData | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!tableNum) return;
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await getTableDetail(tableNum);
      if (!res || !res.data) {
        throw new Error("테이블 상세 데이터가 비어 있습니다.");
      }
      setDetail(res.data);
      setStatus("success");
    } catch (e: any) {
      setErrorMsg(e?.message ?? "테이블 상세 조회 중 오류가 발생했습니다.");
      setStatus("error");
    }
  }, [tableNum]);

  useEffect(() => {
    if (Number.isFinite(tableNum)) fetchDetail();
  }, [fetchDetail, tableNum]);

  const cancelItems = useCallback(
    async (batches: CancelBatchItem[]): Promise<CancelOrderResponse> => {
      const res = await apiCancelItems(batches);

      if (res?.status === "success" || res?.message === "success") {
        // 새 명세에서는 응답에 개별 아이템 ID가 없으므로,
        // 로컬 데이터를 직접 조작하기보다는 재조회(refetch)를 통해
        // 서버의 최신 데이터를 동기화하는 것이 가장 안전합니다.
        await fetchDetail();
      }

      return res;
    },
    [fetchDetail]
  );

  const hasOrders = useMemo(() => (detail?.orders?.length ?? 0) > 0, [detail]);

  return {
    detail,
    loading: status === "loading",
    errorMsg,
    hasOrders,
    refetch: fetchDetail,
    cancelItems,
  };
};