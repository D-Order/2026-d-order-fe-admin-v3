// tableView/_components/detailPage/tableDetail.tsx
import * as S from "./tableDetail.styled";
import ACCO from "@assets/images/character.svg";
import { IMAGE_CONSTANTS } from "@constants/imageConstants";
import CancelMenuModal from "../../_modal/CancelMenuModal";
import CancelConfirmModal from "../../_modal/CancelConfirmModal";
import ResetModal from "../../_modal/ResetModal";
import EmptyOrder from "./emptyOrder";
import CancelErrorModal from "../../_modal/CancelErrorModal";
import { instance } from "@services/instance";

import {
  getTableDetail,
  type TableDetailData,
} from "../../_apis/getTableDetail";
import { resetTable as resetTableAPI } from "../../_apis/resetTable";
import { cancelOrderItem } from "../../_apis/cancelOrderItem"; // ⬅️ 새 API 반영

import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  data: TableDetailData;
  onBack?: () => void;
}

const API_ORIGIN = (() => {
  const fromInstance = (instance as any)?.defaults?.baseURL as
    | string
    | undefined;
  const raw = fromInstance || import.meta.env.VITE_BASE_URL || "";
  try {
    return new URL(raw).origin;
  } catch {
    return (raw || "").replace(/\/+$/, "");
  }
})();

const toImageUrl = (p?: string | null): string | null => {
  if (!p) return null;
  const val = String(p).trim();
  if (!val) return null;
  if (/^https?:\/\//i.test(val)) return val;
  if (/^\/\//.test(val)) return `https:${val}`;
  if (val.startsWith("/")) return `${API_ORIGIN}${val}`;
  return `${API_ORIGIN}/${val}`;
};

const TableDetail: React.FC<Props> = ({ data, onBack }) => {
  const navigate = useNavigate();

  // 선택한 메뉴의 정보 (취소를 위해 id 필수)
  const [selectedMenu, setSelectedMenu] = useState<{
    id: number;
    name: string;
    quantity: number;
  } | null>(null);

  const [confirmInfo, setConfirmInfo] = useState<{
    id: number;
    name: string;
    cancelQuantity: number;
    maxQuantity: number;
  } | null>(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [tableDetailData, setTableDetailData] = useState<TableDetailData>(data);
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);

  // 원가 합계 계산 (단가 * 수량)
  const originalTotal = useMemo(() => {
    try {
      return (tableDetailData.orders ?? []).reduce((sum, o) => {
        const unit = Number(o.price) || 0;
        const qty = Number(o.quantity) || 0;
        return sum + unit * qty;
      }, 0);
    } catch {
      return 0;
    }
  }, [tableDetailData.orders]);

  // 부동소수 오차 방지를 위해 반올림 비교
  const hasDiscount = useMemo(() => {
    return (
      Math.round(originalTotal) !== Math.round(tableDetailData.table_amount ?? 0)
    );
  }, [originalTotal, tableDetailData.table_amount]);

  const refetchTableDetail = useCallback(async () => {
    try {
      const response = await getTableDetail(tableDetailData.table_num);
      setTableDetailData(response.data);
    } catch {
      // noop
    }
  }, [tableDetailData.table_num]);

  return (
    <>
      <S.DetailWrapper>
        <S.DetailHeader>
          <S.TextWrapper>
            <S.BackButton
              onClick={() => (onBack ? onBack() : navigate("/table-view"))}
            >
              <img src={IMAGE_CONSTANTS.BACKWARD_BLACK} alt="뒤로가기버튼" />
            </S.BackButton>
            <p className="tableNumber">테이블 {tableDetailData.table_num} |</p>
            <p>상세 주문 내역</p>
          </S.TextWrapper>

          <S.TableReset onClick={() => setShowResetModal(true)}>
            <img src={IMAGE_CONSTANTS.RELOADWHITE} alt="초기화 버튼" />
            테이블 초기화
          </S.TableReset>
        </S.DetailHeader>

        <S.DivideLine />

        <S.TotalPrice>
          <p>💸총 주문금액</p>
          {hasDiscount && (
            <>
              <p className="original">
                <del>{originalTotal.toLocaleString()}원</del>
              </p>
            </>
          )}
          <p className="total">
            {tableDetailData.table_amount.toLocaleString()}원
          </p>
        </S.TotalPrice>

        <S.MenuList>
          {tableDetailData.orders.length === 0 ? (
            <EmptyOrder />
          ) : (
            tableDetailData.orders.map((order, idx) => (
              <div key={order.id ?? `no-id-${idx}`}>
                <S.ItemWrapper>
                  <S.ContentContainer>
                    <S.ImageWrapper>
                      <img
                        src={toImageUrl(order.menu_image) ?? ACCO}
                        alt={order.menu_name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = ACCO;
                        }}
                      />
                    </S.ImageWrapper>
                    <S.TitleWrapper>
                      <p className="menuName">{order.menu_name}</p>
                      <S.GrayText>
                        <p>수량 : {order.quantity}</p>
                        <p>가격 : {order.price.toLocaleString()}원</p>
                      </S.GrayText>
                    </S.TitleWrapper>
                  </S.ContentContainer>
                  <S.ButtonWrapper>
                    <S.CancleButton
                      onClick={() => {
                        // 🚨 백엔드에서 id를 안 내려줬을 때 방어 코드
                        if (!order.id) {
                          alert("주문 항목 ID가 없습니다. (백엔드 명세 확인 필요)");
                          return;
                        }
                        setSelectedMenu({
                          id: order.id,
                          name: order.menu_name,
                          quantity: order.quantity,
                        });
                      }}
                    >
                      <img src={IMAGE_CONSTANTS.Delete} alt="삭제" />
                      주문 취소
                    </S.CancleButton>
                  </S.ButtonWrapper>
                </S.ItemWrapper>
                <S.DivideLine />
              </div>
            ))
          )}
        </S.MenuList>
      </S.DetailWrapper>

      {/* 수량 선택 모달 */}
      {selectedMenu && (
        <CancelMenuModal
          menuName={selectedMenu.name}
          initialQuantity={selectedMenu.quantity}
          onClose={() => setSelectedMenu(null)}
          onConfirmRequest={(q) => {
            setSelectedMenu(null);
            setConfirmInfo({
              id: selectedMenu.id,
              name: selectedMenu.name,
              maxQuantity: selectedMenu.quantity,
              cancelQuantity: q,
            });
          }}
        />
      )}

      {/* 확인 모달 */}
      {confirmInfo && (
        <CancelConfirmModal
          cancelCount={confirmInfo.cancelQuantity}
          totalCountBefore={confirmInfo.maxQuantity}
          onConfirm={async () => {
            try {
              // ⬅️ 새 API 요청 (단일 항목 ID, 취소 수량)
              await cancelOrderItem(confirmInfo.id, confirmInfo.cancelQuantity);
              setConfirmInfo(null);
              await refetchTableDetail(); // 성공 시 데이터 갱신
            } catch (e: any) {
              setConfirmInfo(null);
              setErrorModalMsg(e.message || "주문 취소 중 오류가 발생했습니다.");
            }
          }}
          onCancel={() => {
            setConfirmInfo(null);
          }}
        />
      )}

      {/* 초기화 모달 */}
      {showResetModal && (
        <ResetModal
          resetTable={async () => {
            try {
              await resetTableAPI([tableDetailData.table_num]); 
              setShowResetModal(false);
              await refetchTableDetail(); 
            } catch (e: any) {
              console.error("테이블 초기화 실패:", e);
              alert(e.message || "테이블 초기화에 실패했습니다.");
              setShowResetModal(false);
            }
          }}
          onCancel={() => setShowResetModal(false)}
        />
      )}

      {/* 에러 모달 */}
      {errorModalMsg && (
        <CancelErrorModal
          message={errorModalMsg}
          onClose={() => setErrorModalMsg(null)}
        />
      )}
    </>
  );
};

export default TableDetail;