// tableView/TableViewPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TableViewGrid from "./_components/tableGrid";
import * as S from "./TableViewPage.styled";
import { useTableList } from "./_hooks/useTableList";
import { TableItem } from "./_apis/getTableList";
import { buildTableDetailPath } from "@constants/routeConstants";
import { LoadingSpinner } from "./_apis/loadingSpinner"; // ✅ 스피너 가져오기
import Toast from "@components/ToastMessage/Toast"; 

const TableViewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [resetToastMsg, setResetToastMsg] = useState<string>("");    const { tables: tableList, loading, error /*, refetch */ } = useTableList();

    const handleSelectTable = (table: TableItem) => {
        navigate(buildTableDetailPath(table.tableNum));
    };
    useEffect(() => {
    // 상세 페이지에서 넘어온 초기화 토스트 메시지가 있는지 확인
    if (location.state?.resetToastMessage) {
        setResetToastMsg(location.state.resetToastMessage);
        
        // 토스트 메시지를 화면에 띄운 후, 브라우저 히스토리 state를 비워서 
        // 새로고침 했을 때 토스트가 다시 뜨지 않도록 방지
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);
    if (loading) {
        // ✅ 로딩 중에는 스피너 사용
        return (
        <S.PageWrapper aria-busy="true" aria-live="polite" role="status">
            <LoadingSpinner />
        </S.PageWrapper>
        );
    }

    if (error) {
        return (
        <S.PageWrapper>
            <div style={{ padding: 24 }}>에러 발생: {error}</div>
        </S.PageWrapper>
        );
    }

    return (
        <S.PageWrapper>
            <TableViewGrid tableList={tableList} onSelectTable={handleSelectTable} />
            <Toast 
                message={resetToastMsg} 
                isVisible={!!resetToastMsg} 
                onClose={() => setResetToastMsg("")} 
            />
        </S.PageWrapper>
    );
};

export default TableViewPage;
