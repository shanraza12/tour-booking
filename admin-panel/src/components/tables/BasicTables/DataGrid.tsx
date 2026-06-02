import React, { useState, useMemo } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

const INITIAL_PAGE_SIZE = 5;

// EXTENDED Column interface
interface Column {
  field: string;
  headerName: string;
  sortable?: boolean;
  filterType?: 'select' | 'text';
  width?: number;                    // NEW
  flex?: number;                     // NEW
  valueFormatter?: (value: any) => string;  // NEW
  renderCell?: (row: any) => React.ReactNode; // NEW — for actions
}

interface DataRecord {
  id: string | number;
  [key: string]: any;
}

interface DataGridProps {
  data?: DataRecord[];
  columns: Column[];
  title?: string;
}

function DataGrid({ data = [], columns, title }: DataGridProps) {
    const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
        key: 'id',
        direction: 'ascending',
    });
    const [filters, setFilters] = useState<Record<string, string>>({});

    // Filtered data — safe fallback to empty array
    const filteredData = useMemo(() => {
        let filtered = data;

        Object.keys(filters).forEach((key) => {
            const filterValue = filters[key]?.trim();
            if (filterValue && filterValue !== '(All)') {
                filtered = filtered.filter((item) =>
                    String(item[key] ?? '').toLowerCase().includes(filterValue.toLowerCase())
                );
            }
        });

        return filtered;
    }, [data, filters]);

    // Sorted data
    const sortedData = useMemo(() => {
        const sortableItems = filteredData?.length > 0 ? [...filteredData] : [];

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? '';
                const bValue = b[sortConfig.key] ?? '';

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return sortableItems;
    }, [filteredData, sortConfig]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === '(All)' ? '' : value,
        }));
        setCurrentPage(1);
    };

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const totalItems = sortedData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return sortedData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, sortedData, pageSize]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const getSortIndicator = (key: string) => {
        if (sortConfig.key !== key) return '';
        return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    };

    const renderFilterInput = (column: Column) => {
        if (column.filterType === 'select') {
            // SAFE: Use data fallback, never call .map on undefined
            const dataArray = Array.isArray(data) ? data : [];  // STRONGER guard

            const uniqueValues = Array.from(
                new Set(
                    dataArray
                        .map((item) => item[column.field])  // NO ?.
                        .filter(Boolean)
                )
            );
            return (
                <div className="relative flex items-center w-full">
                    <select
                        className="w-full text-xs py-1 pr-6 pl-2 border-0 focus:ring-0 focus:border-blue-500 appearance-none bg-transparent"
                        value={filters[column.field] ?? '(All)'}
                        onChange={(e) => handleFilterChange(column.field, e.target.value)}
                    >
                        <option value="(All)">(All)</option>
                        {uniqueValues.map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                    <FaChevronDown className="absolute right-1 text-gray-400 text-xs pointer-events-none" />
                </div>
            );
        }

        // Default: text input
        return (
            <div className="flex items-center w-full border border-gray-300 rounded-sm">
                <FaSearch className="text-gray-400 text-xs ml-2" />
                <input
                    type="text"
                    className="w-full text-xs py-1 px-2 border-0 focus:ring-0"
                    value={filters[column.field] ?? ''}
                    onChange={(e) => handleFilterChange(column.field, e.target.value)}
                />
            </div>
        );
    };

    const renderPaginationControls = () => {
        if (totalPages <= 1) return null;

        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        const pages = [];

        if (start > 1) pages.push(<span key="start-dots" className="px-2">...</span>);

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`h-7 w-7 rounded-md text-sm font-medium ${i === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                >
                    {i}
                </button>
            );
        }

        if (end < totalPages) {
            pages.push(<span key="end-dots" className="px-2">...</span>);
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => goToPage(totalPages)}
                    className={`h-7 w-7 rounded-md text-sm font-medium ${totalPages === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                >
                    {totalPages}
                </button>
            );
        }

        return <div className="flex space-x-1">{pages}</div>;
    };

    return (
        <div className="p-4 shadow-lg rounded-lg border border-gray-200 ">
            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="">
                        <tr>
                            {columns.map((col) => {
                                const style: React.CSSProperties = {};
                                if (col.width) style.width = col.width;
                                if (col.flex) style.flex = col.flex;

                                return (
                                    <th
                                        key={col.field}
                                        style={style}
                                        onClick={() => col.sortable !== false && requestSort(col.field)}
                                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                                            }`}
                                    >
                                        {col.headerName} {getSortIndicator(col.field)}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <thead className="">
                        <tr>
                            {columns.map((col) => (
                                <th key={`filter-${col.field}`} className="p-2">
                                    {renderFilterInput(col)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className=" divide-y divide-gray-200">
                        {currentTableData.length > 0 ? (
                            currentTableData.map((record) => (
                                <tr key={record.id} className="hover:">
                                    {columns.map((col) => {
                                        const cellContent = col.renderCell
                                            ? col.renderCell(record)
                                            : col.valueFormatter
                                                ? col.valueFormatter(record[col.field])
                                                : record[col.field] ?? '';

                                        return (
                                            <td
                                                key={`${record.id}-${col.field}`}
                                                className="px-4 py-2 text-sm text-gray-700"
                                            >
                                                {cellContent}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2 text-sm">
                    {[5, 10, 20, 50].map((size) => (
                        <button
                            key={size}
                            onClick={() => handlePageSizeChange(size)}
                            className={`px-3 py-1 rounded ${pageSize === size
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                        Page {currentPage} of {totalPages} ({totalItems} items)
                    </span>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-2 py-1 disabled:opacity-50"
                        >
                            ←
                        </button>
                        {renderPaginationControls()}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-2 py-1 disabled:opacity-50"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataGrid;