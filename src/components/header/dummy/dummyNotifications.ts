export type NotificationType = '직원 호출' | '송금 확인 요청';

export interface Notification {
  id: number;
  tableNumber: string;
  type: NotificationType;
  createdAt: Date;
  isProcessed: boolean;
}

const now = Date.now();

// API 연결 전 UI 확인용 더미 데이터
// 정렬 기준: 미처리(isProcessed: false) 중 오래된 순 → 처리중(isProcessed: true)
export const dummyNotifications: Notification[] = [
  {
    id: 1,
    tableNumber: 'T 18',
    type: '직원 호출',
    createdAt: new Date(now - 14 * 60 * 1000),
    isProcessed: false,
  },
  {
    id: 9,
    tableNumber: 'T 16',
    type: '직원 호출',
    createdAt: new Date(now - 5 * 60 * 1000),
    isProcessed: false,
  },
  {
    id: 2,
    tableNumber: 'API연결 예정 ',
    type: '송금 확인 요청',
    createdAt: new Date(now - 4 * 60 * 1000),
    isProcessed: false,
  },
  {
    id: 3,
    tableNumber: 'T 03',
    type: '송금 확인 요청',
    createdAt: new Date(now - 2 * 60 * 1000),
    isProcessed: false,
  },
  {
    id: 4,
    tableNumber: 'T 18',
    type: '직원 호출',
    createdAt: new Date(now - 12 * 60 * 1000),
    isProcessed: true,
  },
  {
    id: 5,
    tableNumber: 'T 18',
    type: '송금 확인 요청',
    createdAt: new Date(now - 4 * 60 * 1000),
    isProcessed: true,
  },
];
