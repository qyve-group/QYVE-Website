/* eslint-disable import/no-named-as-default */

import { createClient } from '@supabase/supabase-js';

import SubZeroFAQs from './SubZeroFAQs';
import SubZeroFeatures from './SubZeroFeatures';
import SubZeroHero from './SubZeroHero';
import SubZeroPreOrder from './SubZeroPreOrder';
import SubZeroSizeChart from './SubZeroSizeChart';
import SubZeroStickyCTA from './SubZeroStickyCTA';
import SubZeroTestimonials from './SubZeroTestimonials';
import SubZeroTrustBadges from './SubZeroTrustBadges';

async function getSubZeroProduct() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { price: 218, previous_price: 238 };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: product } = await supabase
    .from('products')
    .select('price, previous_price')
    .eq('slug', 'subzero')
    .single();

  return product || { price: 218, previous_price: 238 };
}

const SubZeroPage = async () => {
  const product = await getSubZeroProduct();
  const price = product.price;
  const previousPrice = product.previous_price;
  const savings = previousPrice - price;

  return (
    <div className="pb-20 lg:pb-0">
      {/* SubZero Landing Page Sections */}
      <SubZeroHero price={price} previousPrice={previousPrice} savings={savings} />
      <SubZeroTrustBadges />
      <SubZeroFeatures />
      <SubZeroPreOrder />
      <SubZeroSizeChart />
      <SubZeroTestimonials />
      <SubZeroFAQs />

      {/* Sticky CTA for Mobile */}
      <SubZeroStickyCTA price={price} previousPrice={previousPrice} />
    </div>
  );
};

export default SubZeroPage;
