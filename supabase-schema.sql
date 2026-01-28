-- Supabase SQL Schema for AI Prompt Marketplace (Fixed - No Special Characters)
-- AI Prompt Marketplace Database Schema - Fixed Version (No Special Characters in Strings)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Users Table
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'premium', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'incomplete');
CREATE TYPE user_provider AS ENUM ('email', 'google', 'github');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE CHECK (length(email) >= 5 AND length(email) <= 100),
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  avatar_url TEXT,
  provider user_provider NOT NULL DEFAULT 'email',
  provider_id TEXT NOT NULL CHECK (length(provider_id) >= 1),
  
  -- Subscription
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_plan TEXT,
  subscription_status subscription_status NOT NULL DEFAULT 'active',
  subscription_current_period_start TIMESTAMP WITH TIME ZONE,
  subscription_current_period_end TIMESTAMP WITH TIME ZONE,
  subscription_cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  subscription_canceled_at TIMESTAMP WITH TIME ZONE,
  subscription_stripe_customer_id TEXT,
  subscription_stripe_subscription_id TEXT,
  
  -- Favorites and Purchases
  favorites UUID[] NOT NULL DEFAULT '{}',
  purchases UUID[] NOT NULL DEFAULT '{}',
  
  -- Usage Tracking
  usage_prompts_viewed INTEGER NOT NULL DEFAULT 0,
  usage_prompts_purchased INTEGER NOT NULL DEFAULT 0,
  usage_prompts_evaluated INTEGER NOT NULL DEFAULT 0,
  usage_last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Prompts Table
-- ============================================================

CREATE TYPE prompt_type AS ENUM ('writing', 'coding', 'marketing', 'design', 'analysis', 'other');
CREATE TYPE prompt_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE evaluation_tier AS ENUM ('free', 'basic', 'pro', 'premium');

CREATE TABLE prompts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
  description TEXT NOT NULL CHECK (length(description) >= 1 AND length(description) <= 500),
  content TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 10000),
  type prompt_type NOT NULL,
  category TEXT NOT NULL CHECK (length(category) >= 1 AND length(category) <= 100),
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  models JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty prompt_difficulty NOT NULL,
  use_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Author
  author_username TEXT NOT NULL CHECK (length(author_username) >= 1 AND length(author_username) <= 100),
  author_avatar TEXT,
  author_follower_count INTEGER NOT NULL DEFAULT 0,
  author_verified BOOLEAN NOT NULL DEFAULT false,
  author_professional BOOLEAN NOT NULL DEFAULT false,
  author_expertise JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Metadata
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metrics
  metrics_likes INTEGER NOT NULL DEFAULT 0,
  metrics_retweets INTEGER NOT NULL DEFAULT 0,
  metrics_replies INTEGER NOT NULL DEFAULT 0,
  metrics_quotes INTEGER NOT NULL DEFAULT 0,
  metrics_bookmarks INTEGER NOT NULL DEFAULT 0,
  metrics_views INTEGER NOT NULL DEFAULT 0,
  
  -- Original Evaluation
  evaluation_score NUMERIC NOT NULL DEFAULT 0 CHECK (evaluation_score >= 0 AND evaluation_score <= 100),
  evaluation_usefulness NUMERIC NOT NULL DEFAULT 0 CHECK (evaluation_usefulness >= 0 AND evaluation_usefulness <= 30),
  evaluation_innovation NUMERIC NOT NULL DEFAULT 0 CHECK (evaluation_innovation >= 0 AND evaluation_innovation <= 25),
  evaluation_completeness NUMERIC NOT NULL DEFAULT 0 CHECK (evaluation_completeness >= 0 AND evaluation_completeness <= 20),
  evaluation_popularity NUMERIC NOT NULL DEFAULT 0 CHECK (evaluation_popularity >= 0 AND evaluation_popularity <= 25),
  evaluation_author_influence NUMERIC NOT NULL DEFAULT 0 CHECK (evaluation_author_influence >= 0 AND evaluation_author_influence <= 5),
  evaluation_tier evaluation_tier NOT NULL DEFAULT 'free',
  evaluation_rank INTEGER NOT NULL DEFAULT 999,
  evaluation_confidence NUMERIC NOT NULL DEFAULT 0 CHECK (evaluation_confidence >= 0 AND evaluation_confidence <= 100),
  
  -- Tier
  tier evaluation_tier NOT NULL DEFAULT 'free',
  
  -- X Algorithm
  x_algorithm_phoenix_score NUMERIC NOT NULL DEFAULT 0 CHECK (x_algorithm_phoenix_score >= 0 AND x_algorithm_phoenix_score <= 100),
  x_algorithm_history_relevance NUMERIC NOT NULL DEFAULT 0 CHECK (x_algorithm_history_relevance >= 0 AND x_algorithm_history_relevance <= 100),
  x_algorithm_freshness NUMERIC NOT NULL DEFAULT 0 CHECK (x_algorithm_freshness >= 0 AND x_algorithm_freshness <= 100),
  x_algorithm_diversity NUMERIC NOT NULL DEFAULT 0 CHECK (x_algorithm_diversity >= 0 AND x_algorithm_diversity <= 100),
  x_algorithm_combined NUMERIC NOT NULL DEFAULT 0 CHECK (x_algorithm_combined >= 0 AND x_algorithm_combined <= 100),
  x_algorithm_confidence NUMERIC NOT NULL DEFAULT 0 CHECK (x_algorithm_confidence >= 0 AND x_algorithm_confidence <= 100),
  
  -- Combined Evaluation
  combined_score NUMERIC NOT NULL DEFAULT 0 CHECK (combined_score >= 0 AND combined_score <= 100),
  combined_tier evaluation_tier NOT NULL,
  combined_rank INTEGER NOT NULL DEFAULT 999,
  combined_weight_original NUMERIC NOT NULL DEFAULT 60 CHECK (combined_weight_original >= 0 AND combined_weight_original <= 100),
  combined_weight_x_algorithm NUMERIC NOT NULL DEFAULT 40 CHECK (combined_weight_x_algorithm >= 0 AND combined_weight_x_algorithm <= 100),
  combined_confidence NUMERIC NOT NULL DEFAULT 0 CHECK (combined_confidence >= 0 AND combined_confidence <= 100),
  
  -- Sales
  sales_count INTEGER NOT NULL DEFAULT 0,
  sales_revenue NUMERIC NOT NULL DEFAULT 0,
  sales_last_sale TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CHECK (
    length(title) >= 1 AND length(title) <= 200 AND
    length(description) >= 1 AND length(description) <= 500 AND
    length(content) >= 1 AND length(content) <= 10000 AND
    length(category) >= 1 AND length(category) <= 100 AND
    length(author_username) >= 1 AND length(author_username) <= 100
  )
);

-- ============================================================
-- Categories Table
-- ============================================================

CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  slug TEXT NOT NULL UNIQUE CHECK (length(slug) >= 1 AND length(slug) <= 100),
  description TEXT NOT NULL CHECK (length(description) >= 10 AND length(description) <= 500),
  icon TEXT NOT NULL CHECK (length(icon) >= 1 AND length(icon) <= 50),
  color TEXT NOT NULL CHECK (length(color) >= 1 AND length(color) <= 50),
  prompt_count INTEGER NOT NULL DEFAULT 0,
  
  -- Constraints
  CHECK (
    length(name) >= 1 AND length(name) <= 100 AND
    length(slug) >= 1 AND length(slug) <= 100 AND
    length(description) >= 10 AND length(description) <= 500 AND
    length(icon) >= 1 AND length(icon) <= 50 AND
    length(color) >= 1 AND length(color) <= 50
  )
);

-- ============================================================
-- Packages Table
-- ============================================================

CREATE TYPE package_tier AS ENUM ('free', 'basic', 'pro', 'premium', 'enterprise');

CREATE TABLE packages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 200),
  slug TEXT NOT NULL UNIQUE CHECK (length(slug) >= 1 AND length(slug) <= 200),
  description TEXT NOT NULL CHECK (length(description) >= 10 AND length(description) <= 1000),
  category TEXT NOT NULL CHECK (length(category) >= 1 AND length(category) <= 100),
  prompt_ids BIGINT[] NOT NULL DEFAULT '{}',
  tier package_tier NOT NULL DEFAULT 'basic',
  
  price_single NUMERIC NOT NULL DEFAULT 0 CHECK (price_single >= 0),
  price_monthly NUMERIC NOT NULL DEFAULT 0 CHECK (price_monthly >= 0),
  price_yearly NUMERIC NOT NULL DEFAULT 0 CHECK (price_yearly >= 0),
  
  original_price_single NUMERIC NOT NULL DEFAULT 0 CHECK (original_price_single >= 0),
  original_price_monthly NUMERIC NOT NULL DEFAULT 0 CHECK (original_price_monthly >= 0),
  original_price_yearly NUMERIC NOT NULL DEFAULT 0 CHECK (original_price_yearly >= 0),
  
  discount_percentage NUMERIC NOT NULL DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discount_valid_until TIMESTAMP WITH TIME ZONE,
  
  sales_count INTEGER NOT NULL DEFAULT 0,
  sales_revenue NUMERIC NOT NULL DEFAULT 0,
  
  active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  CHECK (
    length(name) >= 1 AND length(name) <= 200 AND
    length(slug) >= 1 AND length(slug) <= 200 AND
    length(description) >= 10 AND length(description) <= 1000 AND
    length(category) >= 1 AND length(category) <= 100 AND
    price_single >= 0 AND price_monthly >= 0 AND price_yearly >= 0 AND
    original_price_single >= 0 AND original_price_monthly >= 0 AND original_price_yearly >= 0
  )
);

-- ============================================================
-- Evaluations Table (History)
-- ============================================================

CREATE TABLE evaluations (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  prompt_id BIGINT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  algorithm TEXT NOT NULL CHECK (length(algorithm) >= 1 AND length(algorithm) <= 100),
  score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 100),
  sub_scores JSONB,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  
  -- Constraints
  CHECK (
    length(algorithm) >= 1 AND length(algorithm) <= 100
  )
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Users Indexes
CREATE UNIQUE INDEX users_email_unique ON users(email);
CREATE UNIQUE INDEX users_provider_id_unique ON users(provider_id);
CREATE INDEX users_name_idx ON users(name);
CREATE INDEX users_subscription_tier_idx ON users(subscription_tier);
CREATE INDEX users_created_at_idx ON users(created_at DESC);

-- Prompts Indexes
CREATE INDEX prompts_title_content_gin ON prompts USING gin(to_tsvector('english', title));
CREATE INDEX prompts_evaluation_score_idx ON prompts(evaluation_score DESC);
CREATE INDEX prompts_combined_score_idx ON prompts(combined_score DESC);
CREATE INDEX prompts_tier_idx ON prompts(tier);
CREATE INDEX prompts_type_idx ON prompts(type);
CREATE INDEX prompts_category_idx ON prompts(category);
CREATE INDEX prompts_tags_idx ON prompts USING gin(tags);
CREATE INDEX prompts_difficulty_idx ON prompts(difficulty);
CREATE INDEX prompts_author_username_idx ON prompts(author_username);
CREATE INDEX prompts_scraped_at_idx ON prompts(scraped_at DESC);
CREATE INDEX prompts_published_at_idx ON prompts(published_at DESC);

-- Categories Indexes
CREATE INDEX categories_name_idx ON categories(name);
CREATE UNIQUE INDEX categories_slug_unique ON categories(slug);
CREATE INDEX categories_prompt_count_idx ON categories(prompt_count DESC);

-- Packages Indexes
CREATE INDEX packages_name_idx ON packages(name);
CREATE UNIQUE INDEX packages_slug_unique ON packages(slug);
CREATE INDEX packages_category_idx ON packages(category);
CREATE INDEX packages_tier_idx ON packages(tier);
CREATE INDEX packages_active_idx ON packages(active);
CREATE INDEX packages_price_idx ON packages(price_single);
CREATE INDEX packages_sales_revenue_idx ON packages(sales_revenue DESC);

-- Evaluations Indexes
CREATE INDEX evaluations_prompt_user_idx ON evaluations(prompt_id, user_id, algorithm);
CREATE INDEX evaluations_score_idx ON evaluations(score DESC);
CREATE INDEX evaluations_created_at_idx ON evaluations(created_at DESC);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable Row Level Security on Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own user"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = provider_id);

CREATE POLICY "Users can update their own user"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = provider_id);

-- Enable RLS on other tables
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Create Public Policies (for read access)
CREATE POLICY "Prompts are viewable by everyone"
  ON prompts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Packages are viewable by everyone"
  ON packages FOR SELECT
  TO public
  USING (true);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Function to calculate prompt evaluation score
CREATE OR REPLACE FUNCTION calculate_prompt_score(
  p_usefulness NUMERIC,
  p_innovation NUMERIC,
  p_completeness NUMERIC,
  p_popularity NUMERIC,
  p_author_influence NUMERIC
)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (
    (p_usefulness * 0.3) +
    (p_innovation * 0.25) +
    (p_completeness * 0.2) +
    (p_popularity * 0.25)
  );
END;
$$ LANGUAGE plpgsql;

-- Function to determine prompt tier
CREATE OR REPLACE FUNCTION determine_prompt_tier(score NUMERIC)
RETURNS evaluation_tier AS $$
BEGIN
  IF score >= 90 THEN
    RETURN 'premium';
  ELSIF score >= 85 THEN
    RETURN 'pro';
  ELSIF score >= 80 THEN
    RETURN 'basic';
  ELSIF score >= 70 THEN
    RETURN 'basic';
  ELSIF score >= 60 THEN
    RETURN 'basic';
  ELSE
    RETURN 'free';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

-- Procedure to update all prompt ranks
CREATE OR REPLACE PROCEDURE update_all_prompt_ranks()
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update original evaluation ranks
  UPDATE prompts
  SET evaluation_rank = (
    SELECT COUNT(*) + 1
    FROM prompts p2
    WHERE p2.evaluation_score > prompts.evaluation_score
  );
  
  -- Update combined evaluation ranks
  UPDATE prompts
  SET combined_rank = (
    SELECT COUNT(*) + 1
    FROM prompts p2
    WHERE p2.combined_score > prompts.combined_score
  );
END;
$$;

-- ============================================================
-- SEED DATA (No Special Characters in Strings)
-- ============================================================

-- Seed Users (Admin User)
INSERT INTO users (email, name, provider, provider_id, subscription_tier, subscription_status, created_at, updated_at)
VALUES
  ('admin@ai-prompt-marketplace.com', 'Admin', 'email', 'admin-user-123', 'premium', 'active', NOW(), NOW());

-- Seed Categories
INSERT INTO categories (name, slug, description, icon, color, prompt_count, created_at, updated_at)
VALUES
  ('Writing Assistant', 'writing-assistant', 'High-quality writing prompts for ChatGPT and other AI models', 'Pencil', '#3b82f6', 254, NOW(), NOW()),
  ('Coding Assistant', 'coding-assistant', 'Expert coding prompts and algorithm explanations', 'Computer', '#8b5cf6', 186, NOW(), NOW()),
  ('Marketing Assistant', 'marketing-assistant', 'Marketing and copywriting prompts for businesses', 'Megaphone', '#ef4444', 142, NOW(), NOW()),
  ('Design Assistant', 'design-assistant', 'UI/UX and graphic design prompts', 'Palette', '#f97316', 128, NOW(), NOW()),
  ('Analysis Assistant', 'analysis-assistant', 'Data analysis and visualization prompts', 'Bar Chart', '#10b981', 98, NOW(), NOW()),
  ('Other', 'other', 'Miscellaneous AI prompts for various use cases', 'Rocket', '#64748b', 67, NOW(), NOW());

-- Seed Packages
INSERT INTO packages (name, slug, description, category, tier, price_single, price_monthly, price_yearly, original_price_single, original_price_monthly, original_price_yearly, prompt_ids, active, created_at, updated_at)
VALUES
  ('Starter Pack', 'starter-pack', 'Perfect for beginners getting started with AI prompts', 'Other', 'basic', 4.99, 4.99, 49.99, 9.99, 9.99, 99.99, ARRAY[]::BIGINT[], true, NOW(), NOW()),
  ('Pro Pack', 'pro-pack', 'All the pro prompts you need for professional work', 'Other', 'pro', 14.99, 19.99, 199.99, 29.99, 39.99, 399.99, ARRAY[]::BIGINT[], true, NOW(), NOW()),
  ('Premium Pack', 'premium-pack', 'Premium prompts with guaranteed quality', 'Other', 'premium', 49.99, 69.99, 699.99, 99.99, 139.99, 1399.99, ARRAY[]::BIGINT[], true, NOW(), NOW());

-- Seed Prompts (High-quality Chinese prompts)
INSERT INTO prompts (
  created_at, updated_at,
  title, description, content,
  type, category, tags, models, difficulty, use_cases,
  author_username, author_avatar, author_follower_count, author_verified, author_professional, author_expertise,
  published_at, scraped_at,
  metrics_likes, metrics_retweets, metrics_replies, metrics_quotes, metrics_bookmarks, metrics_views,
  evaluation_score, evaluation_usefulness, evaluation_innovation, evaluation_completeness, evaluation_popularity, evaluation_author_influence,
  evaluation_tier, evaluation_rank, evaluation_confidence,
  tier,
  x_algorithm_phoenix_score, x_algorithm_history_relevance, x_algorithm_freshness, x_algorithm_diversity, x_algorithm_combined, x_algorithm_confidence,
  combined_score, combined_tier, combined_rank, combined_weight_original, combined_weight_x_algorithm, combined_confidence,
  sales_count, sales_revenue, sales_last_sale
) VALUES
  -- Prompt 1
  (NOW(), NOW(),
  'ChatGPT Writing Prompt - High Quality',
  'This is an excellent ChatGPT writing prompt with complete steps and examples.',
  'You are a professional writing assistant. Please help me complete the following tasks:

Tasks:
1. Determine the writing topic
2. Write the article outline
3. Write the article body
4. Edit and optimize content
5. Add images and references

Requirements:
- Article length: 1500-2000 words
- Tone: professional and accessible
- Format: engaging and clear

Please start executing.',
  'writing', 'Writing Assistant', ARRAY['writing', 'ChatGPT', 'AI writing', 'article', 'outline']::JSONB, ARRAY['ChatGPT', 'Claude']::JSONB, 'intermediate',
  ARRAY['Write blog articles', 'Write outlines', 'Write article body', 'Edit and optimize content', 'Add images']::JSONB,
  'promptMaster', null, 50000, true, true, ARRAY['AI', 'Writing', 'Technology']::JSONB,
  '2026-01-28 00:00:00', NOW(),
  500, 100, 50, 10, 20,
  28, 23, 18, 23, 5,
  'basic', 10,
  'basic', 92, 95,
  'basic',
  88, 95, 94, 92, 95,
  92, 92, 92,
  92, 87,
  'basic',
  92, 87,
  0, null
  ),
  -- Prompt 2
  (NOW(), NOW(),
  'ChatGPT Coding Prompt - Practical',
  'This is a practical ChatGPT coding prompt to help developers improve productivity.',
  'You are a professional coding assistant. Please help me complete the following tasks:

Tasks:
1. Write a function
2. Add error handling
3. Write unit tests
4. Optimize performance

Requirements:
- Language: TypeScript
- Code style: clean and maintainable
- Comments: detailed and clear

Please start executing.',
  'coding', 'Coding Assistant', ARRAY['coding', 'ChatGPT', 'code', 'TypeScript', 'function', 'tests']::JSONB, ARRAY['ChatGPT', 'Claude']::JSONB, 'beginner',
  ARRAY['Write functions', 'Add error handling', 'Write unit tests', 'Optimize performance']::JSONB,
  'devGuru', null, 25000, false, true, ARRAY['coding', 'Technology', 'code']::JSONB,
  '2026-01-27 00:00:00', NOW(),
  250, 50, 30, 10, 5,
  27, 21, 17, 23, 4,
  'basic', 11,
  'basic', 90,
  'basic',
  88, 90, 88, 88,
  88, 88,
  'basic',
  88, 88,
  0, null
  ),
  -- Prompt 3
  (NOW(), NOW(),
  'ChatGPT Marketing Prompt - Creative',
  'This is a creative ChatGPT marketing prompt to help marketers create engaging content.',
  'You are a professional marketing assistant. Please help me complete the following tasks:

Tasks:
1. Write product introduction
2. Create ad copy
3. Design marketing campaign
4. Write social media content

Requirements:
- Tone: engaging and professional
- Format: creative and innovative
- Platforms: LinkedIn, Twitter, Facebook

Please start executing.',
  'marketing', 'Marketing Assistant', ARRAY['marketing', 'ChatGPT', 'ads', 'social media', 'creative', 'content']::JSONB, ARRAY['ChatGPT', 'Claude']::JSONB, 'advanced',
  ARRAY['Write product intro', 'Create ad copy', 'Design marketing campaign', 'Write social media content']::JSONB,
  'marketingGenius', null, 10000, true, false, ARRAY['marketing', 'ads', 'social media']::JSONB,
  '2026-01-26 00:00:00', NOW(),
  100, 40, 20, 10, 5,
  24, 19, 17, 22, 3,
  'basic', 13,
  'basic', 82,
  'basic',
  80, 82, 80, 80,
  80, 80,
  'basic',
  80, 80,
  0, null
  ),
  -- Prompt 4
  (NOW(), NOW(),
  'ChatGPT Design Prompt - Elegant',
  'This is an elegant ChatGPT design prompt to help designers create beautiful works.',
  'You are a professional design assistant. Please help me complete the following tasks:

Tasks:
1. Design UI layout
2. Select color scheme
3. Create design system
4. Add visual effects

Requirements:
- Style: modern and elegant
- Colors: coordinated and professional
- Components: reusable and modular

Please start executing.',
  'design', 'Design Assistant', ARRAY['design', 'ChatGPT', 'UI', 'UX', 'layout', 'colors']::JSONB, ARRAY['ChatGPT', 'Claude', 'Midjourney']::JSONB, 'intermediate',
  ARRAY['Design UI layout', 'Select color scheme', 'Create design system', 'Add visual effects']::JSONB,
  'designMaster', null, 20000, true, false, ARRAY['design', 'UI', 'UX']::JSONB,
  '2026-01-25 00:00:00', NOW(),
  200, 30, 15, 10, 5,
  22, 20, 16, 21, 4,
  'basic', 14,
  'basic', 78,
  'basic',
  78, 78, 78,
  78, 78,
  'basic',
  78, 78,
  0, null
  ),
  -- Prompt 5
  (NOW(), NOW(),
  'ChatGPT Analysis Prompt - Professional',
  'This is a professional ChatGPT analysis prompt to help analysts process complex data.',
  'You are a professional analysis assistant. Please help me complete the following tasks:

Tasks:
1. Data cleaning
2. Statistical analysis
3. Visualization design
4. Report writing

Requirements:
- Methods: scientific and rigorous
- Tools: Python, Pandas, Matplotlib
- Output: charts and reports

Please start executing.',
  'analysis', 'Analysis Assistant', ARRAY['analysis', 'ChatGPT', 'data', 'statistics', 'visualization', 'reports']::JSONB, ARRAY['ChatGPT', 'Claude']::JSONB, 'advanced',
  ARRAY['Data cleaning', 'Statistical analysis', 'Visualization design', 'Report writing']::JSONB,
  'dataAnalyst', null, 30000, true, false, ARRAY['data', 'statistics', 'analysis']::JSONB,
  '2026-01-24 00:00:00', NOW(),
  300, 60, 12, 12, 5,
  25, 21, 18, 22, 4,
  'basic', 15,
  'basic', 80,
  'basic',
  80, 80, 80,
  80, 80,
  'basic',
  80, 80,
  0, null
  ),
  -- Prompt 6
  (NOW(), NOW(),
  'ChatGPT Comprehensive Prompt - Complete',
  'This is a comprehensive ChatGPT prompt to help users complete various tasks.',
  'You are a comprehensive ChatGPT assistant. Please help me complete the following tasks:

Tasks:
1. Answer questions
2. Provide suggestions
3. Create plans
4. Execute tasks

Requirements:
- Capability: comprehensive and professional
- Format: adaptable and flexible
- Quality: high quality and accurate

Please start executing.',
  'other', 'Other', ARRAY['comprehensive', 'ChatGPT', 'multi-task', 'general', 'efficient']::JSONB, ARRAY['ChatGPT', 'Claude']::JSONB, 'beginner',
  ARRAY['Answer questions', 'Provide suggestions', 'Create plans', 'Execute tasks']::JSONB,
  'aiAssistant', null, 15000, false, false, ARRAY['AI', 'general']::JSONB,
  '2026-01-23 00:00:00', NOW(),
  150, 40, 8, 12, 5,
  23, 17, 15, 21, 4,
  'basic', 12,
  'basic', 75,
  'basic',
  75, 75, 75,
  75, 75,
  'basic',
  75, 75,
  0, null
  ),
  -- Prompt 7
  (NOW(), NOW(),
  'ChatGPT Writing Prompt - Fast',
  'This is a fast ChatGPT writing prompt to help users quickly generate content.',
  'You are a fast writing assistant. Please help me complete the following tasks:

Tasks:
1. Quickly write article
2. Quickly generate outline
3. Quickly edit and optimize
4. Quickly add images

Requirements:
- Speed: fast and efficient
- Quality: excellent and accurate
- Format: concise and clear

Please start executing.',
  'writing', 'Writing Assistant', ARRAY['writing', 'ChatGPT', 'fast', 'efficient', 'concise']::JSONB, ARRAY['ChatGPT', 'Claude']::JSONB, 'beginner',
  ARRAY['Quickly write articles', 'Quickly generate outlines', 'Quickly edit and optimize', 'Quickly add images']::JSONB,
  'fastWriter', null, 10000, false, false, ARRAY['writing', 'fast', 'efficient']::JSONB,
  '2026-01-22 00:00:00', NOW(),
  100, 20, 8, 12, 5,
  20, 15, 12, 20, 3,
  'basic', 10,
  'basic', 72,
  'basic',
  72, 72, 72,
  72, 72,
  'basic',
  72, 72,
  0, null
  ),
  -- Prompt 8
  (NOW(), NOW(),
  'ChatGPT Coding Prompt - Debugging',
  'This is a professional ChatGPT coding prompt to help developers debug code.',
  'You are a professional debugging assistant. Please help me complete the following tasks:

Tasks:
1. Analyze error messages
2. Provide solutions
3. Optimize code performance
4. Add logging

Requirements:
- Methods: scientific and systematic
- Tools: Python, Node.js, Chrome DevTools
- Output: clear solutions

Please start executing.',
  'coding', 'Coding Assistant', ARRAY['coding', 'ChatGPT', 'debug', 'errors', 'logs', 'optimization']::JSONB, ARRAY['ChatGPT', 'Claude']::JSONB, 'advanced',
  ARRAY['Analyze error messages', 'Provide solutions', 'Optimize code performance', 'Add logging']::JSONB,
  'debugExpert', null, 15000, false, true, ARRAY['coding', 'debug', 'optimization']::JSONB,
  '2026-01-21 00:00:00', NOW(),
  150, 30, 10, 10, 5,
  25, 21, 16, 21, 5,
  'basic', 16,
  'basic', 77,
  'basic',
  77, 77, 77,
  77, 77,
  'basic',
  77, 77,
  0, null
  ),
  -- Prompt 9
  (NOW(), NOW(),
  'ChatGPT Marketing Prompt - Conversion',
  'This is a high-conversion ChatGPT marketing prompt to help marketers improve conversion rates.',
  'You are a professional conversion rate optimization assistant. Please help me complete the following tasks:

Tasks:
1. Write high-conversion copy
2. Optimize landing page
3. Design conversion funnel
4. Add A/B testing

Requirements:
- Strategy: data-driven and scientific
- Format: professional and persuasive
- Goal: improve conversion rate

Please start executing.',
  'marketing', 'Marketing Assistant', ARRAY['marketing', 'ChatGPT', 'conversion', 'A/B testing', 'landing page', 'copy']::JSONB, ARRAY['ChatGPT', 'Claude']::JSONB, 'advanced',
  ARRAY['Write high-conversion copy', 'Optimize landing page', 'Design conversion funnel', 'Add A/B testing']::JSONB,
  'conversionExpert', null, 20000, false, false, ARRAY['marketing', 'conversion', 'optimization']::JSONB,
  '2026-01-20 00:00:00', NOW(),
  200, 40, 10, 12, 5,
  23, 19, 17, 21, 4,
  'basic', 17,
  'basic', 79,
  'basic',
  79, 79, 79,
  79, 79,
  'basic',
  79, 79,
  0, null
  ),
  -- Prompt 10
  (NOW(), NOW(),
  'ChatGPT Design Prompt - Modern',
  'This is a modern ChatGPT design prompt to help designers create modern works.',
  'You are a modern design assistant. Please help me complete the following tasks:

Tasks:
1. Create modern UI design
2. Select modern color scheme
3. Apply modern design principles
4. Add modern visual effects

Requirements:
- Style: modern, concise, elegant
- Colors: modern, coordinated, vibrant
- Principles: responsive and modular

Please start executing.',
  'design', 'Design Assistant', ARRAY['design', 'ChatGPT', 'modern', 'responsive', 'modular', 'concise']::JSONB, ARRAY['ChatGPT', 'Claude', 'Midjourney']::JSONB, 'intermediate',
  ARRAY['Create modern UI design', 'Select modern color scheme', 'Apply modern design principles', 'Add modern visual effects']::JSONB,
  'modernDesigner', null, 18000, false, false, ARRAY['design', 'modern', 'responsive']::JSONB,
  '2026-01-19 00:00:00', NOW(),
  180, 36, 10, 10, 5,
  22, 20, 16, 21, 4,
  'basic', 18,
  'basic', 80,
  'basic',
  80, 80, 80,
  80, 80,
  'basic',
  80, 80,
  0, null
  );

-- Seed Evaluations (History) - Using actual user ID
INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  1,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  92,
  '{"usefulness": 28, "innovation": 23, "completeness": 18, "popularity": 23, "author_influence": 5}'::JSONB,
  95,
  NOW(),
  NOW()
UNION ALL
SELECT
  2,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  90,
  '{"usefulness": 27, "innovation": 21, "completeness": 17, "popularity": 25, "author_influence": 4}'::JSONB,
  90,
  NOW(),
  NOW()
UNION ALL
SELECT
  3,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  88,
  '{"usefulness": 26, "innovation": 20, "completeness": 17, "popularity": 25, "author_influence": 4}'::JSONB,
  88,
  NOW(),
  NOW()
UNION ALL
SELECT
  4,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  85,
  '{"usefulness": 25, "innovation": 20, "completeness": 16, "popularity": 24, "author_influence": 4}'::JSONB,
  85,
  NOW(),
  NOW()
UNION ALL
SELECT
  5,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  82,
  '{"usefulness": 24, "innovation": 19, "completeness": 16, "popularity": 23, "author_influence": 4}'::JSONB,
  82,
  NOW(),
  NOW()
UNION ALL
SELECT
  6,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  80,
  '{"usefulness": 23, "innovation": 18, "completeness": 16, "popularity": 23, "author_influence": 4}'::JSONB,
  80,
  NOW(),
  NOW()
UNION ALL
SELECT
  7,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  78,
  '{"usefulness": 22, "innovation": 17, "completeness": 16, "popularity": 23, "author_influence": 4}'::JSONB,
  78,
  NOW(),
  NOW()
UNION ALL
SELECT
  8,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  76,
  '{"usefulness": 21, "innovation": 17, "completeness": 15, "popularity": 23, "author_influence": 3}'::JSONB,
  76,
  NOW(),
  NOW()
UNION ALL
SELECT
  9,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  75,
  '{"usefulness": 20, "innovation": 17, "completeness": 15, "popularity": 22, "author_influence": 3}'::JSONB,
  75,
  NOW(),
  NOW()
UNION ALL
SELECT
  10,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  73,
  '{"usefulness": 19, "innovation": 16, "completeness": 14, "popularity": 22, "author_influence": 3}'::JSONB,
  73,
  NOW(),
  NOW()
UNION ALL
-- X Algorithm Evaluations (referencing prompts 1-10)
SELECT
  1,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  94,
  '{"phoenix_score": 92, "history_relevance": 95, "freshness": 94, "diversity": 92, "confidence": 97}'::JSONB,
  98,
  NOW(),
  NOW()
UNION ALL
SELECT
  2,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  92,
  '{"phoenix_score": 90, "history_relevance": 93, "freshness": 94, "diversity": 91, "confidence": 96}'::JSONB,
  94,
  NOW(),
  NOW()
UNION ALL
SELECT
  3,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  89,
  '{"phoenix_score": 88, "history_relevance": 91, "freshness": 89, "diversity": 88, "confidence": 91}'::JSONB,
  91,
  NOW(),
  NOW()
UNION ALL
SELECT
  4,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  87,
  '{"phoenix_score": 86, "history_relevance": 88, "freshness": 86, "diversity": 85, "confidence": 87}'::JSONB,
  87,
  NOW(),
  NOW()
UNION ALL
SELECT
  5,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  85,
  '{"phoenix_score": 84, "history_relevance": 86, "freshness": 84, "diversity": 83, "confidence": 85}'::JSONB,
  84,
  NOW(),
  NOW()
UNION ALL
SELECT
  6,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  82,
  '{"phoenix_score": 82, "history_relevance": 84, "freshness": 83, "diversity": 81, "confidence": 83}'::JSONB,
  82,
  NOW(),
  NOW()
UNION ALL
SELECT
  7,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  80,
  '{"phoenix_score": 80, "history_relevance": 82, "freshness": 81, "diversity": 79, "confidence": 80}'::JSONB,
  79,
  NOW(),
  NOW()
UNION ALL
SELECT
  8,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  78,
  '{"phoenix_score": 78, "history_relevance": 80, "freshness": 79, "diversity": 77, "confidence": 78}'::JSONB,
  78,
  NOW(),
  NOW()
UNION ALL
SELECT
  9,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  75,
  '{"phoenix_score": 75, "history_relevance": 77, "freshness": 76, "diversity": 74, "confidence": 75}'::JSONB,
  74,
  NOW(),
  NOW()
UNION ALL
SELECT
  10,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  72,
  '{"phoenix_score": 72, "history_relevance": 74, "freshness": 73, "diversity": 71, "confidence": 72}'::JSONB,
  71,
  NOW(),
  NOW();

-- ============================================================
-- COMMIT
-- ============================================================

COMMIT;
