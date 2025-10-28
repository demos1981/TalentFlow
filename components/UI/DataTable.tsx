import React, { useState, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { ChevronUp, ChevronDown, MoreHorizontal, Filter } from 'lucide-react';
import { Button } from './Button';
import { SearchInput, SearchFilter } from '../Forms/SearchInput';
import { Pagination } from './Pagination';
import '../../styles/checkboxes.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: SearchFilter[];
  onFiltersChange?: (filters: SearchFilter[]) => void;
  sortable?: boolean;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  currentPage?: number;
  totalItems?: number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowActions?: (item: T) => React.ReactNode;
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  getRowId?: (item: T) => string | number;
}

function DataTable<T>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Пошук...',
  filters = [],
  onFiltersChange,
  sortable = false,
  onSortChange,
  sortBy,
  sortOrder = 'asc',
  pagination = false,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  currentPage = 1,
  totalItems,
  loading = false,
  emptyMessage = 'Дані не знайдено',
  className,
  rowActions,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  getRowId,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilter[]>(filters);

  // Фільтрація даних
  const filteredData = useMemo(() => {
    let result = data;

    // Пошук
    if (searchTerm) {
      result = result.filter(item =>
        columns.some(column => {
          const value = (item as any)[column.key];
          if (value && typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        })
      );
    }

    // Фільтри
    if (localFilters.length > 0) {
      result = result.filter(item =>
        localFilters.every(filter => {
          if (!filter.value) return true;
          
          const itemValue = (item as any)[filter.id];
          if (filter.type === 'select') {
            return itemValue === filter.value;
          } else if (filter.type === 'range') {
            const { min, max } = filter.value;
            if (min && itemValue < min) return false;
            if (max && itemValue > max) return false;
            return true;
          } else if (filter.type === 'checkbox') {
            return filter.value.includes(itemValue);
          }
          return true;
        })
      );
    }

    return result;
  }, [data, searchTerm, localFilters, columns]);

  // Сортування
  const sortedData = useMemo(() => {
    if (!sortable || !sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortable, sortBy, sortOrder]);

  // Пагінація
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Обробка сортування
  const handleSort = (columnKey: string) => {
    if (!sortable || !onSortChange) return;

    const newSortOrder = sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(columnKey, newSortOrder);
  };

  // Обробка фільтрів
  const handleFiltersChange = (newFilters: SearchFilter[]) => {
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Обробка вибору рядків
  const handleSelectAll = (checked: boolean) => {
    if (!selectable || !onSelectionChange) return;
    
    if (checked) {
      onSelectionChange(paginatedData);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (item: T, checked: boolean) => {
    if (!selectable || !onSelectionChange) return;
    
    const itemId = getRowId ? getRowId(item) : JSON.stringify(item);
    const isSelected = selectedItems.some(selectedItem => 
      getRowId ? getRowId(selectedItem) === itemId : JSON.stringify(selectedItem) === itemId
    );

    if (checked && !isSelected) {
      onSelectionChange([...selectedItems, item]);
    } else if (!checked && isSelected) {
      onSelectionChange(selectedItems.filter(selectedItem => 
        getRowId ? getRowId(selectedItem) !== itemId : JSON.stringify(selectedItem) !== itemId
      ));
    }
  };

  const isRowSelected = (item: T) => {
    if (!selectable) return false;
    
    const itemId = getRowId ? getRowId(item) : JSON.stringify(item);
    return selectedItems.some(selectedItem => 
      getRowId ? getRowId(selectedItem) === itemId : JSON.stringify(selectedItem) === itemId
    );
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(isRowSelected);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Пошук та фільтри */}
      {(searchable || filters.length > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={setSearchTerm}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>
      )}

      {/* Таблиця */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {/* Checkbox для вибору всіх */}
                {selectable && (
                  <th className="px-4 py-3 text-left">
                    <div className="custom-checkbox">
                      <input
                        type="checkbox"
                        id="select-all"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="checkbox-input"
                      />
                      <label htmlFor="select-all" className="checkbox-label">
                        <span className="checkbox-custom"></span>
                      </label>
                    </div>
                  </th>
                )}

                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                      column.width && `w-${column.width}`,
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300'
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className={cn(
                      'flex items-center',
                      column.align === 'center' && 'justify-center',
                      column.align === 'right' && 'justify-end'
                    )}>
                      <span>{column.header}</span>
                      {column.sortable && sortBy === column.key && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}

                {/* Колонка для дій */}
                {rowActions && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Дії
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Skeleton loading
                Array.from({ length: pageSize }).map((_, index) => (
                  <tr key={index}>
                    {selectable && (
                      <td className="px-4 py-4">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-4 py-4">
                        <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    )}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={getRowId ? getRowId(item) : index}
                    className={cn(
                      'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                      isRowSelected(item) && 'bg-blue-50 dark:bg-blue-900/20'
                    )}
                  >
                    {/* Checkbox для вибору рядка */}
                    {selectable && (
                      <td className="px-4 py-4">
                        <div className="custom-checkbox">
                          <input
                            type="checkbox"
                            id={`select-row-${getRowId ? getRowId(item) : index}`}
                            checked={isRowSelected(item)}
                            onChange={(e) => handleSelectRow(item, e.target.checked)}
                            className="checkbox-input"
                          />
                          <label htmlFor={`select-row-${getRowId ? getRowId(item) : index}`} className="checkbox-label">
                            <span className="checkbox-custom"></span>
                          </label>
                        </div>
                      </td>
                    )}

                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'px-4 py-4 text-sm text-gray-900 dark:text-white',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.render ? (
                          column.render((item as any)[column.key], item)
                        ) : (
                          <span>{(item as any)[column.key]}</span>
                        )}
                      </td>
                    ))}

                    {/* Дії для рядка */}
                    {rowActions && (
                      <td className="px-4 py-4 text-right">
                        {rowActions(item)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Пагінація */}
      {pagination && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
            showPageSize={!!onPageSizeChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={pageSizeOptions}
            totalItems={totalItems || filteredData.length}
          />
        </div>
      )}
    </div>
  );
}

export { DataTable };
