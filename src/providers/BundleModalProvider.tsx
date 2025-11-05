'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import AddMoreItemsModal from '@/components/AddMoreItemsModal';

interface ProductContext {
  name: string;
  price: number;
  category?: string;
  productId?: string;
}

interface BundleModalContextType {
  openModal: (product: ProductContext) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const BundleModalContext = createContext<BundleModalContextType | undefined>(undefined);

export const BundleModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productContext, setProductContext] = useState<ProductContext | null>(null);

  const openModal = (product: ProductContext) => {
    setProductContext(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setProductContext(null), 300);
  };

  return (
    <BundleModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <AddMoreItemsModal
        isOpen={isOpen}
        onClose={closeModal}
        itemJustAdded={productContext ? {
          name: productContext.name,
          price: productContext.price,
        } : undefined}
        productContext={productContext}
      />
    </BundleModalContext.Provider>
  );
};

export const useBundleModal = () => {
  const context = useContext(BundleModalContext);
  if (!context) {
    throw new Error('useBundleModal must be used within BundleModalProvider');
  }
  return context;
};
