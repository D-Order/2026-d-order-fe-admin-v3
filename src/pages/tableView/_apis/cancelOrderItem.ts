// tableView/_apis/cancelOrderItem.ts
import { instance } from "@services/instance";

// ── 새 취소 API 스펙 (응답 타입) ──
export type CancelOrderResponse = {
  message: string;
  data: {
    order_item_id: number;
    remaining_quantity: number;
    refund_amount: number;
    new_item_total_price: number;
    new_total_sales: number;
  };
};

/**
 * 주문 항목 부분/전체 취소 API
 * @param orderItemId 취소할 주문 항목의 PK (세트메뉴의 경우 부모의 PK)
 * @param cancelQuantity 취소할 수량
 */
export const cancelOrderItem = async (
  orderItemId: number,
  cancelQuantity: number
): Promise<CancelOrderResponse> => {
  if (!orderItemId) {
    throw new Error("취소할 주문 항목의 ID가 필요합니다.");
  }
  if (!Number.isFinite(cancelQuantity) || cancelQuantity <= 0) {
    throw new Error("취소 수량은 1 이상이어야 합니다.");
  }

  try {
    const res = await instance.patch<CancelOrderResponse>(
      `/api/v3/django/order/${orderItemId}/cancel/`,
      { cancel_quantity: cancelQuantity }
    );
    return res.data;
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ||
      (e?.response?.status === 400 ? "취소 수량이 잘못되었습니다." : null) ||
      (e?.response?.status === 404 ? "해당 주문 항목을 찾을 수 없습니다." : null) ||
      e?.message ||
      "주문 취소에 실패했습니다.";
    throw new Error(msg);
  }
};