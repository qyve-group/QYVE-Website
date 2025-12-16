/* eslint-disable
  @typescript-eslint/no-use-before-define,
  no-console,
  jsx-a11y/label-has-associated-control,
  no-nested-ternary
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

export default function StockAdjustments() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'IN' | 'OUT' | 'ADJUST'>(
    'ADJUST',
  );
  const [quantity, setQuantity] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

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
      console.error('Error fetching stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || quantity === 0) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/stock/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_size_id: selectedItem.id,
          product_id: selectedItem.product_id,
          product_name: selectedItem.product_name,
          product_size: selectedItem.size,
          quantity_change:
            adjustmentType === 'OUT' ? -Math.abs(quantity) : Math.abs(quantity),
          movement_type: adjustmentType,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to adjust stock');
      }

      setMessage({
        type: 'success',
        text: `Stock updated successfully. New balance: ${data.balance_after}`,
      });
      setSelectedItem(null);
      setQuantity(0);
      setNotes('');
      fetchStock();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-gray-900 size-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-gray-900 text-2xl font-bold">Adjust Stock</h1>
        <p className="text-gray-600">Add or remove stock from your inventory</p>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg p-4 ${
            message.type === 'success'
              ? 'border border-green-200 bg-green-50 text-green-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Select Product
            </label>
            <select
              value={selectedItem?.id || ''}
              onChange={(e) => {
                const item = stockItems.find(
                  (i) => i.id === Number(e.target.value),
                );
                setSelectedItem(item || null);
              }}
              className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a product...</option>
              {stockItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.product_name} - {item.color} ({item.size}) | Current
                  Stock: {item.stock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Adjustment Type
            </label>
            <div className="flex space-x-4">
              {(['IN', 'OUT', 'ADJUST'] as const).map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="adjustmentType"
                    value={type}
                    checked={adjustmentType === type}
                    onChange={() => setAdjustmentType(type)}
                    className="mr-2"
                  />
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      type === 'IN'
                        ? 'bg-green-100 text-green-800'
                        : type === 'OUT'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {type === 'IN'
                      ? '📥 Stock In'
                      : type === 'OUT'
                        ? '📤 Stock Out'
                        : '🔄 Adjust'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity || ''}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              required
            />
            {selectedItem && quantity > 0 && (
              <p className="text-gray-600 mt-2 text-sm">
                New stock will be:{' '}
                {adjustmentType === 'OUT'
                  ? selectedItem.stock - quantity
                  : selectedItem.stock + quantity}
              </p>
            )}
          </div>

          <div>
            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Reason for adjustment..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedItem || quantity === 0}
            className="disabled:bg-gray-400 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing...' : 'Submit Adjustment'}
          </button>
        </form>
      </div>
    </div>
  );
}
