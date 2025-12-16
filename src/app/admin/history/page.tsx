/* eslint-disable
  @typescript-eslint/no-use-before-define,
  react/button-has-type,
  no-nested-ternary
*/

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

  const filteredMovements =
    filter === 'all'
      ? movements
      : movements.filter((m) => m.movement_type === filter);

  const getMovementBadge = (type: string, change: number) => {
    if (type === 'IN' || change > 0) {
      return {
        label: `+${Math.abs(change)}`,
        color: 'bg-green-100 text-green-800',
      };
    }
    if (type === 'OUT' || change < 0) {
      return {
        label: `-${Math.abs(change)}`,
        color: 'bg-red-100 text-red-800',
      };
    }
    return { label: change.toString(), color: 'bg-blue-100 text-blue-800' };
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
          onClick={fetchHistory}
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
        <h1 className="text-gray-900 text-2xl font-bold">Movement History</h1>
        <p className="text-gray-600">Track all stock changes and adjustments</p>
      </div>

      <div className="mb-4 flex space-x-2">
        {(['all', 'IN', 'OUT', 'ADJUST'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === type
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100 border bg-white'
            }`}
          >
            {type === 'all'
              ? 'All'
              : type === 'IN'
                ? '📥 Stock In'
                : type === 'OUT'
                  ? '📤 Stock Out'
                  : '🔄 Adjust'}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="divide-gray-200 min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Product
              </th>
              <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Type
              </th>
              <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Change
              </th>
              <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Balance After
              </th>
              <th className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Notes / Reference
              </th>
            </tr>
          </thead>
          <tbody className="divide-gray-200 divide-y bg-white">
            {filteredMovements.map((movement) => {
              const badge = getMovementBadge(
                movement.movement_type,
                movement.quantity_change,
              );
              return (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="text-gray-500 whitespace-nowrap px-6 py-4 text-sm">
                    {new Date(movement.created_at).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-gray-900 text-sm font-medium">
                      {movement.product_name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {movement.product_size}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        movement.movement_type === 'IN'
                          ? 'bg-green-100 text-green-800'
                          : movement.movement_type === 'OUT'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {movement.movement_type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded px-2 py-1 text-sm font-bold ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {movement.balance_after}
                  </td>
                  <td className="text-gray-500 max-w-xs truncate px-6 py-4 text-sm">
                    {movement.reference && (
                      <span className="mr-2 text-blue-600">
                        #{movement.reference}
                      </span>
                    )}
                    {movement.notes || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredMovements.length === 0 && (
          <div className="text-gray-500 py-8 text-center">
            No movements found
          </div>
        )}
      </div>
    </div>
  );
}
