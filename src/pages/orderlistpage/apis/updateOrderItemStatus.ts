import { instance } from '@services/instance';

const PATH = '/api/v3/django/order/status/';

export type UpdateOrderItemStatusBody = {
  order_item_id: number;
  target_status: 'cooking' | 'cooked' | 'served';
};

export type UpdateOrderItemStatusResponse = {
  message?: string;
  data?: {
    order_item_id: number;
    status: string;
    all_items_served?: boolean;
    served_at?: string;
  };
};

export async function updateOrderItemStatus(
  body: UpdateOrderItemStatusBody,
): Promise<UpdateOrderItemStatusResponse> {
  const { data } = await instance.patch<UpdateOrderItemStatusResponse>(
    PATH,
    body,
  );
  return data ?? {};
}
