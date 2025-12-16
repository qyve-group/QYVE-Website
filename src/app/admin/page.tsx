/* eslint-disable
  @typescript-eslint/no-use-before-define,
  react/button-has-type,
  no-nested-ternary
*/

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
        totalStock: stocks.reduce(
          (sum: number, item: any) => sum + item.stock,
          0,
        ),
        lowStockItems: stocks.filter(
          (item: any) => item.stock > 0 && item.stock <= 5,
        ).length,
        outOfStockItems: stocks.filter((item: any) => item.stock === 0).length,
        activeProducts: products.filter((p: any) => p.status === 'active')
          .length,
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
          onClick={fetchDashboardData}
          className="mt-2 text-red-600 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900 text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to QYVE Admin</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/products"
          className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-gray-900 text-3xl font-bold">
                {stats?.totalProducts || 0}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100">
              <span className="text-2xl">🛍️</span>
            </div>
          </div>
          <p className="text-gray-500 mt-2 text-sm">
            {stats?.activeProducts || 0} active
          </p>
        </Link>

        <Link
          href="/admin/stock"
          className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Stock</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.totalStock || 0}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <p className="text-gray-500 mt-2 text-sm">units in inventory</p>
        </Link>

        <Link
          href="/admin/stock?filter=low"
          className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats?.lowStockItems || 0}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-lg bg-yellow-100">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <p className="text-gray-500 mt-2 text-sm">items need attention</p>
        </Link>

        <Link
          href="/admin/stock?filter=out"
          className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">
                {stats?.outOfStockItems || 0}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-lg bg-red-100">
              <span className="text-2xl">🚫</span>
            </div>
          </div>
          <p className="text-gray-500 mt-2 text-sm">items unavailable</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-gray-900 text-lg font-semibold">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/products"
              className="bg-gray-50 hover:bg-gray-100 flex items-center rounded-lg p-4 transition-colors"
            >
              <span className="mr-3 text-2xl">🛍️</span>
              <div>
                <p className="text-gray-900 font-medium">Manage Products</p>
                <p className="text-gray-500 text-sm">Add, edit, delete</p>
              </div>
            </Link>
            <Link
              href="/admin/adjustments"
              className="bg-gray-50 hover:bg-gray-100 flex items-center rounded-lg p-4 transition-colors"
            >
              <span className="mr-3 text-2xl">✏️</span>
              <div>
                <p className="text-gray-900 font-medium">Adjust Stock</p>
                <p className="text-gray-500 text-sm">Update inventory</p>
              </div>
            </Link>
            <Link
              href="/admin/stock"
              className="bg-gray-50 hover:bg-gray-100 flex items-center rounded-lg p-4 transition-colors"
            >
              <span className="mr-3 text-2xl">📦</span>
              <div>
                <p className="text-gray-900 font-medium">View Stock</p>
                <p className="text-gray-500 text-sm">Check inventory</p>
              </div>
            </Link>
            <Link
              href="/admin/history"
              className="bg-gray-50 hover:bg-gray-100 flex items-center rounded-lg p-4 transition-colors"
            >
              <span className="mr-3 text-2xl">📋</span>
              <div>
                <p className="text-gray-900 font-medium">View History</p>
                <p className="text-gray-500 text-sm">Stock movements</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-gray-900 text-lg font-semibold">
              Recent Activity
            </h2>
            <Link
              href="/admin/history"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
          {stats?.recentMovements && stats.recentMovements.length > 0 ? (
            <div className="space-y-3">
              {stats.recentMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="bg-gray-50 flex items-center justify-between rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-sm ${
                        movement.movement_type === 'IN'
                          ? 'bg-green-100 text-green-600'
                          : movement.movement_type === 'OUT'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {movement.movement_type === 'IN'
                        ? '+'
                        : movement.movement_type === 'OUT'
                          ? '-'
                          : '~'}
                    </span>
                    <div>
                      <p className="text-gray-900 text-sm font-medium">
                        {movement.product_name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {movement.color} / {movement.size}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        movement.quantity_change > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {movement.quantity_change > 0 ? '+' : ''}
                      {movement.quantity_change}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(movement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 py-8 text-center">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
