'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Mail
} from 'lucide-react';

interface AnalyticsData {
  totalVisitors: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topPages: Array<{ page: string; views: number }>;
  salesByMonth: Array<{ month: string; sales: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>;
}

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Try to fetch real analytics data
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products')
      ]);

      let realData = null;
      if (ordersResponse.ok && productsResponse.ok) {
        const ordersData = await ordersResponse.json();
        const productsData = await productsResponse.json();
        
        if (ordersData.success && productsData.success) {
          // Calculate real analytics from actual data
          const totalOrders = ordersData.orders?.length || 0;
          const totalRevenue = ordersData.orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;
          const totalProducts = productsData.products?.length || 0;
          
          realData = {
            totalVisitors: 1250, // This would come from Google Analytics
            totalOrders,
            totalRevenue,
            conversionRate: totalOrders > 0 ? (totalOrders / 1250 * 100) : 0,
            averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders) : 0,
            topPages: [
              { page: '/', views: 450 },
              { page: '/shop', views: 320 },
              { page: '/products/qyve-infinitus', views: 180 },
              { page: '/products/qyve-leyenda-jersey', views: 150 },
              { page: '/about', views: 120 }
            ],
            salesByMonth: [
              { month: 'Jan', sales: 8500 },
              { month: 'Feb', sales: 9200 },
              { month: 'Mar', sales: 7800 },
              { month: 'Apr', sales: 10500 },
              { month: 'May', sales: 11200 },
              { month: 'Jun', sales: totalRevenue }
            ],
            topProducts: productsData.products?.slice(0, 4).map((product: any, index: number) => ({
              name: product.name,
              sales: Math.floor(Math.random() * 50) + 10, // Mock sales data
              revenue: Math.floor(Math.random() * 3000) + 500 // Mock revenue data
            })) || [],
            trafficSources: [
              { source: 'Direct', visitors: 500, percentage: 40 },
              { source: 'Google', visitors: 375, percentage: 30 },
              { source: 'Social Media', visitors: 250, percentage: 20 },
              { source: 'Email', visitors: 125, percentage: 10 }
            ]
          };
        }
      }

      // Use real data if available, otherwise fallback to mock data
      const mockAnalytics: AnalyticsData = realData || {
        totalVisitors: 1250,
        totalOrders: 156,
        totalRevenue: 12450,
        conversionRate: 12.5,
        averageOrderValue: 79.8,
        topPages: [
          { page: '/', views: 450 },
          { page: '/shop', views: 320 },
          { page: '/products/qyve-infinitus', views: 180 },
          { page: '/products/qyve-leyenda-jersey', views: 150 },
          { page: '/about', views: 120 }
        ],
        salesByMonth: [
          { month: 'Jan', sales: 8500 },
          { month: 'Feb', sales: 9200 },
          { month: 'Mar', sales: 7800 },
          { month: 'Apr', sales: 10500 },
          { month: 'May', sales: 11200 },
          { month: 'Jun', sales: 12450 }
        ],
        topProducts: [
          { name: 'QYVE Infinitus', sales: 45, revenue: 6750 },
          { name: 'QYVE Leyenda Jersey', sales: 32, revenue: 2400 },
          { name: 'QYVE Recovery Slides', sales: 28, revenue: 2800 },
          { name: 'QYVE ProGrip Socks', sales: 25, revenue: 500 }
        ],
        trafficSources: [
          { source: 'Direct', visitors: 500, percentage: 40 },
          { source: 'Google', visitors: 375, percentage: 30 },
          { source: 'Social Media', visitors: 250, percentage: 20 },
          { source: 'Email', visitors: 125, percentage: 10 }
        ]
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data</h3>
        <p className="mt-1 text-sm text-gray-500">Analytics data will appear here once available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your store performance and customer behavior
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Visitors</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalVisitors.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">RM {analytics.totalRevenue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.conversionRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Pages</h3>
            <div className="space-y-3">
              {analytics.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-8">#{index + 1}</span>
                    <span className="text-sm text-gray-900 ml-2">{page.page}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{page.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-3">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-8">#{index + 1}</span>
                    <span className="text-sm text-gray-900 ml-2">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{product.sales} sales</div>
                    <div className="text-xs text-gray-500">RM {product.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {analytics.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-16 text-right">{source.percentage}%</span>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">{source.visitors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
