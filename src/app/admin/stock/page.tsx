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
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', value: 'out' };
    if (stock <= 5) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', value: 'low' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', value: 'in' };
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.size.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStockStatus(item.stock);
    const matchesFilter = filterStatus === 'all' || status.value === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button onClick={fetchStock} className="mt-2 text-red-600 hover:text-red-800 underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Overview</h1>
        <p className="text-gray-600">View and manage your product inventory by size</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total SKUs</div>
          <div className="text-2xl font-bold">{stockItems.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Units</div>
          <div className="text-2xl font-bold text-blue-600">
            {stockItems.reduce((sum, item) => sum + item.stock, 0)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Low Stock</div>
          <div className="text-2xl font-bold text-yellow-600">
            {stockItems.filter(item => item.stock > 0 && item.stock <= 5).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">
            {stockItems.filter(item => item.stock === 0).length}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by product, color, or size..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <button
          onClick={fetchStock}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const status = getStockStatus(item.stock);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2 border border-gray-200" 
                          style={{ backgroundColor: item.color.toLowerCase() }}
                        />
                        {item.color}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">{item.size}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
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
          <div className="text-center py-8 text-gray-500">
            {searchTerm || filterStatus !== 'all' ? 'No items match your filters' : 'No stock data found'}
          </div>
        )}
      </div>
    </div>
  );
}
