-- Create blog_posts table for QYVE blog system
CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(100) DEFAULT 'QYVE Team',
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, published) VALUES 
('The Science Behind Recovery: Why Your Feet Deserve Better', 
 'science-behind-recovery-feet', 
 'Discover how proper foot recovery can enhance your athletic performance and daily comfort.',
 'After an intense workout or a long day on your feet, recovery is crucial. Your feet, being the foundation of your body, deserve special attention during the recovery process.

## Understanding Foot Anatomy

The human foot contains 26 bones, 33 joints, and over 100 muscles, tendons, and ligaments. This complex structure bears the weight of your entire body and absorbs impact with every step.

## The Role of Recovery Slides

Recovery slides like the QYVE Recovery Slides are designed with specific features:

- **EVA Material**: Soft, cushioning material that molds to your foot shape
- **Ergonomic Design**: Promotes healthy foot alignment
- **Cloud-like Comfort**: Reduces pressure points and enhances circulation

## Benefits of Proper Foot Recovery

1. **Reduced Inflammation**: Proper support helps minimize swelling
2. **Improved Circulation**: Better blood flow aids in muscle recovery
3. **Pain Prevention**: Reduces the risk of plantar fasciitis and other conditions
4. **Enhanced Performance**: Well-rested feet perform better in your next activity

Make foot recovery a priority in your wellness routine. Your body will thank you.',
 'https://nddzlctewmghxowvdnxf.supabase.co/storage/v1/object/public/product-images//slides_life.jpg',
 true),

('QYVE Brand Story: From Court to Comfort', 
 'qyve-brand-story-court-comfort', 
 'Learn about the journey that led to creating premium recovery gear for athletes and everyday warriors.',
 '# From Vision to Reality

QYVE was born from a simple observation: athletes and active individuals needed better recovery solutions that didn''t compromise on style.

## The Beginning

Our founders noticed a gap in the market for recovery gear that looked as good as it felt. Traditional recovery footwear was purely functional, often lacking the aesthetic appeal that modern consumers demand.

## Design Philosophy

We believe that recovery gear should:
- **Function First**: Provide genuine therapeutic benefits
- **Style Second**: Look great in any setting
- **Quality Always**: Use premium materials that last

## Our Products

Starting with our Recovery Slides, we''ve focused on creating products that serve multiple purposes:
- Post-workout recovery
- Casual daily wear
- Travel comfort
- Home relaxation

## Looking Forward

QYVE continues to innovate in the recovery space, always with our core values in mind: quality, comfort, and style.

Join us on this journey to better recovery and superior comfort.',
 'https://nddzlctewmghxowvdnxf.supabase.co/storage/v1/object/sign/product-images/black_jersey.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0LWltYWdlcy9ibGFja19qZXJzZXkuanBlZyIsImlhdCI6MTc0MTA2ODAxNywiZXhwIjoxNzcyNjA0MDE3fQ.smwU5PhJfEliUDdQYFIcomhqX25VRE2crJ-_DwMtVdk',
 true),

('5 Ways to Improve Your Post-Workout Recovery', 
 'improve-post-workout-recovery', 
 'Simple strategies to enhance your recovery routine and get back to peak performance faster.',
 '# Maximize Your Recovery

Recovery is just as important as the workout itself. Here are five proven strategies to optimize your post-exercise routine.

## 1. Prioritize Sleep

Quality sleep is when your body does most of its repair work:
- Aim for 7-9 hours per night
- Keep your bedroom cool and dark
- Avoid screens 1 hour before bed

## 2. Proper Hydration

Water helps flush out toxins and delivers nutrients to muscles:
- Drink water throughout the day
- Add electrolytes after intense sessions
- Monitor urine color as a hydration indicator

## 3. Active Recovery

Light movement helps maintain blood flow:
- Gentle stretching
- Easy walks
- Swimming at low intensity

## 4. Nutrition Timing

What and when you eat affects recovery:
- Consume protein within 30 minutes post-workout
- Include anti-inflammatory foods
- Don''t skip meals

## 5. Proper Footwear

Your feet need recovery too:
- Use recovery slides after workouts
- Avoid walking barefoot on hard surfaces
- Give your feet proper support during downtime

Recovery isn''t passive – it''s an active part of your training that requires attention and intention.',
 'https://nddzlctewmghxowvdnxf.supabase.co/storage/v1/object/public/product-images//socks_life_2.jpg',
 true);