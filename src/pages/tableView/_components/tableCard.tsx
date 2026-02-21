// tableView/_components/tableCard.tsx
import * as S from './tableComponents.styled';
import { TABLEPAGE_CONSTANTS } from '../_constants/tableConstants';
import ACCO from "@assets/images/character.svg";
import { useState, useEffect } from 'react';
import { useTableSelection } from '../../../context/TableSelectionContext';

interface TableCardData {
  tableNumber: number;
  totalAmount: number;
  orderedAt: string;
  orders: {
    menu: string;
    quantity: number;
  }[];
  isOverdue: boolean;
}

interface Props {
  data: TableCardData;
  onSelect?: () => void;
}

const TableCard: React.FC<Props> = ({ data, onSelect }) => {
  const { selectedTables, toggleTableSelection } = useTableSelection();
  const isSelected = selectedTables.includes(data.tableNumber); 
  const formattedTableNum = `T ${String(data.tableNumber).padStart(2, '0')}`;
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");
  
  // 수정필요~!~!~!~!~!~
  // 이용시간 계산 로직
  const calculateElapsedTime = () => {
    // 1. 데이터가 없거나 주문이 없으면 즉시 반환
    if (!data.orderedAt || data.orders.length === 0) return "00:00";

    const orderDate = new Date(data.orderedAt);
    const currentDate = new Date();

    // 2. 유효한 날짜인지 체크 (Invalid Date 방지)
    if (isNaN(orderDate.getTime())) return "00:00";

    const diffInMs = currentDate.getTime() - orderDate.getTime();
    
    // 3. 미래 시간이 찍히는 경우 방어 로직
    if (diffInMs <= 0) return "00:00";

    const totalMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // 4. 숫자가 유효한지 최종 확인 후 포맷팅
    const hh = isNaN(hours) ? "00" : String(hours).padStart(2, '0');
    const mm = isNaN(minutes) ? "00" : String(minutes).padStart(2, '0');

    return `${hh}:${mm}`;
  };

  const handleCheckboxChange = () => {
    toggleTableSelection(data.tableNumber); // 🌟 체크 상태 토글
  };

  // 실시간 업데이트 useEffect
  useEffect(() => {
    // 초기 실행
    setElapsedTime(calculateElapsedTime());

    const timer = setInterval(() => {
      setElapsedTime(calculateElapsedTime());
    }, 60000);

    return () => clearInterval(timer);
  }, [data.orderedAt, data.orders.length]);
  
  //!~!~!~!~!~!~!~!~!!!~!~!
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    
    if (data.orders.length === 0) {
      alert("주문 내역이 없는 테이블입니다.");
      return;
    }
    if (onSelect) onSelect();
  };
  


  return (
    <S.CardWrapper 
      $isOverdue={data.isOverdue} 
      $isSelected={isSelected}
      onClick={handleCardClick}
    >
      <S.TableInfo $isOverdue={data.isOverdue}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={handleCheckboxChange} // 🌟 토글 함수 연결
            onClick={(e) => e.stopPropagation()} 
          />
          <p className="tableNumber">{formattedTableNum}</p>
        </div>
        <p className="orderTime">{data.orders.length > 0 ? elapsedTime : "00:00"}</p>
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