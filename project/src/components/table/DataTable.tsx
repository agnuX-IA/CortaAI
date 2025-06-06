import React from 'react';

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  noDataMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  isLoading = false,
  noDataMessage = 'Nenhum dado encontrado',
}) => {
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-lg shadow-md bg-gray-800">
        <div className="p-6 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-r-transparent" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full overflow-hidden rounded-lg shadow-md bg-gray-800">
        <div className="p-8 text-center text-gray-400">
          {noDataMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-md">
      <table className="w-full">
        <thead className="bg-gray-700">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-700 transition-colors">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                  {column.cell 
                    ? column.cell(row[column.accessor], row) 
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;