import { instatnceWithImg } from './instance';

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
  // 메뉴 등록
  createMenu: async (formData: FormData): Promise<MenuRegistResponse> => {
    try {
      const response = await instatnceWithImg.post<MenuRegistResponse>(
        '/api/v3/django/booth/menus/',
        formData,
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        message: '메뉴 등록에 실패했습니다.',
        code: 500,
        data: null,
      };
    }
  },

  // 메뉴 수정
  updateMenu: async (
    menu_id: number,
    formData: FormData,
  ): Promise<MenuRegistResponse> => {
    try {
      const response = await instatnceWithImg.patch<MenuRegistResponse>(
        `/api/v3/django/booth/menus/${menu_id}/`,
        formData,
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        message: '메뉴 수정에 실패했습니다.',
        code: 500,
        data: null,
      };
    }
  },

  // 세트메뉴 등록
  createSetMenu: async (formData: FormData): Promise<MenuRegistResponse> => {
    try {
      const response = await instatnceWithImg.post<MenuRegistResponse>(
        '/api/v3/django/booth/sets/',
        formData,
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        message: '세트 메뉴 등록에 실패했습니다.',
        code: 500,
        data: null,
      };
    }
  },

  // 세트메뉴 수정
  updateSetMenu: async (
    set_menu_id: number,
    formData: FormData,
  ): Promise<MenuRegistResponse> => {
    try {
      const response = await instatnceWithImg.patch<MenuRegistResponse>(
        `/api/v3/django/booth/sets/${set_menu_id}/`,
        formData,
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        message: '세트 메뉴 수정에 실패했습니다.',
        code: 500,
        data: null,
      };
    }
  },

  // 세트메뉴 생성
  createSettMenu: async (payload: {
    name: string;
    description: string;
    price: number | string;
    set_items: { menu_id: number; quantity: number }[];
  }): Promise<void> => {
    try {
      await instatnceWithImg.post(`/api/v3/django/booth/sets/`, payload);
    } catch (error) {
      throw error;
    }
  },

  // 세트메뉴 수정(JSON)
  editSetMenu: async (
    id: number,
    payload: {
      name: string;
      description: string;
      price: number | string;
      set_items: { menu_id: number; quantity: number }[];
    },
  ): Promise<void> => {
    try {
      await instatnceWithImg.patch(`/api/v3/django/booth/sets/${id}/`, payload);
    } catch (error) {
      throw error;
    }
  },

  // 세트메뉴 삭제
  deleteSetMenu: async (id: number): Promise<void> => {
    try {
      await instatnceWithImg.delete(`/api/v3/django/booth/sets/${id}/`);
    } catch (error) {
      throw error;
    }
  },
};

export default MenuServiceWithImg;
