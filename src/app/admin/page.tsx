'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  activeProducts: number;
  recentMovements: Movement[];
}

interface Movement {
  id: number;
  product_name: string;
  color: string;
  size: string;
  movement_type: string;
  quantity_change: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stockRes, productsRes, historyRes] = await Promise.all([
        fetch('/api/admin/stock'),
        fetch('/api/admin/products'),
        fetch('/api/admin/stock/history?limit=5'),
      ]);

      const stockData = await stockRes.json();
      const productsData = await productsRes.json();
      const historyData = await historyRes.json();

      const stocks = stockData.stocks || [];
      const products = productsData.products || [];
      const movements = historyData.movements || [];

      setStats({
        totalProducts: products.length,
        totalStock: stocks.reduce((sum: number, item: any) => sum + item.stock, 0),
        lowStockItems: stocks.filter((item: any) => item.stock > 0 && item.stock <= 5).length,
        outOfStockItems: stocks.filter((item: any) => item.stock === 0).length,
        activeProducts: products.filter((p: any) => p.status === 'active').length,
        recentMovements: movements,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
        <button onClick={fetchDashboardData} className="mt-2 text-red-600 hover:text-red-800 underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to QYVE Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/products" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛍️</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{stats?.activeProducts || 0} active</p>
        </Link>

        <Link href="/admin/stock" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stock</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalStock || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">units in inventory</p>
        </Link>

        <Link href="/admin/stock?filter=low" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.lowStockItems || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">items need attention</p>
        </Link>

        <Link href="/admin/stock?filter=out" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{stats?.outOfStockItems || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚫</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">items unavailable</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/products"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3">🛍️</span>
              <div>
                <p className="font-medium text-gray-900">Manage Products</p>
                <p className="text-sm text-gray-500">Add, edit, delete</p>
              </div>
            </Link>
            <Link
              href="/admin/adjustments"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3">✏️</span>
              <div>
                <p className="font-medium text-gray-900">Adjust Stock</p>
                <p className="text-sm text-gray-500">Update inventory</p>
              </div>
            </Link>
            <Link
              href="/admin/stock"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3">📦</span>
              <div>
                <p className="font-medium text-gray-900">View Stock</p>
                <p className="text-sm text-gray-500">Check inventory</p>
              </div>
            </Link>
            <Link
              href="/admin/history"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3">📋</span>
              <div>
                <p className="font-medium text-gray-900">View History</p>
                <p className="text-sm text-gray-500">Stock movements</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/admin/history" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          {stats?.recentMovements && stats.recentMovements.length > 0 ? (
            <div className="space-y-3">
              {stats.recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      movement.movement_type === 'IN' ? 'bg-green-100 text-green-600' :
                      movement.movement_type === 'OUT' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {movement.movement_type === 'IN' ? '+' : movement.movement_type === 'OUT' ? '-' : '~'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{movement.product_name}</p>
                      <p className="text-xs text-gray-500">{movement.color} / {movement.size}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      movement.quantity_change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.quantity_change > 0 ? '+' : ''}{movement.quantity_change}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(movement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
