import { instanceV2 } from "../../../services/instance";
import { OrderStatus } from "../types";

/**
 * 부스에 등록된 메뉴 이름 목록을 조회하는 API
 * @returns 메뉴 이름 배열
 */
export const getMenuNames = async (): Promise<string[]> => {
  try {
    const response = await instanceV2.get<{ data: string[] }>(
      "api/v2/booth/menu-names/"
    );
    return response.data.data;
  } catch (error) {
    console.error("드롭다운 메뉴 이름 조회에 실패했습니다:", error);
    return [];
  }
};

/**
 * 주문 상태를 'pending'에서 'cooked'로 변경하는 API 호출
 * @param ordermenuId 상태를 변경할 주문 메뉴 ID
 */
export const updateOrderToCooked = async (
  ordermenuId: number
): Promise<void> => {
  const body = { type: "menu", id: ordermenuId };
  await instanceV2.post("api/v2/booth/kitchen/orders/", body);
};

/**
 * 주문 상태를 'cooked'에서 'served'로 변경하는 API 호출
 * @param ordermenuId 상태를 변경할 주문 메뉴 ID
 */
export const updateOrderToServed = async (
  ordermenuId: number
): Promise<void> => {
  const body = { type: "menu", id: ordermenuId };
  await instanceV2.post("api/v2/booth/serving/orders/", body);
};

/**
 * 주문 상태를 되돌리는 API 호출
 * @param ordermenuId 상태를 변경할 주문 메뉴 ID
 * @param targetStatus 변경하려는 목표 상태 (cooked 또는 pending)
 */
export const revertOrderStatus = async (
  ordermenuId: number,
  targetStatus: OrderStatus
): Promise<void> => {
  const body = { id: ordermenuId, target_status: targetStatus };
  await instanceV2.patch("api/v2/booth/revert/orders/", body);
};
