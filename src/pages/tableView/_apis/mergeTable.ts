// src/pages/tableView/_apis/mergeTable.ts
import { instance } from "@services/instance";

export type MergeTableResponse = {
    message: string;
    data: {
        representive_table_num: number;
        merge_table_cnt: number;
    };
};

export const mergeTable = async (tableNums: number[]): Promise<MergeTableResponse> => {
    if (!Array.isArray(tableNums) || tableNums.length < 2) {
        throw new Error("병합할 테이블을 2개 이상 선택해주세요.");
    }

    try {
        const res = await instance.post<MergeTableResponse>(
        "/api/v3/django/booth/tables/merge/",
        { table_nums: tableNums }
        );
        return res.data;
    } catch (e: any) {
        const msg =
        e?.response?.data?.message ||
        e?.message ||
        "테이블 병합에 실패했습니다.";
        throw new Error(msg);
    }
};