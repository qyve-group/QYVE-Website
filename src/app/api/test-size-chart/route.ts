import { NextRequest, NextResponse } from 'next/server';
import { SIZE_CHARTS, SIZE_QUESTIONNAIRE, getSizeRecommendation } from '@/data/sizeCharts';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'futsal';

    // Test size chart data
    const sizeChart = SIZE_CHARTS[category];
    if (!sizeChart) {
      return NextResponse.json({
        success: false,
        error: `No size chart found for category: ${category}`,
        availableCategories: Object.keys(SIZE_CHARTS)
      }, { status: 404 });
    }

    // Test questionnaire data
    const questionnaire = SIZE_QUESTIONNAIRE.filter(q => q.category.includes(category));

    // Test size recommendation
    const testAnswers = {
      current_shoe_size: '9',
      shoe_brand: 'Nike',
      foot_width: 'Medium'
    };
    const recommendation = getSizeRecommendation(category, testAnswers);

    return NextResponse.json({
      success: true,
      category,
      sizeChart: {
        title: sizeChart.title,
        description: sizeChart.description,
        measurementKeys: Object.keys(sizeChart.measurements),
        sizeGuide: sizeChart.sizeGuide,
        tips: sizeChart.tips
      },
      questionnaire: {
        totalQuestions: questionnaire.length,
        questions: questionnaire.map(q => ({
          id: q.id,
          question: q.question,
          type: q.type,
          required: q.required
        }))
      },
      testRecommendation: recommendation,
      availableCategories: Object.keys(SIZE_CHARTS)
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { category, answers } = await req.json();

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category is required'
      }, { status: 400 });
    }

    const recommendation = getSizeRecommendation(category, answers || {});

    return NextResponse.json({
      success: true,
      category,
      recommendation
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
