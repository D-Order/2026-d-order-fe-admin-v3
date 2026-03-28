// tableView/_components/tableGrid.tsx
import { useMemo, useState, useEffect, useCallback } from "react";
import * as S from "./tableComponents.styled";
import { useSwipeable } from "react-swipeable";
import TableCard from "./tableCard";
import { TableItem } from "../_apis/getTableList";
import { getBoothMyPage } from "../_apis/getBoothMyPage"; // 🌟 새 API 임포트

interface Props {
  tableList: TableItem[];
  onSelectTable: (table: TableItem) => void;
}

// 🌟 CardData에서 isOverdue를 제거하고 startedAt을 추가 (오버듀 계산은 Card 내부에서 실시간으로 처리)
export interface TableOrder {
  tableNumber: number;
  totalAmount: number;
  orders: { menu: string; quantity: number }[];
  startedAt: string | null; 
}

const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const ITEMS_PER_PAGE = 15;

const TableViewGrid: React.FC<Props> = ({ tableList, onSelectTable }) => {
  // 🌟 부스의 이용 시간 제한 (시간 단위, ex: 2.00 -> 2)
  const [limitHours, setLimitHours] = useState<number | null>(null);

  useEffect(() => {
    const fetchBoothInfo = async () => {
      try {
        const data = await getBoothMyPage();
        if (data.table_limit_hours) {
          setLimitHours(parseFloat(data.table_limit_hours));
        }
      } catch (e) {
        console.error("부스 정보 조회 실패:", e);
      }
    };
    fetchBoothInfo();
  }, []);

  const mapped = useMemo(
    () =>
      tableList.map((item) => {
        const viewData: TableOrder = {
          tableNumber: item.tableNum,
          totalAmount: item.amount,
          orders: (item.latestOrders ?? []).map((o) => ({
            menu: o.name,
            quantity: o.qty,
          })),
          startedAt: item.startedAt, // 🌟 입장 시간 매핑
        };
        return { original: item, viewData };
      }),
    [tableList]
  );

  const pages = useMemo(() => chunk(mapped, ITEMS_PER_PAGE), [mapped]);
  const pageCount = Math.max(1, pages.length);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((prev) => {
      const next = prev >= pageCount ? pageCount - 1 : prev;
      return next;
    });
  }, [pageCount]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPage((p) => (p === 0 ? pageCount - 1 : p - 1));
      if (e.key === "ArrowRight") setPage((p) => (p === pageCount - 1 ? 0 : p + 1));
    },
    [pageCount]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const gotoPrev = () => setPage((p) => (p === 0 ? pageCount - 1 : p - 1));
  const gotoNext = () => setPage((p) => (p === pageCount - 1 ? 0 : p + 1));

  const handlers = useSwipeable({
    onSwipedLeft: gotoNext,
    onSwipedRight: gotoPrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <S.GridWrapper {...handlers}>
      <S.GridViewport>
        <S.PagesTrack $pageCount={pageCount} $currentPage={page}>
          {pages.map((items, idx) => (
            <S.PageGrid key={idx} $pageCount={pageCount}>
              {items.map(({ original, viewData }) => (
                <div key={original.tableNum}>
                  <TableCard 
                    data={viewData} 
                    limitHours={limitHours} // 🌟 Card에 제한 시간 전달
                    onSelect={() => onSelectTable(original)} 
                  />
                </div>
              ))}
            </S.PageGrid>
          ))}
        </S.PagesTrack>
      </S.GridViewport>

      <S.PageIndicatorWrapper>
        {Array.from({ length: pageCount }).map((_, i) => (
          <S.Dot key={i} $active={page === i} onClick={() => setPage(i)} />
        ))}
      </S.PageIndicatorWrapper>
    </S.GridWrapper>
  );
};

export default TableViewGrid;