'use client';

import { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface BundleItem {
  id: string;
  product_name: string;
  product_image_url?: string;
  item_price: number;
  quantity: number;
  available_sizes?: string[];
  available_colors?: string[];
  is_required: boolean;
}

interface Bundle {
  id: string;
  bundle_name: string;
  bundle_description: string;
  regular_price: number;
  bundle_price: number;
  discount_amount: number;
  badge_text?: string;
  badge_color?: string;
  items: BundleItem[];
}

interface BundleSelectorProps {
  bundleId?: string;
  onSelect?: (bundleId: string, selectedItems: any[]) => void;
}

const BundleSelector = ({ bundleId, onSelect }: BundleSelectorProps) => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
  }, [bundleId]);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const url = bundleId 
        ? `/api/bundles/get?id=${bundleId}`
        : '/api/bundles/get?active=true';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (bundleId) {
          setSelectedBundle(data.bundle);
          setBundles([data.bundle]);
          initializeSelectedItems(data.bundle);
        } else {
          setBundles(data.bundles || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSelectedItems = (bundle: Bundle) => {
    const items: {[key: string]: any} = {};
    bundle.items.forEach((item) => {
      if (item.is_required) {
        items[item.id] = {
          selected: true,
          quantity: item.quantity,
          size: item.available_sizes?.[0] || null,
          color: item.available_colors?.[0] || null,
        };
      }
    });
    setSelectedItems(items);
  };

  const handleSelectBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    initializeSelectedItems(bundle);
  };

  const handleItemToggle = (itemId: string, item: BundleItem) => {
    if (item.is_required) return;

    setSelectedItems((prev) => {
      const newItems = { ...prev };
      if (newItems[itemId]?.selected) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = {
          selected: true,
          quantity: item.quantity,
          size: item.available_sizes?.[0] || null,
          color: item.available_colors?.[0] || null,
        };
      }
      return newItems;
    });
  };

  const handleVariantChange = (itemId: string, field: string, value: any) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const handleAddToCart = () => {
    if (!selectedBundle) return;

    const items = Object.entries(selectedItems).map(([itemId, config]) => {
      const bundleItem = selectedBundle.items.find(i => i.id === itemId);
      return {
        itemId,
        ...config,
        product_name: bundleItem?.product_name,
        price: bundleItem?.item_price,
      };
    });

    if (onSelect) {
      onSelect(selectedBundle.id, items);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bundle Selection */}
      {!selectedBundle && bundles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Choose Your Bundle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bundles.map((bundle) => (
              <button
                key={bundle.id}
                onClick={() => handleSelectBundle(bundle)}
                className="text-left border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all relative"
              >
                {bundle.badge_text && (
                  <div
                    className="absolute -top-3 -right-3 px-4 py-1 rounded-full text-white text-sm font-semibold"
                    style={{ backgroundColor: bundle.badge_color || '#ff6b35' }}
                  >
                    {bundle.badge_text}
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2">{bundle.bundle_name}</h3>
                <p className="text-sm text-gray-600 mb-4">{bundle.bundle_description}</p>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-blue-600">
                    RM {bundle.bundle_price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    RM {bundle.regular_price.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Bundle Details */}
      {selectedBundle && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{selectedBundle.bundle_name}</h2>
            {!bundleId && (
              <button
                onClick={() => setSelectedBundle(null)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Change Bundle
              </button>
            )}
          </div>

          <div className="space-y-4">
            {selectedBundle.items.map((item) => {
              const isSelected = selectedItems[item.id]?.selected;
              const config = selectedItems[item.id] || {};

              return (
                <div
                  key={item.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleItemToggle(item.id, item)}
                      disabled={item.is_required}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      } ${item.is_required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
                    </button>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">
                            {item.product_name}
                            {item.is_required && (
                              <span className="ml-2 text-xs text-gray-500">(Required)</span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">
                            RM {item.item_price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Variant Selection */}
                      {isSelected && (item.available_sizes?.length || item.available_colors?.length) ? (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          {item.available_sizes && item.available_sizes.length > 0 && (
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Size
                              </label>
                              <select
                                value={config.size || ''}
                                onChange={(e) =>
                                  handleVariantChange(item.id, 'size', e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              >
                                {item.available_sizes.map((size) => (
                                  <option key={size} value={size}>
                                    {size}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {item.available_colors && item.available_colors.length > 0 && (
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Color
                              </label>
                              <select
                                value={config.color || ''}
                                onChange={(e) =>
                                  handleVariantChange(item.id, 'color', e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              >
                                {item.available_colors.map((color) => (
                                  <option key={color} value={color}>
                                    {color}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Bundle Total:</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  RM {selectedBundle.bundle_price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 line-through">
                  RM {selectedBundle.regular_price.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-center text-green-600 font-semibold mb-4">
              You save RM {selectedBundle.discount_amount.toFixed(2)}!
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Add Bundle to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleSelector;
