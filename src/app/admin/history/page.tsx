'use client';

import { useEffect, useState } from 'react';

interface StockMovement {
  id: number;
  product_id: number;
  product_size_id: number;
  product_name: string;
  product_size: string;
  quantity_change: number;
  movement_type: 'IN' | 'OUT' | 'ADJUST';
  balance_after: number;
  notes: string | null;
  reference: string | null;
  created_by: string | null;
  created_at: string;
}

export default function StockHistory() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'IN' | 'OUT' | 'ADJUST'>('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stock/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setMovements(data.movements || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredMovements = filter === 'all' 
    ? movements 
    : movements.filter(m => m.movement_type === filter);

  const getMovementBadge = (type: string, change: number) => {
    if (type === 'IN' || change > 0) {
      return { label: `+${Math.abs(change)}`, color: 'bg-green-100 text-green-800' };
    }
    if (type === 'OUT' || change < 0) {
      return { label: `-${Math.abs(change)}`, color: 'bg-red-100 text-red-800' };
    }
    return { label: change.toString(), color: 'bg-blue-100 text-blue-800' };
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
        <button 
          onClick={fetchHistory}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Movement History</h1>
        <p className="text-gray-600">Track all stock changes and adjustments</p>
      </div>

      <div className="mb-4 flex space-x-2">
        {(['all', 'IN', 'OUT', 'ADJUST'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === type
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            {type === 'all' ? 'All' : type === 'IN' ? '📥 Stock In' : type === 'OUT' ? '📤 Stock Out' : '🔄 Adjust'}
          </button>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance After
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes / Reference
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovements.map((movement) => {
              const badge = getMovementBadge(movement.movement_type, movement.quantity_change);
              return (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(movement.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{movement.product_name}</div>
                    <div className="text-sm text-gray-500">{movement.product_size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      movement.movement_type === 'IN' ? 'bg-green-100 text-green-800' :
                      movement.movement_type === 'OUT' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {movement.movement_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-sm font-bold rounded ${badge.color}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {movement.balance_after}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {movement.reference && (
                      <span className="text-blue-600 mr-2">#{movement.reference}</span>
                    )}
                    {movement.notes || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredMovements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No movements found
          </div>
        )}
      </div>
    </div>
  );
}
