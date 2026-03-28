import { CouponService, postNewCouponRequest } from "@services/CouponService";
import { useCouponList } from "./useCouponList";

export const useCreateCoupon = () => {
  const { refetch } = useCouponList();

  // V3 응답 형식이 { data: { coupon: {...} } }로 변경되어 반환값 미사용
  const create = async (data: postNewCouponRequest): Promise<void> => {
    await CouponService.postNewCoupon(data);
    await refetch();
  };

  return { create };
};
