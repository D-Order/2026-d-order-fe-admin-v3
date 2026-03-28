// tableView/_apis/resetTable.ts
import { instance } from "@services/instance";

export type ResetTableResponse = {
  message: string;
  data: {
    reset_table_cnt: number;
  };
};


export const resetTable = async (tableNums: number[]): Promise<ResetTableResponse> => {
  if (!Array.isArray(tableNums) || tableNums.length === 0) {
    throw new Error("초기화할 테이블 번호가 필요합니다.");
  }

  try {
    const res = await instance.post<ResetTableResponse>(
      "/api/v3/django/booth/tables/reset",
      { table_nums: tableNums } // ⬅️ 명세에 맞게 바디 전송
    );
    return res.data;
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ||
      (Array.isArray(e?.response?.data) && typeof e.response.data[0] === "string" 
        ? e.response.data[0] 
        : null) ||
      e?.message ||
      "테이블 리셋에 실패했습니다.";
    throw new Error(msg);
  }
};