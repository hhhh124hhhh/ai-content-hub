-- Supabase SQL Schema for AI Prompt Marketplace
-- AI Prompt Marketplace Database Schema

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
  tags JSONB NOT NULL DEFAULT '[]',
  models JSONB NOT NULL DEFAULT '[]',
  difficulty prompt_difficulty NOT NULL,
  use_cases JSONB NOT NULL DEFAULT '[]',
  
  -- Author
  author_username TEXT NOT NULL CHECK (length(author_username) >= 1 AND length(author_username) <= 100),
  author_avatar TEXT,
  author_follower_count INTEGER NOT NULL DEFAULT 0,
  author_verified BOOLEAN NOT NULL DEFAULT false,
  author_professional BOOLEAN NOT NULL DEFAULT false,
  author_expertise JSONB NOT NULL DEFAULT '[]',
  
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
  evaluation_score NUMERIC NOT NULL CHECK (evaluation_score >= 0 AND evaluation_score <= 100),
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
-- SEED DATA
-- ============================================================

-- Seed Categories
INSERT INTO categories (name, slug, description, icon, color, prompt_count) VALUES
  ('Writing Assistant', 'writing-assistant', 'High-quality writing prompts for ChatGPT and other AI models', '✍️', '#3b82f6', 254),
  ('Coding Assistant', 'coding-assistant', 'Expert coding prompts and algorithm explanations', '💻', '#8b5cf6', 186),
  ('Marketing Assistant', 'marketing-assistant', 'Marketing and copywriting prompts for businesses', '📢', '#ef4444', 142),
  ('Design Assistant', 'design-assistant', 'UI/UX and graphic design prompts', '🎨', '#f97316', 128),
  ('Analysis Assistant', 'analysis-assistant', 'Data analysis and visualization prompts', '📊', '#10b981', 98),
  ('Other', 'other', 'Miscellaneous AI prompts for various use cases', '📚', '#64748b', 67);

-- Seed Packages
INSERT INTO packages (name, slug, description, category, tier, price_single, price_monthly, price_yearly, original_price_single, original_price_monthly, original_price_yearly, prompt_ids, active) VALUES
  ('Starter Pack', 'starter-pack', 'Perfect for beginners getting started with AI prompts', 'Other', 'basic', 4.99, 4.99, 49.99, 9.99, 9.99, 99.99, ARRAY[]::BIGINT[], true),
  ('Pro Pack', 'pro-pack', 'All the pro prompts you need for professional work', 'Other', 'pro', 14.99, 19.99, 199.99, 29.99, 39.99, 399.99, ARRAY[]::BIGINT[], true),
  ('Premium Pack', 'premium-pack', 'Premium prompts with guaranteed quality', 'Other', 'premium', 49.99, 69.99, 699.99, 99.99, 139.99, 1399.99, ARRAY[]::BIGINT[], true);

-- Seed Users (Admin User)
INSERT INTO users (email, name, provider, provider_id, subscription_tier, subscription_status) VALUES
  ('admin@ai-prompt-marketplace.com', 'Admin', 'email', 'admin-user-123', 'premium', 'active');

-- Seed Evaluations (History)
INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence)
VALUES
  (1, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 92, '{"usefulness": 28, "innovation": 23, "completeness": 18, "popularity": 23, "author_influence": 5}', 95);

-- ============================================================
-- COMMIT
-- ============================================================

COMMIT;
