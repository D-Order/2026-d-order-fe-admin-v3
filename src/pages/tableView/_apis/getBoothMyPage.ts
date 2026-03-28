// tableView/_apis/getBoothMyPage.ts
import { instance } from "@services/instance";

export type BoothMyPageData = {
    name: string;
    table_max_cnt: number;
    bank: string;
    account: number;
    depositor: string;
    seat_type: string;
    seat_fee_person: number;
    seat_fee_table: number;
    table_limit_hours: string | null; 
};

export type BoothMyPageResponse = {
    message: string;
    data: BoothMyPageData;
};

export const getBoothMyPage = async (): Promise<BoothMyPageData> => {
    const res = await instance.get<BoothMyPageResponse>("/api/v3/django/booth/mypage/");
    return res.data.data;
};