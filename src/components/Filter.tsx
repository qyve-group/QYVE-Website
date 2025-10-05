import React from 'react';
import { LuFilter } from 'react-icons/lu';

import { filters } from '@/data/content';
import { trackFilterUsage, trackSortUsage } from '@/lib/gtag';
import Button from '@/shared/Button/Button';
import Select from '@/shared/Select/Select';

const Filter = () => {
  const handleFilterChange = (filterType: string, value: string) => {
    // Track filter usage
    if (value && value !== filterType) {
      // Don't track the default option
      trackFilterUsage(filterType, value, 'shop');
    }
  };

  const handleSortChange = (sortType: string) => {
    // Track sort usage
    if (sortType && sortType !== 'Sort by') {
      trackSortUsage(sortType, 'shop');
    }
  };

  return (
    <div className="mx-auto mb-10 max-w-4xl items-center justify-between space-y-3 rounded-2xl border border-neutral-300 p-2 md:flex md:space-y-0 md:rounded-full">
      <div className="grid basis-3/4 gap-3 md:grid-cols-4">
        {filters.map((filter, _index) => {
          const filterType = filter[0];
          const isSortFilter = filterType?.toLowerCase().includes('sort');

          return (
            <Select
              sizeClass="h-12"
              key={filterType}
              onChange={(e) => {
                const { value } = e.target;
                if (isSortFilter) {
                  handleSortChange(value);
                } else {
                  handleFilterChange(filterType ?? '', value);
                }
              }}
            >
              {filter.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          );
        })}
      </div>

      <div className="hidden h-5 w-px bg-neutral-300 md:block" />

      <Button className="flex w-full items-center gap-1 bg-gray lg:w-auto">
        More Filter
        <LuFilter />
      </Button>
    </div>
  );
};

export default Filter;
