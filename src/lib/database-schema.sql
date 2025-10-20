-- Marketing Banners Table
CREATE TABLE IF NOT EXISTS marketing_banners (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  button_text VARCHAR(100) DEFAULT 'Subscribe Now',
  placeholder VARCHAR(255) DEFAULT 'Enter your email address',
  success_message TEXT,
  error_message TEXT,
  image_url VARCHAR(500),
  background_color VARCHAR(7) DEFAULT '#ff6b35',
  text_color VARCHAR(7) DEFAULT '#ffffff',
  button_color VARCHAR(7) DEFAULT '#000000',
  button_text_color VARCHAR(7) DEFAULT '#ffffff',
  position VARCHAR(10) DEFAULT 'bottom' CHECK (position IN ('top', 'bottom')),
  is_active BOOLEAN DEFAULT true,
  show_on_pages JSONB DEFAULT '["home", "shop", "products"]',
  hide_on_pages JSONB DEFAULT '["checkout", "success", "login", "signup"]',
  gdpr_required BOOLEAN DEFAULT true,
  gdpr_text TEXT,
  variant VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  consent BOOLEAN DEFAULT false,
  source VARCHAR(100) DEFAULT 'website',
  banner_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GDPR Consent Records Table
CREATE TABLE IF NOT EXISTS gdpr_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  marketing_consent BOOLEAN DEFAULT false,
  analytics_consent BOOLEAN DEFAULT false,
  functional_consent BOOLEAN DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banner Analytics Table
CREATE TABLE IF NOT EXISTS banner_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'click', 'subscribe', 'dismiss'
  user_email VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  page_url TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at);
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_email ON gdpr_consents(email);
CREATE INDEX IF NOT EXISTS idx_banner_analytics_banner_id ON banner_analytics(banner_id);
CREATE INDEX IF NOT EXISTS idx_banner_analytics_event_type ON banner_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_banner_analytics_created_at ON banner_analytics(created_at);

-- Insert default banner configuration
INSERT INTO marketing_banners (
  id,
  title,
  subtitle,
  description,
  button_text,
  placeholder,
  success_message,
  error_message,
  background_color,
  text_color,
  button_color,
  button_text_color,
  position,
  is_active,
  show_on_pages,
  hide_on_pages,
  gdpr_required,
  gdpr_text,
  variant
) VALUES (
  'default-marketing-banner',
  '🎉 Get 10% Off Your First Order!',
  'Join the QYVE Family',
  'Subscribe to our newsletter and be the first to know about new releases, exclusive offers, and special promotions.',
  'Subscribe Now',
  'Enter your email address',
  '🎉 Welcome to the QYVE family! Check your email for your discount code.',
  'Something went wrong. Please try again.',
  '#ff6b35',
  '#ffffff',
  '#000000',
  '#ffffff',
  'bottom',
  true,
  '["home", "shop", "products", "blog", "faqs"]',
  '["checkout", "success", "failed", "login", "signup", "admin"]',
  true,
  'I agree to receive marketing emails and understand I can unsubscribe at any time.',
  'default'
) ON CONFLICT (id) DO NOTHING;

-- Insert banner variants
INSERT INTO marketing_banners (
  id,
  title,
  subtitle,
  description,
  button_text,
  background_color,
  text_color,
  button_color,
  button_text_color,
  variant
) VALUES 
(
  'welcome-banner',
  '🏆 Welcome to QYVE!',
  'Your Premium Sports Gear Destination',
  'Get exclusive access to new releases, member-only discounts, and early access to limited editions.',
  'Join Now',
  '#1a1a1a',
  '#ffffff',
  '#ff6b35',
  '#ffffff',
  'welcome'
),
(
  'sale-banner',
  '🔥 Limited Time Sale!',
  'Up to 50% Off Selected Items',
  'Don''t miss out on our biggest sale of the year. Subscribe to get notified about flash sales and exclusive deals.',
  'Get Sale Alerts',
  '#dc2626',
  '#ffffff',
  '#ffffff',
  '#dc2626',
  'sale'
),
(
  'new-collection-banner',
  '✨ New Collection Alert!',
  'Be the First to See What''s New',
  'Get early access to our latest designs and collections before they go public.',
  'Get Early Access',
  '#7c3aed',
  '#ffffff',
  '#ffffff',
  '#7c3aed',
  'newCollection'
),
(
  'loyalty-banner',
  '💎 QYVE VIP Program',
  'Exclusive Benefits for Members',
  'Join our VIP program for free shipping, exclusive products, and special member-only events.',
  'Join VIP',
  '#059669',
  '#ffffff',
  '#ffffff',
  '#059669',
  'loyalty'
) ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_marketing_banners_updated_at 
  BEFORE UPDATE ON marketing_banners 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscribers_updated_at 
  BEFORE UPDATE ON newsletter_subscribers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gdpr_consents_updated_at 
  BEFORE UPDATE ON gdpr_consents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
