// tableView/_components/tableGrid.tsx
import { useMemo, useState, useEffect, useCallback } from "react";
import * as S from "./tableComponents.styled";
import { useSwipeable } from "react-swipeable";
import TableCard from "./tableCard";
import { TableItem } from "../_apis/getTableList";
import { useTableStatus } from "../_hooks/useTableStatus";

interface Props {
  tableList: TableItem[];
  onSelectTable: (table: TableItem) => void;
}

interface TableOrder {
  tableNumber: number;
  totalAmount: number;
  orderedAt: string;
  orders: { menu: string; quantity: number }[];
  isOverdue: boolean; // websocket expired
}

const TAG = "%c[TableGrid]";
const TAG_STYLE = "background:#555;color:#fff;padding:2px 6px;border-radius:4px";

const formatTime = (iso: string | null) => {
  if (!iso) return "주문 없음";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "주문 없음";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const ITEMS_PER_PAGE = 15;

const TableViewGrid: React.FC<Props> = ({ tableList, onSelectTable }) => {
  const { expiredMap } = useTableStatus();

  const mapped = useMemo(
    () =>
      tableList.map((item) => {
        const viewData: TableOrder = {
          tableNumber: item.tableNum,
          totalAmount: item.amount,
          orderedAt: formatTime(item.createdAt),
          orders: (item.latestOrders ?? []).map((o) => ({
            menu: o.name,
            quantity: o.qty,
          })),
          isOverdue: !!expiredMap[item.tableNum],
        };
        return { original: item, viewData };
      }),
    [tableList, expiredMap]
  );

  const pages = useMemo(() => {
    const p = chunk(mapped, ITEMS_PER_PAGE);
    console.debug(TAG, TAG_STYLE, "페이지 재계산", {
      totalTables: mapped.length,
      itemsPerPage: ITEMS_PER_PAGE,
      pageCount: p.length,
    });
    return p;
  }, [mapped]);

  const pageCount = Math.max(1, pages.length);
  const [page, setPage] = useState(0);

  // 페이지 개수 변동 시 현재 페이지 보정
  useEffect(() => {
    setPage((prev) => {
      const next = prev >= pageCount ? pageCount - 1 : prev;
      if (prev !== next) {
        console.debug(TAG, TAG_STYLE, "페이지 보정", { prev, next, pageCount });
      }
      return next;
    });
  }, [pageCount]);

  // 키보드 네비게이션
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setPage((p) => (p === 0 ? pageCount - 1 : p - 1));
      }
      if (e.key === "ArrowRight") {
        setPage((p) => (p === pageCount - 1 ? 0 : p + 1));
      }
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

  // expiredMap 변화 디버깅
  useEffect(() => {
    const expiredTrue = Object.entries(expiredMap)
      .filter(([, v]) => v)
      .map(([k]) => k);
    console.debug(TAG, TAG_STYLE, "expiredMap 변경", {
      size: Object.keys(expiredMap).length,
      expiredTrue,
    });
  }, [expiredMap]);

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
