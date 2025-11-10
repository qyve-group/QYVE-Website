/* eslint-disable @typescript-eslint/no-use-before-define */

export interface SizeChartData {
  category: string;
  title: string;
  description: string;
  measurements: {
    [key: string]: {
      [size: string]: string | number;
    };
  };
  sizeGuide: string[];
  tips: string[];
}

export interface SizeRecommendation {
  recommendedSize: string;
  confidence: number;
  reasoning: string;
}

export interface SizeQuestionnaire {
  id: string;
  question: string;
  type: 'select' | 'radio' | 'input';
  options?: string[];
  required: boolean;
  category: string[];
}

// Size Chart Data for all QYVE product categories
export const SIZE_CHARTS: { [key: string]: SizeChartData } = {
  // Futsal Shoes
  futsal: {
    category: 'futsal',
    title: 'Futsal Shoes Size Chart',
    description:
      'Find your perfect futsal shoe size for optimal performance and comfort.',
    measurements: {
      'US Size': {
        '6': '6',
        '6.5': '6.5',
        '7': '7',
        '7.5': '7.5',
        '8': '8',
        '8.5': '8.5',
        '9': '9',
        '9.5': '9.5',
        '10': '10',
        '10.5': '10.5',
        '11': '11',
        '11.5': '11.5',
        '12': '12',
      },
      'UK Size': {
        '6': '5',
        '6.5': '5.5',
        '7': '6',
        '7.5': '6.5',
        '8': '7',
        '8.5': '7.5',
        '9': '8',
        '9.5': '8.5',
        '10': '9',
        '10.5': '9.5',
        '11': '10',
        '11.5': '10.5',
        '12': '11',
      },
      'EU Size': {
        '6': '39',
        '6.5': '40',
        '7': '40.5',
        '7.5': '41',
        '8': '42',
        '8.5': '42.5',
        '9': '43',
        '9.5': '44',
        '10': '44.5',
        '10.5': '45',
        '11': '45.5',
        '11.5': '46',
        '12': '47',
      },
      'Foot Length (cm)': {
        '6': '23.5',
        '6.5': '24.1',
        '7': '24.6',
        '7.5': '25.1',
        '8': '25.7',
        '8.5': '26.2',
        '9': '26.7',
        '9.5': '27.3',
        '10': '27.8',
        '10.5': '28.3',
        '11': '28.9',
        '11.5': '29.4',
        '12': '30.0',
      },
    },
    sizeGuide: [
      'Measure your foot length from heel to toe',
      'Stand on a piece of paper and mark the longest points',
      'Measure the distance between the marks in centimeters',
      'Compare with our size chart to find your perfect fit',
      'For futsal shoes, we recommend a snug fit for better ball control',
    ],
    tips: [
      'Futsal shoes should fit snugly but not tight',
      'Leave about 0.5cm space at the toe for comfort',
      'Consider your foot width - wider feet may need to size up',
      'Try on both shoes as feet can vary in size',
      'Wear the same type of socks you plan to use during play',
    ],
  },

  // Jersey
  jersey: {
    category: 'jersey',
    title: 'Jersey Size Chart',
    description:
      'Choose the right jersey size for comfort and performance on the field.',
    measurements: {
      Size: {
        XS: 'XS',
        S: 'S',
        M: 'M',
        L: 'L',
        XL: 'XL',
        XXL: 'XXL',
        '3XL': '3XL',
      },
      'Chest (cm)': {
        XS: '86-91',
        S: '91-96',
        M: '96-101',
        L: '101-106',
        XL: '106-111',
        XXL: '111-116',
        '3XL': '116-121',
      },
      'Length (cm)': {
        XS: '66',
        S: '68',
        M: '70',
        L: '72',
        XL: '74',
        XXL: '76',
        '3XL': '78',
      },
      'Shoulder (cm)': {
        XS: '42',
        S: '44',
        M: '46',
        L: '48',
        XL: '50',
        XXL: '52',
        '3XL': '54',
      },
    },
    sizeGuide: [
      'Measure around the fullest part of your chest',
      'Keep the measuring tape parallel to the ground',
      "Don't pull the tape too tight or too loose",
      'For jerseys, consider if you prefer a loose or fitted style',
      'Check the length measurement for your preferred fit',
    ],
    tips: [
      'Jerseys are designed for athletic fit - consider sizing up for comfort',
      'Check the length measurement if you prefer longer or shorter jerseys',
      'Consider layering - you may want extra room for base layers',
      'Our jerseys are made with stretchy material for flexibility',
      'If between sizes, we recommend sizing up for comfort',
    ],
  },

  // Slides
  slides: {
    category: 'slides',
    title: 'Recovery Slides Size Chart',
    description:
      'Find the perfect fit for your recovery slides for maximum comfort.',
    measurements: {
      'US Size': {
        '6': '6',
        '6.5': '6.5',
        '7': '7',
        '7.5': '7.5',
        '8': '8',
        '8.5': '8.5',
        '9': '9',
        '9.5': '9.5',
        '10': '10',
        '10.5': '10.5',
        '11': '11',
        '11.5': '11.5',
        '12': '12',
      },
      'UK Size': {
        '6': '5',
        '6.5': '5.5',
        '7': '6',
        '7.5': '6.5',
        '8': '7',
        '8.5': '7.5',
        '9': '8',
        '9.5': '8.5',
        '10': '9',
        '10.5': '9.5',
        '11': '10',
        '11.5': '10.5',
        '12': '11',
      },
      'EU Size': {
        '6': '39',
        '6.5': '40',
        '7': '40.5',
        '7.5': '41',
        '8': '42',
        '8.5': '42.5',
        '9': '43',
        '9.5': '44',
        '10': '44.5',
        '10.5': '45',
        '11': '45.5',
        '11.5': '46',
        '12': '47',
      },
      'Foot Length (cm)': {
        '6': '23.5',
        '6.5': '24.1',
        '7': '24.6',
        '7.5': '25.1',
        '8': '25.7',
        '8.5': '26.2',
        '9': '26.7',
        '9.5': '27.3',
        '10': '27.8',
        '10.5': '28.3',
        '11': '28.9',
        '11.5': '29.4',
        '12': '30.0',
      },
    },
    sizeGuide: [
      'Measure your foot length from heel to toe',
      'Stand on a piece of paper and mark the longest points',
      'Measure the distance between the marks in centimeters',
      'For slides, you can go slightly larger for comfort',
      'Consider your foot width for the best fit',
    ],
    tips: [
      'Slides should be comfortable and easy to slip on/off',
      "A little extra room is fine for slides - they're meant to be relaxed",
      'Consider your foot width - wider feet may need to size up',
      'Slides are perfect for post-workout recovery and casual wear',
      'Our slides feature arch support for all-day comfort',
    ],
  },

  // Socks
  socks: {
    category: 'socks',
    title: 'ProGrip Socks Size Chart',
    description: 'Choose the right sock size for optimal grip and comfort.',
    measurements: {
      Size: {
        XS: 'XS',
        S: 'S',
        M: 'M',
        L: 'L',
        XL: 'XL',
      },
      'US Shoe Size': {
        XS: '4-6',
        S: '6-8',
        M: '8-10',
        L: '10-12',
        XL: '12-14',
      },
      'UK Shoe Size': {
        XS: '3-5',
        S: '5-7',
        M: '7-9',
        L: '9-11',
        XL: '11-13',
      },
      'EU Shoe Size': {
        XS: '36-39',
        S: '39-42',
        M: '42-45',
        L: '45-48',
        XL: '48-51',
      },
      'Foot Length (cm)': {
        XS: '22-24',
        S: '24-26',
        M: '26-28',
        L: '28-30',
        XL: '30-32',
      },
    },
    sizeGuide: [
      'Check your current shoe size',
      'Socks should fit snugly but not constrict circulation',
      'Consider the thickness of the sock material',
      'Our ProGrip socks are designed for athletic performance',
      'If between sizes, choose the smaller size for better grip',
    ],
    tips: [
      'Socks should fit snugly for maximum grip and performance',
      'Avoid socks that are too loose as they can cause blisters',
      'Our ProGrip technology works best with proper fit',
      "Consider the type of shoes you'll be wearing with the socks",
      'Socks should cover your entire foot without bunching up',
    ],
  },
};

// Size Recommendation Questionnaire
export const SIZE_QUESTIONNAIRE: SizeQuestionnaire[] = [
  {
    id: 'current_shoe_size',
    question: 'What is your current shoe size?',
    type: 'select',
    options: [
      '6',
      '6.5',
      '7',
      '7.5',
      '8',
      '8.5',
      '9',
      '9.5',
      '10',
      '10.5',
      '11',
      '11.5',
      '12',
    ],
    required: true,
    category: ['futsal', 'slides', 'socks'],
  },
  {
    id: 'shoe_brand',
    question: 'What brand of shoes do you currently wear?',
    type: 'select',
    options: [
      'Nike',
      'Adidas',
      'Puma',
      'New Balance',
      'Under Armour',
      'Reebok',
      'Other',
    ],
    required: false,
    category: ['futsal', 'slides'],
  },
  {
    id: 'foot_width',
    question: 'How would you describe your foot width?',
    type: 'radio',
    options: ['Narrow', 'Medium', 'Wide'],
    required: false,
    category: ['futsal', 'slides', 'socks'],
  },
  {
    id: 'chest_measurement',
    question: 'What is your chest measurement?',
    type: 'select',
    options: [
      'XS (86-91cm)',
      'S (91-96cm)',
      'M (96-101cm)',
      'L (101-106cm)',
      'XL (106-111cm)',
      'XXL (111-116cm)',
      '3XL (116-121cm)',
    ],
    required: true,
    category: ['jersey'],
  },
  {
    id: 'jersey_fit_preference',
    question: 'How do you prefer your jerseys to fit?',
    type: 'radio',
    options: ['Slim/Fitted', 'Regular', 'Loose/Comfortable'],
    required: false,
    category: ['jersey'],
  },
  {
    id: 'current_sock_size',
    question: 'What size socks do you currently wear?',
    type: 'select',
    options: ['XS', 'S', 'M', 'L', 'XL'],
    required: true,
    category: ['socks'],
  },
  {
    id: 'sock_thickness_preference',
    question: 'Do you prefer thick or thin socks?',
    type: 'radio',
    options: ['Thin', 'Medium', 'Thick'],
    required: false,
    category: ['socks'],
  },
];

// Size recommendation logic
export const getSizeRecommendation = (
  category: string,
  answers: { [key: string]: string },
): SizeRecommendation => {
  switch (category) {
    case 'futsal':
      return getFutsalSizeRecommendation(answers);
    case 'jersey':
      return getJerseySizeRecommendation(answers);
    case 'slides':
      return getSlidesSizeRecommendation(answers);
    case 'socks':
      return getSocksSizeRecommendation(answers);
    default:
      return {
        recommendedSize: 'M',
        confidence: 0,
        reasoning: 'Unable to determine size recommendation',
      };
  }
};

const getFutsalSizeRecommendation = (answers: {
  [key: string]: string;
}): SizeRecommendation => {
  const currentSize = answers.current_shoe_size;
  const brand = answers.shoe_brand;
  const footWidth = answers.foot_width;

  if (!currentSize) {
    return {
      recommendedSize: 'M',
      confidence: 0,
      reasoning:
        'Please provide your current shoe size for accurate recommendation',
    };
  }

  let recommendedSize = currentSize;
  let confidence = 80;
  let reasoning = `Based on your current size ${currentSize}`;

  // Brand-specific adjustments
  if (brand === 'Nike' || brand === 'Adidas') {
    reasoning += ', which aligns well with our sizing';
  } else if (brand === 'Puma') {
    recommendedSize = getNextSizeUp(currentSize);
    reasoning += ', we recommend sizing up as Puma tends to run smaller';
    confidence -= 10;
  }

  // Foot width adjustments
  if (footWidth === 'Wide') {
    recommendedSize = getNextSizeUp(recommendedSize);
    reasoning += '. Since you have wide feet, we recommend sizing up';
    confidence -= 5;
  } else if (footWidth === 'Narrow') {
    reasoning += '. Your narrow feet should fit well in our standard sizing';
    confidence += 5;
  }

  return {
    recommendedSize,
    confidence,
    reasoning,
  };
};

const getJerseySizeRecommendation = (answers: {
  [key: string]: string;
}): SizeRecommendation => {
  const chestMeasurement = answers.chest_measurement;
  const fitPreference = answers.jersey_fit_preference;

  if (!chestMeasurement) {
    return {
      recommendedSize: 'M',
      confidence: 0,
      reasoning:
        'Please provide your chest measurement for accurate recommendation',
    };
  }

  const sizeMatch = chestMeasurement.match(/(XS|S|M|L|XL|XXL|3XL)/);
  let recommendedSize: string = sizeMatch?.[1] ?? 'M';
  let confidence = 85;
  let reasoning = `Based on your chest measurement (${chestMeasurement})`;

  // Fit preference adjustments
  if (fitPreference === 'Slim/Fitted') {
    reasoning += ', you prefer a fitted style which matches our sizing';
    confidence += 5;
  } else if (fitPreference === 'Loose/Comfortable') {
    recommendedSize = getNextSizeUp(recommendedSize);
    reasoning += ', we recommend sizing up for a more comfortable fit';
    confidence -= 5;
  }

  return {
    recommendedSize,
    confidence,
    reasoning,
  };
};

const getSlidesSizeRecommendation = (answers: {
  [key: string]: string;
}): SizeRecommendation => {
  const currentSize = answers.current_shoe_size;
  const footWidth = answers.foot_width;

  if (!currentSize) {
    return {
      recommendedSize: 'M',
      confidence: 0,
      reasoning:
        'Please provide your current shoe size for accurate recommendation',
    };
  }

  let recommendedSize: string = currentSize;
  let confidence = 90;
  let reasoning = `Based on your current size ${currentSize}`;

  // Slides can be slightly larger for comfort
  if (footWidth === 'Wide') {
    recommendedSize = getNextSizeUp(recommendedSize);
    reasoning += ', we recommend sizing up for wider feet and comfort';
    confidence -= 5;
  } else {
    reasoning += ', our slides are designed for comfortable fit';
  }

  return {
    recommendedSize,
    confidence,
    reasoning,
  };
};

const getSocksSizeRecommendation = (answers: {
  [key: string]: string;
}): SizeRecommendation => {
  const currentSockSize = answers.current_sock_size;
  const shoeSize = answers.current_shoe_size;
  const thicknessPreference = answers.sock_thickness_preference;

  if (!currentSockSize && !shoeSize) {
    return {
      recommendedSize: 'M',
      confidence: 0,
      reasoning:
        'Please provide your current sock size or shoe size for accurate recommendation',
    };
  }

  const recommendedSize: string = currentSockSize || getSockSizeFromShoeSize(shoeSize || '9');
  let confidence = 85;
  let reasoning = `Based on your current sock size ${recommendedSize}`;

  // Thickness preference adjustments
  if (thicknessPreference === 'Thick') {
    reasoning += '. Our ProGrip socks provide excellent cushioning';
    confidence += 5;
  } else if (thicknessPreference === 'Thin') {
    reasoning += '. Our socks are designed for optimal performance';
  }

  return {
    recommendedSize,
    confidence,
    reasoning,
  };
};

// Helper functions
const getNextSizeUp = (size: string): string => {
  const sizes = [
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
    '8.5',
    '9',
    '9.5',
    '10',
    '10.5',
    '11',
    '11.5',
    '12',
  ];
  const index = sizes.indexOf(size);
  if (index !== -1 && index < sizes.length - 1) {
    return sizes[index + 1] ?? size;
  }
  return size;
};

const getSockSizeFromShoeSize = (shoeSize: string): string => {
  const size = parseFloat(shoeSize);
  if (size <= 6) return 'XS';
  if (size <= 8) return 'S';
  if (size <= 10) return 'M';
  if (size <= 12) return 'L';
  return 'XL';
};
