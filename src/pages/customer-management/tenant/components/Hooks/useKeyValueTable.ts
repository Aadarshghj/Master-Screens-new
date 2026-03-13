import { useCallback, useState } from "react";

export interface KeyValueTableRow {
  id: string;
  key: string;
  value: string;
}

export const useKeyValueTable = () => {
  const [tableData, setTableData] = useState<KeyValueTableRow[]>([]);

  const addRow = useCallback(() => {
    setTableData(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        key: "",
        value: "",
      },
    ]);
  }, []);

  const removeLastRow = useCallback(() => {
    setTableData(prev => prev.slice(0, -1));
  }, []);

  const updateCell = useCallback(
    (rowIndex: number, field: "key" | "value", value: string) => {
      setTableData(prev =>
        prev.map((row, index) =>
          index === rowIndex ? { ...row, [field]: value } : row
        )
      );
    },
    []
  );

   const resetTable = useCallback(() => {
    setTableData([]);
  }, []);

  return {
    tableData,
    addRow,
    removeLastRow,
    updateCell,
    resetTable
  };
};