import { getWsUrl } from '@utils/getWsUrl';

const WS_PATH = '/ws/django/booth/orders/management/';

export function getOrderManagementWsUrl(): string {
  return getWsUrl(WS_PATH);
}
