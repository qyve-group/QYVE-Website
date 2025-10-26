export interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  status: 'active' | 'upcoming' | 'ended';
  startDate: string;
  endDate?: string;
  heroBanner: {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage: string;
    backgroundColor?: string;
    textColor?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  featuredProducts: string[]; // Product slugs
  lookbookProducts?: string[]; // Product slugs for lookbook grid
  campaignAssets: {
    logo?: string;
    graphics?: string[];
    videos?: string[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  previousPrice?: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  colors: string[];
  sizes: string[];
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  campaignTag?: string;
}

export interface CampaignLookbookItem {
  id: string;
  type: 'product' | 'lifestyle' | 'detail';
  image: string;
  title?: string;
  description?: string;
  productSlug?: string;
  position: {
    row: number;
    column: number;
    spanRows?: number;
    spanColumns?: number;
  };
}

export interface CampaignNavigationItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
}

// Campaign data
export const CAMPAIGNS: Campaign[] = [
  {
    id: 'sub-zero',
    name: 'Sub-Zero',
    slug: 'sub-zero',
    description: 'Introducing Sub-Zero, QYVE\'s revolutionary new shoe line designed for athletes who demand uncompromising performance. Built with cutting-edge technology and premium materials.',
    shortDescription: 'QYVE\'s revolutionary new performance shoe line',
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2025-03-31',
    heroBanner: {
      title: 'Sub-Zero',
      subtitle: 'The Next Generation',
      description: 'Revolutionary performance shoes. Built for champions.',
      backgroundImage: '/images/campaigns/sub-zero/hero-banner.jpg',
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      ctaText: 'Explore Collection',
      ctaLink: '#featured-products'
    },
    featuredProducts: [
      'sub-zero-pro',
      'sub-zero-thermal',
      'sub-zero-extreme'
    ],
    lookbookProducts: [
      'sub-zero-pro',
      'sub-zero-thermal',
      'sub-zero-extreme',
      'sub-zero-essentials'
    ],
    campaignAssets: {
      logo: '/images/campaigns/sub-zero/logo.png',
      graphics: [
        '/images/campaigns/sub-zero/graphic-1.jpg',
        '/images/campaigns/sub-zero/graphic-2.jpg'
      ],
      videos: [
        '/videos/campaigns/sub-zero/intro.mp4'
      ]
    },
    seo: {
      title: 'Sub-Zero Collection - QYVE Revolutionary Performance Shoes',
      description: 'Discover the Sub-Zero collection by QYVE. Revolutionary performance shoes engineered for athletes who demand excellence. Shop now.',
      keywords: ['sub-zero', 'performance shoes', 'QYVE', 'athletic footwear', 'new shoe line']
    },
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];

// Campaign navigation items
export const CAMPAIGN_NAVIGATION: CampaignNavigationItem[] = [
  {
    id: 'sub-zero',
    name: 'Sub-Zero',
    slug: 'sub-zero',
    isActive: true,
    order: 1
  }
];

// Mock campaign products
export const CAMPAIGN_PRODUCTS: CampaignProduct[] = [
  {
    id: 'sub-zero-pro',
    name: 'Sub-Zero Pro',
    slug: 'sub-zero-pro',
    price: 299,
    previousPrice: 349,
    image: '/images/products/sub-zero-pro/main.jpg',
    images: [
      '/images/products/sub-zero-pro/main.jpg',
      '/images/products/sub-zero-pro/side.jpg',
      '/images/products/sub-zero-pro/back.jpg',
      '/images/products/sub-zero-pro/detail.jpg'
    ],
    description: 'The ultimate performance shoe. Features advanced cushioning technology, premium materials, and superior traction for exceptional performance.',
    category: 'futsal',
    colors: ['black', 'white', 'navy'],
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    isNewArrival: true,
    isBestSeller: false,
    isOnSale: true,
    campaignTag: 'Sub-Zero'
  },
  {
    id: 'sub-zero-thermal',
    name: 'Sub-Zero Thermal',
    slug: 'sub-zero-thermal',
    price: 249,
    previousPrice: 299,
    image: '/images/products/sub-zero-thermal/main.jpg',
    images: [
      '/images/products/sub-zero-thermal/main.jpg',
      '/images/products/sub-zero-thermal/side.jpg',
      '/images/products/sub-zero-thermal/back.jpg'
    ],
    description: 'Premium comfort meets cutting-edge design. Perfect for training and athletic performance with advanced cushioning technology.',
    category: 'futsal',
    colors: ['black', 'gray'],
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    isNewArrival: true,
    isBestSeller: false,
    isOnSale: true,
    campaignTag: 'Sub-Zero'
  },
  {
    id: 'sub-zero-extreme',
    name: 'Sub-Zero Extreme',
    slug: 'sub-zero-extreme',
    price: 399,
    previousPrice: 449,
    image: '/images/products/sub-zero-extreme/main.jpg',
    images: [
      '/images/products/sub-zero-extreme/main.jpg',
      '/images/products/sub-zero-extreme/side.jpg',
      '/images/products/sub-zero-extreme/back.jpg',
      '/images/products/sub-zero-extreme/detail.jpg'
    ],
    description: 'For the most demanding athletes. Advanced materials and construction for ultimate performance in any environment.',
    category: 'futsal',
    colors: ['black', 'white'],
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    isNewArrival: true,
    isBestSeller: false,
    isOnSale: true,
    campaignTag: 'Sub-Zero'
  },
  {
    id: 'sub-zero-essentials',
    name: 'Sub-Zero Essentials',
    slug: 'sub-zero-essentials',
    price: 199,
    previousPrice: 249,
    image: '/images/products/sub-zero-essentials/main.jpg',
    images: [
      '/images/products/sub-zero-essentials/main.jpg',
      '/images/products/sub-zero-essentials/side.jpg'
    ],
    description: 'Essential performance at an accessible price. Quality and comfort for everyday athletic activities.',
    category: 'futsal',
    colors: ['black', 'navy'],
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    isNewArrival: true,
    isBestSeller: false,
    isOnSale: true,
    campaignTag: 'Sub-Zero'
  }
];

// Mock lookbook items
export const CAMPAIGN_LOOKBOOK: CampaignLookbookItem[] = [
  {
    id: 'hero-lifestyle',
    type: 'lifestyle',
    image: '/images/campaigns/sub-zero/lookbook/hero-lifestyle.jpg',
    title: 'The Next Generation',
    description: 'Built for champions',
    position: { row: 1, column: 1, spanRows: 2, spanColumns: 2 }
  },
  {
    id: 'sub-zero-pro-detail',
    type: 'detail',
    image: '/images/campaigns/sub-zero/lookbook/pro-detail.jpg',
    title: 'Advanced Cushioning Technology',
    position: { row: 1, column: 3, spanRows: 1, spanColumns: 1 }
  },
  {
    id: 'sub-zero-pro-product',
    type: 'product',
    image: '/images/products/sub-zero-pro/main.jpg',
    productSlug: 'sub-zero-pro',
    position: { row: 2, column: 3, spanRows: 1, spanColumns: 1 }
  },
  {
    id: 'thermal-tech',
    type: 'detail',
    image: '/images/campaigns/sub-zero/lookbook/thermal-tech.jpg',
    title: 'Revolutionary Performance Technology',
    position: { row: 3, column: 1, spanRows: 1, spanColumns: 2 }
  },
  {
    id: 'sub-zero-thermal-product',
    type: 'product',
    image: '/images/products/sub-zero-thermal/main.jpg',
    productSlug: 'sub-zero-thermal',
    position: { row: 3, column: 3, spanRows: 1, spanColumns: 1 }
  }
];

// Utility functions
export const getCampaignBySlug = (slug: string): Campaign | undefined => {
  return CAMPAIGNS.find(campaign => campaign.slug === slug);
};

export const getActiveCampaigns = (): Campaign[] => {
  return CAMPAIGNS.filter(campaign => campaign.status === 'active');
};

export const getCampaignProducts = (campaignSlug: string): CampaignProduct[] => {
  const campaign = getCampaignBySlug(campaignSlug);
  if (!campaign) return [];
  
  return CAMPAIGN_PRODUCTS.filter(product => 
    campaign.featuredProducts.includes(product.slug) ||
    campaign.lookbookProducts?.includes(product.slug)
  );
};

export const getFeaturedProducts = (campaignSlug: string): CampaignProduct[] => {
  const campaign = getCampaignBySlug(campaignSlug);
  if (!campaign) return [];
  
  return CAMPAIGN_PRODUCTS.filter(product => 
    campaign.featuredProducts.includes(product.slug)
  );
};

export const getLookbookItems = (campaignSlug: string): CampaignLookbookItem[] => {
  return CAMPAIGN_LOOKBOOK; // For now, all lookbook items are for Sub-Zero
};
