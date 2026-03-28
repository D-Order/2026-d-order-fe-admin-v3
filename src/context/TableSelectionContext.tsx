// 테이블 체크박스 선택 -> 사이드바 반영을 위한 전역상태관리
import React, { createContext, useState, useContext } from 'react';

interface TableSelectionContextType {
    selectedTables: number[];
    toggleTableSelection: (tableNum: number) => void;
    clearSelection: () => void;
}

const TableSelectionContext = createContext<TableSelectionContextType | null>(null);

export const TableSelectionProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedTables, setSelectedTables] = useState<number[]>([]);

    // 체크박스 클릭 시 추가/삭제 토글
    const toggleTableSelection = (tableNum: number) => {
        setSelectedTables((prev) =>
        prev.includes(tableNum) ? prev.filter((num) => num !== tableNum) : [...prev, tableNum]
        );
    };

    const clearSelection = () => setSelectedTables([]);

    return (
        <TableSelectionContext.Provider value={{ selectedTables, toggleTableSelection, clearSelection }}>
        {children}
        </TableSelectionContext.Provider>
    );
};

export const useTableSelection = () => {
    const context = useContext(TableSelectionContext);
    if (!context) throw new Error('Provider 필요!');
    return context;
};