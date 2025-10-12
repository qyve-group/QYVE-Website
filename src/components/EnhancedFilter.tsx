'use client';

import React, { useState, useEffect } from 'react';
import { LuFilter, LuX } from 'react-icons/lu';
import { trackFilterUsage, trackSortUsage } from '@/lib/gtag';
import Button from '@/shared/Button/Button';
import Select from '@/shared/Select/Select';

interface FilterOptions {
  categories: Array<{ id: number; name: string; slug: string }>;
  colors: Array<{ id: number; name: string; hex_code: string }>;
  sizes: Array<{ id: number; name: string; category_id: number }>;
  price_range: { min: number; max: number };
}

interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  price_range: { min: number; max: number } | null;
  in_stock_only: boolean;
  on_sale_only: boolean;
  featured_only: boolean;
  new_arrivals_only: boolean;
  best_sellers_only: boolean;
  sort_by: string;
  direction: 'asc' | 'desc';
}

interface EnhancedFilterProps {
  onFiltersChange: (filters: FilterState) => void;
  onSortChange: (sort: { sort_by: string; direction: 'asc' | 'desc' }) => void;
}

const EnhancedFilter: React.FC<EnhancedFilterProps> = ({ onFiltersChange, onSortChange }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    colors: [],
    sizes: [],
    price_range: null,
    in_stock_only: false,
    on_sale_only: false,
    featured_only: false,
    new_arrivals_only: false,
    best_sellers_only: false,
    sort_by: 'newest_first',
    direction: 'desc'
  });

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/products/filters');
        const data = await response.json();
        if (data.success) {
          setFilterOptions(data);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Update parent component when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));

    // Track filter usage
    if (value && value !== filterType) {
      trackFilterUsage(filterType, value, 'shop');
    }
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = {
      ...filters,
      sort_by: sortBy,
      direction: sortBy === 'price_low_high' ? 'asc' : 'desc'
    };
    
    setFilters(newFilters);
    onSortChange({ sort_by: sortBy, direction: newFilters.direction });
    
    // Track sort usage
    if (sortBy && sortBy !== 'Sort by') {
      trackSortUsage(sortBy, 'shop');
    }
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      colors: [],
      sizes: [],
      price_range: null,
      in_stock_only: false,
      on_sale_only: false,
      featured_only: false,
      new_arrivals_only: false,
      best_sellers_only: false,
      sort_by: 'newest_first',
      direction: 'desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.price_range) count++;
    if (filters.in_stock_only) count++;
    if (filters.on_sale_only) count++;
    if (filters.featured_only) count++;
    if (filters.new_arrivals_only) count++;
    if (filters.best_sellers_only) count++;
    return count;
  };

  if (!filterOptions) {
    return (
      <div className="mx-auto mb-10 max-w-4xl items-center justify-between space-y-3 rounded-2xl border border-neutral-300 p-2 md:flex md:space-y-0 md:rounded-full">
        <div className="flex items-center justify-center w-full py-4">
          <div className="text-gray-500">Loading filters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-10 max-w-6xl">
      {/* Main Filter Bar */}
      <div className="items-center justify-between space-y-3 rounded-2xl border border-neutral-300 p-2 md:flex md:space-y-0 md:rounded-full">
        <div className="grid basis-3/4 gap-3 md:grid-cols-4">
          {/* Category Filter */}
          <Select
            sizeClass="h-12"
            value={filters.categories[0] || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('categories', value ? [value] : []);
            }}
          >
            <option value="">All Categories</option>
            {filterOptions.categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>

          {/* Color Filter */}
          <Select
            sizeClass="h-12"
            value={filters.colors[0] || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('colors', value ? [value] : []);
            }}
          >
            <option value="">All Colors</option>
            {filterOptions.colors.map((color) => (
              <option key={color.id} value={color.name}>
                {color.name}
              </option>
            ))}
          </Select>

          {/* Size Filter */}
          <Select
            sizeClass="h-12"
            value={filters.sizes[0] || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('sizes', value ? [value] : []);
            }}
          >
            <option value="">All Sizes</option>
            {filterOptions.sizes.map((size) => (
              <option key={size.id} value={size.name}>
                {size.name}
              </option>
            ))}
          </Select>

          {/* Sort Filter */}
          <Select
            sizeClass="h-12"
            value={filters.sort_by}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="newest_first">New Arrivals</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="best_sellers">Best Sellers</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </Select>
        </div>

        <div className="hidden h-5 w-px bg-neutral-300 md:block" />

        <div className="flex items-center gap-2">
          <Button 
            className="flex w-full items-center gap-1 bg-gray lg:w-auto"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            More Filters
            <LuFilter />
            {getActiveFiltersCount() > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="mt-4 rounded-2xl border border-neutral-300 p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.price_range?.min || ''}
                  onChange={(e) => {
                    const min = e.target.value ? parseFloat(e.target.value) : 0;
                    handleFilterChange('price_range', {
                      min,
                      max: filters.price_range?.max || filterOptions.price_range.max
                    });
                  }}
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.price_range?.max || ''}
                  onChange={(e) => {
                    const max = e.target.value ? parseFloat(e.target.value) : filterOptions.price_range.max;
                    handleFilterChange('price_range', {
                      min: filters.price_range?.min || filterOptions.price_range.min,
                      max
                    });
                  }}
                />
              </div>
            </div>

            {/* Special Filters */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Special Filters</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.in_stock_only}
                    onChange={(e) => handleFilterChange('in_stock_only', e.target.checked)}
                    className="mr-2"
                  />
                  In Stock Only
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.on_sale_only}
                    onChange={(e) => handleFilterChange('on_sale_only', e.target.checked)}
                    className="mr-2"
                  />
                  On Sale Only
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured_only}
                    onChange={(e) => handleFilterChange('featured_only', e.target.checked)}
                    className="mr-2"
                  />
                  Featured Only
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.new_arrivals_only}
                    onChange={(e) => handleFilterChange('new_arrivals_only', e.target.checked)}
                    className="mr-2"
                  />
                  New Arrivals
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.best_sellers_only}
                    onChange={(e) => handleFilterChange('best_sellers_only', e.target.checked)}
                    className="mr-2"
                  />
                  Best Sellers
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                onClick={clearAllFilters}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFilter;
