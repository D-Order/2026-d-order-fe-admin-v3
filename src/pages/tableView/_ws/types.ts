// tableView/_ws/types.ts

// ── 공통 응답 구조 ──
export interface BaseWSPayload {
    type: string;
    timestamp: string;
    message?: string;
}

// ── 이벤트별 데이터 타입 ──
export interface WsConnectionEstablished extends BaseWSPayload {
    type: "connection_established";
    data: { booth_id?: number };
}

export interface WsMergeTable extends BaseWSPayload {
    type: "merge_table";
    data: {
        table_nums: number[];
        representative_table: number;
        count: number;
    };
}

export interface WsResetTable extends BaseWSPayload {
    type: "reset_table";
    data: {
        table_nums: number[];
        count: number;
    };
}

export interface WsEnterTable extends BaseWSPayload {
    type: "enter_table";
    data: {
        table_num: number;
        started_at: string;
    };
}

export interface WsOrderUpdate extends BaseWSPayload {
    type: "order_update";
    data: any; // 명세 확정 시 구체화 필요
}

export interface WsError extends BaseWSPayload {
    type: "ERROR";
    data: {
        code: string;
        message: string;
    };
}

// 전체 유니온 타입
export type TableWSPayload =
    | WsConnectionEstablished
    | WsMergeTable
    | WsResetTable
    | WsEnterTable
    | WsOrderUpdate
    | WsError;