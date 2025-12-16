/* eslint-disable
  @typescript-eslint/no-use-before-define,
  react/button-has-type
*/

'use client';

import { useEffect, useState } from 'react';

interface StockItem {
  id: number;
  product_id: number;
  product_color_id: number;
  size: string;
  stock: number;
  color: string;
  product_name: string;
}

export default function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stock');
      if (!response.ok) throw new Error('Failed to fetch stock');
      const data = await response.json();
      setStockItems(data.stocks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        label: 'Out of Stock',
        color: 'bg-red-100 text-red-800',
        value: 'out',
      };
    if (stock <= 5)
      return {
        label: 'Low Stock',
        color: 'bg-yellow-100 text-yellow-800',
        value: 'low',
      };
    return {
      label: 'In Stock',
      color: 'bg-green-100 text-green-800',
      value: 'in',
    };
  };

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.size.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStockStatus(item.stock);
    const matchesFilter =
      filterStatus === 'all' || status.value === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-gray-900 size-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchStock}
          className="mt-2 text-red-600 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-gray-900 text-2xl font-bold">Stock Overview</h1>
        <p className="text-gray-600">
          View and manage your product inventory by size
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-gray-500 text-sm">Total SKUs</div>
          <div className="text-2xl font-bold">{stockItems.length}</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-gray-500 text-sm">Total Units</div>
          <div className="text-2xl font-bold text-blue-600">
            {stockItems.reduce((sum, item) => sum + item.stock, 0)}
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-gray-500 text-sm">Low Stock</div>
          <div className="text-2xl font-bold text-yellow-600">
            {
              stockItems.filter((item) => item.stock > 0 && item.stock <= 5)
                .length
            }
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-gray-500 text-sm">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">
            {stockItems.filter((item) => item.stock === 0).length}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by product, color, or size..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border-gray-300 rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <button
          onClick={fetchStock}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-4 py-2"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="divide-gray-200 min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Product
                </th>
                <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Variant
                </th>
                <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Size
                </th>
                <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-gray-200 divide-y bg-white">
              {filteredItems.map((item) => {
                const status = getStockStatus(item.stock);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium">
                      {item.product_name}
                    </td>
                    <td className="text-gray-500 whitespace-nowrap px-6 py-4 text-sm">
                      <span className="inline-flex items-center">
                        <span
                          className="border-gray-200 mr-2 size-3 rounded-full border"
                          style={{ backgroundColor: item.color.toLowerCase() }}
                        />
                        {item.color}
                      </span>
                    </td>
                    <td className="text-gray-500 whitespace-nowrap px-6 py-4 text-sm">
                      <span className="bg-gray-100 rounded px-2 py-1">
                        {item.size}
                      </span>
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium">
                      {item.stock}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredItems.length === 0 && (
          <div className="text-gray-500 py-8 text-center">
            {searchTerm || filterStatus !== 'all'
              ? 'No items match your filters'
              : 'No stock data found'}
          </div>
        )}
      </div>
    </div>
  );
}
