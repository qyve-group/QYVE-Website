import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart as addToCartAction, CartItem } from '@/store/cartSlice';
import { useBundleModal } from '@/providers/BundleModalProvider';

export const useAddToCart = () => {
  const dispatch = useDispatch();
  const { openModal } = useBundleModal();

  const addToCart = useCallback((item: CartItem, category?: string) => {
    dispatch(addToCartAction(item));
    
    const detectedCategory = category || extractCategoryFromName(item.name);
    
    openModal({
      name: item.name,
      price: item.price,
      category: detectedCategory,
      productId: item.id?.toString(),
    });
  }, [dispatch, openModal]);

  return { addToCart };
};

function extractCategoryFromName(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('sock')) return 'socks';
  if (lowerName.includes('shoe') || lowerName.includes('subzero')) return 'shoes';
  if (lowerName.includes('bag')) return 'accessories';
  if (lowerName.includes('shirt') || lowerName.includes('jersey')) return 'apparel';
  
  return 'general';
}
