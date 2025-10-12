'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Mail,
  Image,
  FileText
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  topProducts: any[];
  bannerViews: number;
  emailSubscribers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: [],
    bannerViews: 0,
    emailSubscribers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      const mockStats: DashboardStats = {
        totalOrders: 156,
        totalRevenue: 12450,
        totalProducts: 24,
        totalUsers: 89,
        recentOrders: [
          { id: 'ORD-001', customer: 'John Doe', amount: 150, status: 'completed', date: '2024-01-15' },
          { id: 'ORD-002', customer: 'Jane Smith', amount: 75, status: 'pending', date: '2024-01-14' },
          { id: 'ORD-003', customer: 'Mike Johnson', amount: 200, status: 'shipped', date: '2024-01-13' },
        ],
        topProducts: [
          { name: 'QYVE Infinitus', sales: 45, revenue: 2250 },
          { name: 'QYVE Leyenda Jersey', sales: 32, revenue: 1600 },
          { name: 'QYVE Recovery Slides', sales: 28, revenue: 1400 },
        ],
        bannerViews: 1250,
        emailSubscribers: 89
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    changeType?: 'increase' | 'decrease';
  }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                    ) : (
                      <TrendingDown className="h-4 w-4 flex-shrink-0 self-center" />
                    )}
                    <span className="sr-only">{changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                    {change}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the QYVE admin dashboard. Here's an overview of your store performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          change="+12%"
          changeType="increase"
        />
        <StatCard
          title="Total Revenue"
          value={`RM ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          change="+8%"
          changeType="increase"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          change="+2"
          changeType="increase"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          change="+5%"
          changeType="increase"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Banner Views"
          value={stats.bannerViews}
          icon={Eye}
          change="+15%"
          changeType="increase"
        />
        <StatCard
          title="Email Subscribers"
          value={stats.emailSubscribers}
          icon={Mail}
          change="+3%"
          changeType="increase"
        />
        <StatCard
          title="Active Banners"
          value="4"
          icon={Image}
        />
        <StatCard
          title="Size Charts"
          value="4"
          icon={FileText}
        />
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Orders</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <li key={order.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.customer}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Order #{order.id} • {order.date}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          RM {order.amount}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="/admin/orders"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all orders
              </a>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Products</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {stats.topProducts.map((product, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {product.sales} sales
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          RM {product.revenue}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="/admin/products"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all products
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/admin/products/new"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                  <Package className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Add Product
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create a new product listing
                </p>
              </div>
            </a>

            <a
              href="/admin/banners/new"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <Image className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Create Banner
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Set up a new marketing banner
                </p>
              </div>
            </a>

            <a
              href="/admin/email-templates"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <Mail className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Email Templates
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage email templates
                </p>
              </div>
            </a>

            <a
              href="/admin/size-charts"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <FileText className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Size Charts
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Edit size chart data
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
