// tableView/_components/tableCard.tsx
import * as S from './tableComponents.styled';
import { TABLEPAGE_CONSTANTS } from '../_constants/tableConstants';
import ACCO from "@assets/images/character.svg";
import { useState, useEffect, useCallback } from 'react';
import { useTableSelection } from '../../../context/TableSelectionContext';
import { TableOrder } from './tableGrid';

interface Props {
  data: TableOrder;
  limitHours: number | null; // 🌟 그리드에서 넘겨준 제한 시간
  onSelect?: () => void;
}

const TableCard: React.FC<Props> = ({ data, limitHours, onSelect }) => {
  const { selectedTables, toggleTableSelection } = useTableSelection();
  const isSelected = selectedTables.includes(data.tableNumber); 
  const formattedTableNum = `T ${String(data.tableNumber).padStart(2, '0')}`;
  
  // 상태: 경과 시간 문자열(hh:mm) 및 시간 초과 여부
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");
  const [isOverdue, setIsOverdue] = useState<boolean>(false);
  
  // 🌟 입장 시간 기반으로 경과 시간 및 초과 여부 계산 로직
  const checkTimeAndStatus = useCallback(() => {
    if (!data.startedAt) {
      setElapsedTime("00:00");
      setIsOverdue(false);
      return;
    }

    const orderDate = new Date(data.startedAt);
    const currentDate = new Date();

    if (isNaN(orderDate.getTime())) return;

    const diffInMs = currentDate.getTime() - orderDate.getTime();
    if (diffInMs <= 0) {
      setElapsedTime("00:00");
      setIsOverdue(false);
      return;
    }

    const totalMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const hh = isNaN(hours) ? "00" : String(hours).padStart(2, '0');
    const mm = isNaN(minutes) ? "00" : String(minutes).padStart(2, '0');

    setElapsedTime(`${hh}:${mm}`);

    // 초과 여부 판단 (limitHours가 설정되어 있고, 경과된 총 분이 제한 분(limitHours * 60)보다 크거나 같으면 초과)
    if (limitHours && limitHours > 0) {
      setIsOverdue(totalMinutes >= limitHours * 60);
    } else {
      setIsOverdue(false);
    }
  }, [data.startedAt, limitHours]);

  // 실시간 업데이트 (1분마다 계산)
  useEffect(() => {
    checkTimeAndStatus(); // 초기 계산

    const timer = setInterval(() => {
      checkTimeAndStatus();
    }, 60000);

    return () => clearInterval(timer);
  }, [checkTimeAndStatus]);
  
  const handleCheckboxChange = () => {
    toggleTableSelection(data.tableNumber);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    
    // 🌟 주문이 없더라도 빈 테이블이 아닌 경우(입장 시간이 있는 경우)는 상세조회 진입 허용 가능
    // 기존: if(data.orders.length === 0) return;
    // 변경: IN_USE(입장시간 있음)인데 메뉴만 없는 경우 처리
    if (!data.startedAt && data.orders.length === 0) {
      alert("주문 내역이 없는 빈 테이블입니다.");
      return;
    }
    if (onSelect) onSelect();
  };

  return (
    <S.CardWrapper 
      $isOverdue={isOverdue} // 🌟 자체 계산된 상태 사용
      $isSelected={isSelected}
      onClick={handleCardClick}
    >
      <S.TableInfo $isOverdue={isOverdue}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={handleCheckboxChange} 
            onClick={(e) => e.stopPropagation()} 
          />
          <p className="tableNumber">{formattedTableNum}</p>
        </div>
        {/* 입장 시간(startedAt)이 있으면 시간 표시 */}
        <p className="orderTime">{data.startedAt ? elapsedTime : "00:00"}</p>
      </S.TableInfo>
      
      <S.DivideLine />
      <S.MenuContainer>
        <S.MenuList>
          {data.orders.length === 0 && (
            <S.EmptyImage src={ACCO} alt="빈 테이블" />
          )}

          {data.orders.slice(0, 3).map((order, idx) => (
            <S.ItemRow key={idx}>
              <S.MenuItem>
                <p className="menuName">{order.menu}</p>
                <p className="menuAmount">{order.quantity}</p>
              </S.MenuItem>
              <img
                src={TABLEPAGE_CONSTANTS.TABLE.IMAGE.MENU_LINE}
                alt="구분선"
              />
            </S.ItemRow>
          ))}
        </S.MenuList>
        {data.orders.length > 0 && <S.ToDetail>더보기</S.ToDetail>}
      </S.MenuContainer>

      <S.TotalPrice>
        <p className="totalPrice">총 금액 {data.totalAmount.toLocaleString()}원</p>
      </S.TotalPrice>
    </S.CardWrapper>
  );
};

export default TableCard;