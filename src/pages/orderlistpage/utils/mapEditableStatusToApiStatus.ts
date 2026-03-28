import type { EditableStatus } from '../compoenents/StatusChangeModal/StatusChangeModal.types';

/** API `target_status` — cooking | cooked | served */
export type OrderItemTargetStatus = 'cooking' | 'cooked' | 'served';

export function mapEditableStatusToApiStatus(
  status: EditableStatus,
): OrderItemTargetStatus {
  switch (status) {
    case '조리중':
      return 'cooking';
    case '조리완료':
      return 'cooked';
    case '서빙완료':
      return 'served';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
