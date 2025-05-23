import React, { useState, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type Column<T> = {
  header: string;
  accessor: keyof T;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  itemsPerPage?: number;
};

const Tables = <T,>({
  columns,
  data,
  renderRow,
  itemsPerPage = 10,
}: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.some((col) =>
        String(item[col.accessor] ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data, columns]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-black overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 bg-back">
        <div className="flex items-center justify-between">
          <p className="text-sm text-dark">
            Total records: <span className="font-medium text-primary">{filteredData.length}</span>
          </p>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary">
          <thead className="bg-primary">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider ${col.className}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-green-100 divide-y divide-primary">
            {currentData.length > 0 ? (
              currentData.map((item) => renderRow(item))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap text-sm text-dark text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="hidden md:block">
            <p className="text-sm text-dark">
              Showing{' '}
              <span className="font-medium text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium text-primary">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span>{' '}
              of <span className="font-medium text-primary">{filteredData.length}</span> results
            </p>
          </div>
          <div className="md:flex md:items-center md:justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-dark hover:bg-back disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-dark">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-dark hover:bg-back disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <FiChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tables;
