import { AxiosResponse } from "axios";
import { instance } from "./instance";
import {
  BoothMenuData,
  Menu,
  SetMenu,
  TableInfo,
} from "../pages/menu/Type/Menu_type";
import { MenuRegistResponse } from "./MenuServiceWithImg";

// v3 GET /api/v3/django/booth/menu-list/ 응답 타입
export type MenuListCategoryV3 = "FEE" | "MENU" | "DRINK" | "SET";

export interface MenuListItemV3 {
  id: number | string;
  name: string;
  price: number;
  category: MenuListCategoryV3;
  description?: string | null;
  image: string | null;
  stock: number;
  is_soldout: boolean;
  is_fixed: boolean;
}

export interface MenuListResponseV3 {
  message: string;
  booth_id: number;
  data: MenuListItemV3[];
}

function mapV3MenuListToBoothMenuData(
  res: MenuListResponseV3
): BoothMenuData {
  const { booth_id, data } = res;
  const table: TableInfo = {
    seat_type: "테이블 이용료 없음",
    seat_tax_person: 0,
    seat_tax_table: 0,
  };
  const menus: Menu[] = [];
  const setmenus: SetMenu[] = [];

  for (const item of data) {
    const idNum = typeof item.id === "string" ? parseInt(item.id, 10) : item.id;

    if (item.category === "FEE" && item.is_fixed) {
      table.seat_type = "person";
      table.seat_tax_person = item.price;
      table.seat_tax_table = 0;
      continue;
    }

    if (item.category === "MENU" || item.category === "DRINK") {
      const menuCategory =
        item.category === "MENU" ? "메인" : "음료";
      menus.push({
        menu_id: idNum,
        booth_id,
        menu_name: item.name,
        menu_description: item.description ?? "",
        menu_category: menuCategory,
        menu_price: item.price,
        menu_amount: item.stock,
        menu_image: item.image ?? "",
        is_sold_out: item.is_soldout,
      });
      continue;
    }

    if (item.category === "SET") {
      setmenus.push({
        set_menu_id: idNum,
        booth_id,
        set_category: "SET",
        set_name: item.name,
        set_description: item.description ?? "",
        set_image: item.image ?? "",
        set_price: item.price,
        origin_price: item.price,
        is_sold_out: item.is_soldout,
        menu_items: [],
      });
    }
  }

  return { booth_id, table, menus, setmenus };
}

interface CreateMenuResponse {
  data: Menu;
}

const MenuService = {
  // 메뉴 리스트 조회 (v3 운영자 메뉴 목록 API)
  getMenuList: async (): Promise<BoothMenuData> => {
    try {
      const response =
        await instance.get<MenuListResponseV3>(
          "/api/v3/django/booth/menu-list/"
        );
      return mapV3MenuListToBoothMenuData(response.data);
    } catch (error) {
      throw error;
    }
  },

  // 메뉴 생성
  createMenu: async (formData: FormData): Promise<Menu> => {
    try {
      const response: AxiosResponse<CreateMenuResponse> = await instance.post(
        "/api/v2/booth/menus/",
        formData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // 메뉴 수정
  updateMenu: async (id: number, formData: FormData): Promise<Menu> => {
    try {
      const response: AxiosResponse<{ data: Menu }> = await instance.put(
        `/api/v2/booth/menus/${id}/`,
        formData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // 메뉴 삭제
  deleteMenu: async (id: number) => {
    try {
      await instance.delete(`/api/v2/booth/menus/${id}/`);
    } catch (error) {
      throw error;
    }
  },

  // 세트메뉴생성
  createSettMenu: async (payload: {
    set_name: string;
    set_description: string;
    set_price: number | string;
    menu_items: { menu_id: number; quantity: number }[];
  }): Promise<void> => {
    try {
      await instance.post(`/api/v2/booth/setmenus/`, payload);
    } catch (error) {
      throw error;
    }
  },

  // 세트메뉴 수정
  editSetMenu: async (
    set_menu_id: number,
    formData: FormData
  ): Promise<MenuRegistResponse> => {
    try {
      const response = await instance.patch<MenuRegistResponse>(
        `/api/v2/booth/setmenus/${set_menu_id}/`,
        formData
      );
      return response.data;
    } catch (error) {
      return {
        status: "error",
        message: "세트 메뉴 수정에 실패했습니다.",
        code: 500,
        data: null,
      };
    }
  },

  deleteSetMenu: async (id: number): Promise<void> => {
    try {
      await instance.delete(`/api/v2/booth/setmenus/${id}/`);
    } catch (error) {
      throw error;
    }
  },
};

export default MenuService;
