import { instatnceWithImg } from "./instance";

export interface MenuRegistResponse {
  status: string;
  message: string;
  code: number;
  data: {
    booth_id: number;
    menu_name: string;
    menu_category: string;
    menu_price: number;
    menu_amount: number;
    menu_remain: number;
    menu_image: string;
  } | null;
}
const MenuServiceWithImg = {
  createMenu: async (formData: FormData): Promise<MenuRegistResponse> => {
    try {
      const response = await instatnceWithImg.post<MenuRegistResponse>(
        "/api/v3/django/booth/menus/",
        formData
      );

      return response.data;
    } catch (error) {
      return {
        status: "error",
        message: "메뉴 등록에 실패했습니다.",
        code: 500,
        data: null,
      };
    }
  },
  updateMenu: async (
    menu_id: number,
    formData: FormData
  ): Promise<MenuRegistResponse> => {
    try {
      const response = await instatnceWithImg.patch<MenuRegistResponse>(
        `/api/v2/booth/menus/${menu_id}/`,
        formData
      );
      return response.data;
    } catch (error) {
      return {
        status: "error",
        message: "메뉴 수정에 실패했습니다.",
        code: 500,
        data: null,
      };
    }
  },
  createSetMenu: async (formData: FormData): Promise<MenuRegistResponse> => {
    try {
      const response = await instatnceWithImg.post<MenuRegistResponse>(
        "/api/v2/booth/setmenus/",
        formData
      );
      return response.data;
    } catch (error) {
      return {
        status: "error",
        message: "세트 메뉴 등록에 실패했습니다.",
        code: 500,
        data: null,
      };
    }
  },
  updateSetMenu: async (
    set_menu_id: number,
    formData: FormData
  ): Promise<MenuRegistResponse> => {
    try {
      const response = await instatnceWithImg.patch<MenuRegistResponse>(
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
  // 세트메뉴생성
  createSettMenu: async (payload: {
    set_name: string;
    set_description: string;
    set_price: number | string;
    menu_items: { menu_id: number; quantity: number }[];
  }): Promise<void> => {
    try {
      await instatnceWithImg.post(`/api/v2/booth/setmenus/`, payload);
    } catch (error) {
      throw error;
    }
  },

  // 세트메뉴 수정
  editSetMenu: async (
    id: number,
    payload: {
      set_name: string;
      set_description: string;
      set_price: number | string;
      menu_items: { menu_id: number; quantity: number }[];
    }
  ): Promise<void> => {
    try {
      await instatnceWithImg.patch(`/api/v2/booth/setmenus/${id}/`, payload);
    } catch (error) {
      throw error;
    }
  },

  deleteSetMenu: async (id: number): Promise<void> => {
    try {
      await instatnceWithImg.delete(`/api/v2/booth/setmenus/${id}/`);
    } catch (error) {
      throw error;
    }
  },
};

export default MenuServiceWithImg;
