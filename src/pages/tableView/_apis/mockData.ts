// tableView/_apis/mockData.ts
import { TableItem, LatestOrder } from "./getTableList";
import { TableDetailData, OrderDetail } from "./getTableDetail";

const MENU_POOL = [
    { name: "근우가 만든 호떡", price: 18000 },
    { name: "동건이가 튀긴 감자튀김", price: 19000 },
    { name: "은호의 닭발", price: 12000 },
    { name: "선우의 콜라", price: 8000 },
    { name: "수빈이가 잡은 방어회", price: 4500 },
    { name: "영채가 구운 스팸", price: 2000 },
    { name: "아이디어고갈", price: 15000 },
];

// 40개의 테이블 데이터 생성
export const MOCK_TABLE_LIST: TableItem[] = Array.from({ length: 40 }, (_, i) => {
    const tableNum = i + 1;
    const menuCount = Math.floor(Math.random() * 4) + 2; // 2~5개
    const selectedMenus = [...MENU_POOL].sort(() => 0.5 - Math.random()).slice(0, menuCount);
    
    const latestOrders: LatestOrder[] = selectedMenus.map(m => ({
        name: m.name,
        qty: Math.floor(Math.random() * 3) + 1,
        price: m.price
    }));

    const amount = latestOrders.reduce((sum, cur) => sum + (cur.price! * cur.qty), 0);
    const isActivate = Math.random() > 0.3; // 70% 확률로 이용 중

    return {
        tableNum,
        amount: isActivate ? amount : 0,
        status: isActivate ? "activate" : "out",
        createdAt: isActivate ? new Date().toISOString() : null,
        latestOrders: isActivate ? latestOrders.slice(0, 3) : [],
    };
});

// 특정 테이블의 상세 데이터 생성 함수
export const getMockTableDetail = (tableNum: number): TableDetailData => {
    const tableInfo = MOCK_TABLE_LIST.find(t => t.tableNum === tableNum);
    const menuCount = Math.floor(Math.random() * 4) + 2; // 2~5개
    
    const orders: OrderDetail[] = Array.from({ length: menuCount }, (_, i) => {
        const menu = MENU_POOL[Math.floor(Math.random() * MENU_POOL.length)];
        return {
        menu_image: null,
        menu_name: menu.name,
        price: menu.price,
        quantity: Math.floor(Math.random() * 3) + 1,
        order_id: 1000 + i,
        order_item_id: 2000 + i,
        type: "menu"
        };
    });

    const totalAmount = orders.reduce((sum, cur) => sum + (cur.price * cur.quantity), 0);

    return {
        table_num: tableNum,
        table_amount: tableInfo?.status === "activate" ? totalAmount : 0,
        table_status: tableInfo?.status || "out",
        created_at: tableInfo?.createdAt || null,
        orders: tableInfo?.status === "activate" ? orders : [],
    };
};