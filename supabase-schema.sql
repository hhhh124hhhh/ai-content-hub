-- Supabase SQL Schema for AI Prompt Marketplace (Fixed - Correct Insert Order)
-- AI Prompt Marketplace Database Schema - Fixed Version

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
    original_price_single >= 0 AND original_price_monthly >= 0 AND original_price_yearly >= 0 AND
    discount_percentage >= 0 AND discount_percentage <= 100
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
-- SEED DATA (Correct Order)
-- ============================================================

-- Step 1: Seed Users (First)
INSERT INTO users (email, name, provider, provider_id, subscription_tier, subscription_status, created_at, updated_at)
VALUES
  ('admin@ai-prompt-marketplace.com', 'Admin', 'email', 'admin-user-123', 'premium', 'active', NOW(), NOW());

-- Step 2: Seed Prompts (Second - Before Evaluations)
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
  'ChatGPT写作提示词 - 高质量',
  '这是一个优秀的ChatGPT写作提示词，包含完整的步骤和示例。',
  '你是一个专业的写作助手。请帮助我完成以下任务：

步骤：
1. 确定写作主题
2. 撰写文章大纲
3. 根据大纲撰写正文
4. 编辑和优化内容
5. 添加图片和引用

要求：
- 文章长度：1500-2000字
- 语调：专业、易懂
- 风格：引人入胜

请开始执行。',
  'writing', 'Writing Assistant', '["writing", "ChatGPT", "AI写作", "文章", "大纲", "内容"]', '["ChatGPT", "Claude"]', 'intermediate',
  '["写博客文章", "撰写大纲", "撰写正文", "编辑优化", "添加图片"]',
  'promptMaster', 'https://avatar.url', 50000, true, true, '["AI", "写作", "技术"]',
  '2026-01-28 00:00:00', NOW(),
  500, 100, 50, 10, 20,
  28, 23, 18, 23, 5,
  'basic', 10,
  'basic', 92, 95,
  'basic',
  88, 95, 94, 92, 95,
  92, 92, 92, 92,
  92, 87,
  'basic',
  92, 87,
  0, 0, null
  ),
  
  -- Prompt 2
  (NOW(), NOW(),
  'ChatGPT编程提示词 - 实用',
  '这是一个实用的ChatGPT编程提示词，帮助开发者提高效率。',
  '你是一个专业的编程助手。请帮助我完成以下任务：

任务：
1. 编写一个函数
2. 添加错误处理
3. 添加单元测试
4. 优化性能

要求：
- 语言：TypeScript
- 代码风格：整洁、可维护
- 注释：详细、清晰

请开始执行。',
  'coding', 'Coding Assistant', '["编程", "ChatGPT", "代码", "TypeScript", "函数", "测试"]', '["ChatGPT", "Claude"]', 'beginner',
  '["编写函数", "添加错误处理", "编写单元测试", "优化性能"]',
  'devGuru', 'https://avatar.url', 25000, false, true, '["编程", "技术", "代码"]',
  '2026-01-27 00:00:00', NOW(),
  250, 50, 30, 10, 5,
  27, 21, 17, 23, 4,
  'basic', 11,
  'basic', 90,
  'basic', 88, 90, 88, 88,
  88, 88,
  'basic',
  88, 88,
  0, 0, null
  ),
  
  -- Prompt 3
  (NOW(), NOW(),
  'ChatGPT营销提示词 - 创意',
  '这是一个有创意的ChatGPT营销提示词，帮助营销人员创建吸引人的内容。',
  '你是一个专业的营销助手。请帮助我完成以下任务：

任务：
1. 撰写产品介绍
2. 创建广告文案
3. 设计营销活动
4. 撰写社交媒体内容

要求：
- 语调：吸引人、专业
- 风格：创意、创新
- 平台：LinkedIn, Twitter, Facebook

请开始执行。',
  'marketing', 'Marketing Assistant', '["营销", "ChatGPT", "广告", "社交媒体", "创意", "内容"]', '["ChatGPT", "Claude"]', 'advanced',
  '["撰写产品介绍", "创建广告文案", "设计营销活动", "撰写社交媒体内容"]',
  'marketingGenius', 'https://avatar.url', 10000, true, false, '["营销", "广告", "社交媒体"]',
  '2026-01-26 00:00:00', NOW(),
  100, 40, 20, 10, 5,
  24, 19, 17, 22, 3,
  'basic', 13,
  'basic', 82,
  'basic', 80, 82, 80, 80,
  80, 80,
  'basic',
  80, 80,
  0, 0, null
  ),
  
  -- Prompt 4
  (NOW(), NOW(),
  'ChatGPT设计提示词 - 优雅',
  '这是一个优雅的ChatGPT设计提示词，帮助设计师创建精美的作品。',
  '你是一个专业的设计助手。请帮助我完成以下任务：

任务：
1. 设计UI布局
2. 选择颜色方案
3. 创建设计系统
4. 添加视觉效果

要求：
- 风格：现代、优雅
- 配色：协调、专业
- 组件：可复用、模块化

请开始执行。',
  'design', 'Design Assistant', '["设计", "ChatGPT", "UI", "UX", "布局", "颜色"]', '["ChatGPT", "Claude", "Midjourney"]', 'intermediate',
  '["设计UI布局", "选择颜色方案", "创建设计系统", "添加视觉效果"]',
  'designMaster', 'https://avatar.url', 20000, true, false, '["设计", "UI", "UX"]',
  '2026-01-25 00:00:00', NOW(),
  200, 30, 15, 10, 5,
  22, 20, 16, 21, 4,
  'basic', 14,
  'basic', 78,
  'basic', 78, 78, 78, 78,
  78, 78,
  'basic',
  78, 78,
  0, 0, null
  ),
  
  -- Prompt 5
  (NOW(), NOW(),
  'ChatGPT分析提示词 - 专业',
  '这是一个专业的ChatGPT分析提示词，帮助分析师处理复杂的数据。',
  '你是一个专业的分析助手。请帮助我完成以下任务：

任务：
1. 数据清洗
2. 统计分析
3. 可视化设计
4. 报告撰写

要求：
- 方法：科学、严谨
- 工具：Python, Pandas, Matplotlib
- 输出：图表、报告

请开始执行。',
  'analysis', 'Analysis Assistant', '["分析", "ChatGPT", "数据", "统计", "可视化", "报告"]', '["ChatGPT", "Claude"]', 'advanced',
  '["数据清洗", "统计分析", "可视化设计", "报告撰写"]',
  'dataAnalyst', 'https://avatar.url', 30000, true, false, '["数据", "统计", "分析"]',
  '2026-01-24 00:00:00', NOW(),
  300, 60, 12, 12, 5,
  25, 21, 18, 22, 4,
  'basic', 15,
  'basic', 80,
  'basic', 80, 80, 80, 80,
  80, 80,
  'basic',
  80, 80,
  0, 0, null
  ),
  
  -- Prompt 6
  (NOW(), NOW(),
  'ChatGPT综合提示词 - 全面',
  '这是一个全面的ChatGPT综合提示词，帮助用户完成各种任务。',
  '你是一个全面的ChatGPT助手。请帮助我完成以下任务：

任务：
1. 回答问题
2. 提供建议
3. 创建计划
4. 执行任务

要求：
- 能力：全面、专业
- 风格：适应性强、灵活
- 质量：高质量、准确

请开始执行。',
  'other', 'Other', '["综合", "ChatGPT", "多任务", "通用", "高效"]', '["ChatGPT", "Claude"]', 'beginner',
  '["回答问题", "提供建议", "创建计划", "执行任务"]',
  'aiAssistant', 'https://avatar.url', 15000, false, false, '["AI", "通用"]',
  '2026-01-23 00:00:00', NOW(),
  150, 40, 8, 12, 5,
  23, 17, 15, 21, 4,
  'basic', 12,
  'basic', 75,
  'basic', 75, 75, 75, 75,
  75, 75,
  'basic',
  75, 75,
  0, 0, null
  ),
  
  -- Prompt 7
  (NOW(), NOW(),
  'ChatGPT写作提示词 - 快速',
  '这是一个快速的ChatGPT写作提示词，帮助用户快速生成内容。',
  '你是一个快速的写作助手。请帮助我完成以下任务：

任务：
1. 快速撰写文章
2. 快速生成大纲
3. 快速编辑优化
4. 快速添加图片

要求：
- 速度：快速、高效
- 质量：优秀、准确
- 风格：简洁、明了

请开始执行。',
  'writing', 'Writing Assistant', '["写作", "ChatGPT", "快速", "高效", "简洁"]', '["ChatGPT", "Claude"]', 'beginner',
  '["快速撰写文章", "快速生成大纲", "快速编辑优化", "快速添加图片"]',
  'fastWriter', 'https://avatar.url', 10000, false, false, '["写作", "快速", "高效"]',
  '2026-01-22 00:00:00', NOW(),
  100, 20, 8, 12, 5,
  20, 15, 12, 20, 3,
  'basic', 10,
  'basic', 72,
  'basic', 72, 72, 72, 72,
  72, 72,
  'basic',
  72, 72,
  0, 0, null
  ),
  
  -- Prompt 8
  (NOW(), NOW(),
  'ChatGPT编程提示词 - 调试',
  '这是一个专业的ChatGPT编程提示词，帮助开发者调试代码。',
  '你是一个专业的调试助手。请帮助我完成以下任务：

任务：
1. 分析错误信息
2. 提供解决方案
3. 优化代码性能
4. 添加日志记录

要求：
- 方法：科学、系统
- 工具：Python, Node.js, Chrome DevTools
- 输出：清晰的解决方案

请开始执行。',
  'coding', 'Coding Assistant', '["编程", "ChatGPT", "调试", "错误", "日志", "优化"]', '["ChatGPT", "Claude"]', 'advanced',
  '["分析错误信息", "提供解决方案", "优化代码性能", "添加日志记录"]',
  'debugExpert', 'https://avatar.url', 15000, false, true, '["编程", "调试", "优化"]',
  '2026-01-21 00:00:00', NOW(),
  150, 30, 10, 10, 5,
  25, 21, 16, 21, 5,
  'basic', 16,
  'basic', 77,
  'basic', 77, 77, 77, 77,
  77, 77,
  'basic',
  77, 77,
  0, 0, null
  ),
  
  -- Prompt 9
  (NOW(), NOW(),
  'ChatGPT营销提示词 - 转化',
  '这是一个高转化的ChatGPT营销提示词，帮助营销人员提高转化率。',
  '你是一个专业的转化率优化助手。请帮助我完成以下任务：

任务：
1. 撰写高转化文案
2. 优化落地页
3. 设计转化漏斗
4. 添加A/B测试

要求：
- 策略：数据驱动、科学
- 风格：专业、有说服力
- 目标：提高转化率

请开始执行。',
  'marketing', 'Marketing Assistant', '["营销", "ChatGPT", "转化", "A/B测试", "落地页", "文案"]', '["ChatGPT", "Claude"]', 'advanced',
  '["撰写高转化文案", "优化落地页", "设计转化漏斗", "添加A/B测试"]',
  'conversionExpert', 'https://avatar.url', 20000, false, false, '["营销", "转化", "优化"]',
  '2026-01-20 00:00:00', NOW(),
  200, 40, 10, 12, 5,
  23, 19, 17, 21, 4,
  'basic', 17,
  'basic', 79,
  'basic', 79, 79, 79, 79,
  79, 79,
  'basic',
  79, 79,
  0, 0, null
  ),
  
  -- Prompt 10
  (NOW(), NOW(),
  'ChatGPT设计提示词 - 现代',
  '这是一个现代的ChatGPT设计提示词，帮助设计师创建现代化的作品。',
  '你是一个现代的设计助手。请帮助我完成以下任务：

任务：
1. 创建现代UI设计
2. 选择现代配色方案
3. 应用现代设计原则
4. 添加现代视觉效果

要求：
- 风格：现代、简洁、优雅
- 配色：现代、协调、鲜艳
- 原则：响应式、模块化

请开始执行。',
  'design', 'Design Assistant', '["设计", "ChatGPT", "现代", "响应式", "模块化", "简洁"]', '["ChatGPT", "Claude", "Midjourney"]', 'intermediate',
  '["创建现代UI设计", "选择现代配色方案", "应用现代设计原则", "添加现代视觉效果"]',
  'modernDesigner', 'https://avatar.url', 18000, false, false, '["设计", "现代", "响应式"]',
  '2026-01-19 00:00:00', NOW(),
  180, 36, 10, 10, 5,
  22, 20, 16, 21, 4,
  'basic', 18,
  'basic', 80,
  'basic', 80, 80, 80, 80,
  80, 80,
  'basic',
  80, 80,
  0, 0, null
  );

-- Step 3: Seed Categories (Third)
INSERT INTO categories (name, slug, description, icon, color, prompt_count, created_at, updated_at)
VALUES
  ('Writing Assistant', 'writing-assistant', 'High-quality writing prompts for ChatGPT and other AI models', '✍️', '#3b82f6', 254, NOW(), NOW()),
  ('Coding Assistant', 'coding-assistant', 'Expert coding prompts and algorithm explanations', '💻', '#8b5cf6', 186, NOW(), NOW()),
  ('Marketing Assistant', 'marketing-assistant', 'Marketing and copywriting prompts for businesses', '📢', '#ef4444', 142, NOW(), NOW()),
  ('Design Assistant', 'design-assistant', 'UI/UX and graphic design prompts', '🎨', '#f97316', 128, NOW(), NOW()),
  ('Analysis Assistant', 'analysis-assistant', 'Data analysis and visualization prompts', '📊', '#10b981', 98, NOW(), NOW()),
  ('Other', 'other', 'Miscellaneous AI prompts for various use cases', '📚', '#64748b', 67, NOW(), NOW());

-- Step 4: Seed Packages (Fourth)
INSERT INTO packages (name, slug, description, category, tier, price_single, price_monthly, price_yearly, original_price_single, original_price_monthly, original_price_yearly, prompt_ids, active, created_at, updated_at)
VALUES
  ('Starter Pack', 'starter-pack', 'Perfect for beginners getting started with AI prompts', 'Other', 'basic', 4.99, 4.99, 49.99, 9.99, 9.99, 99.99, ARRAY[]::BIGINT[], true, NOW(), NOW()),
  ('Pro Pack', 'pro-pack', 'All to pro prompts you need for professional work', 'Other', 'pro', 14.99, 19.99, 199.99, 29.99, 39.99, 399.99, ARRAY[]::BIGINT[], true, NOW(), NOW()),
  ('Premium Pack', 'premium-pack', 'Premium prompts with guaranteed quality', 'Other', 'premium', 49.99, 69.99, 699.99, 99.99, 139.99, 1399.99, ARRAY[]::BIGINT[], true, NOW(), NOW());

-- Step 5: Seed Evaluations (Fifth - After Prompts)
-- Note: These refer to the prompts we just inserted (id 1-10)
INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
VALUES
  (1, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 92, '{"usefulness": 28, "innovation": 23, "completeness": 18, "popularity": 23, "author_influence": 5}'::jsonb, 95, NOW(), NOW()),
  (2, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 90, '{"usefulness": 27, "innovation": 21, "completeness": 17, "popularity": 25, "author_influence": 4}'::jsonb, 90, NOW(), NOW()),
  (3, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 88, '{"usefulness": 26, "innovation": 20, "completeness": 17, "popularity": 25, "author_influence": 4}'::jsonb, 88, NOW(), NOW()),
  (4, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 85, '{"usefulness": 25, "innovation": 20, "completeness": 16, "popularity": 24, "author_influence": 4}'::jsonb, 85, NOW(), NOW()),
  (5, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 82, '{"usefulness": 24, "innovation": 19, "completeness": 16, "popularity": 23, "author_influence": 4}'::jsonb, 82, NOW(), NOW()),
  (6, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 80, '{"usefulness": 23, "innovation": 18, "completeness": 16, "popularity": 23, "author_influence": 4}'::jsonb, 80, NOW(), NOW()),
  (7, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 78, '{"usefulness": 22, "innovation": 17, "completeness": 16, "popularity': 23, 'author_influence': 4}'::jsonb, 78, NOW(), NOW()),
  (8, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 76, '{"usefulness": 21, 'innovation': 17, 'completeness': 15, 'popularity': 23, 'author_influence': 3}'::jsonb, 76, NOW(), NOW()),
  (9, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 75, '{"usefulness": 20, 'innovation': 17, 'completeness': 15, 'popularity': 23, 'author_influence': 3}'::jsonb, 75, NOW(), NOW()),
  (10, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'Original', 73, '{"usefulness": 19, 'innovation": 16, 'completeness': 14, 'popularity': 22, 'author_influence': 3}'::jsonb, 73, NOW(), NOW());

-- X Algorithm Evaluations (also referencing prompts 1-10)
INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
VALUES
  (1, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 94, '{"phoenix_score": 92, "history_relevance": 95, "freshness": 94, "diversity": 92, "confidence": 97}'::jsonb, 98, NOW(), NOW()),
  (2, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 92, '{"phoenix_score": 90, "history_relevance": 93, "freshness": 94, "diversity": 91, "confidence": 96}'::jsonb, 94, NOW(), NOW()),
  (3, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 89, '{"phoenix_score": 88, "history_relevance": 89, "freshness": 89, "diversity": 88, "confidence": 90}'::jsonb, 91, NOW(), NOW()),
  (4, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 87, '{"phoenix_score": 86, "history_relevance": 87, "freshness": 86, "diversity": 85, "confidence": 87}'::jsonb, 87, NOW(), NOW()),
  (5, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 84, '{"phoenix_score": 84, "history_relevance": 85, 'freshness': 84, "diversity": 83, 'confidence': 85}'::jsonb, 84, NOW(), NOW()),
  (6, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 82, '{"phoenix_score": 82, "history_relevance": 83, "freshness": 82, 'diversity": 81, "confidence": 83}'::jsonb, 82, NOW(), NOW()),
  (7, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 80, '{"phoenix_score": 80, "history_relevance": 81, 'freshness': 79, 'diversity': 79, 'confidence': 80}'::jsonb, 79, NOW(), NOW()),
  (8, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 78, '{"phoenix_score": 78, "history_relevance": 79, 'freshness': 78, 'diversity': 77, 'confidence': 78}'::jsonb, 78, NOW(), NOW()),
  (9, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 75, '{"phoenix_score": 75, "history_relevance": 76, "freshness": 76, "diversity": 75, "confidence": 76}'::jsonb, 75, NOW(), NOW()),
  (10, (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'), 'X Algorithm', 72, '{"phoenix_score": 72, 'history_relevance': 73, 'freshness': 72, "diversity": 71, "confidence": 72}'::jsonb, 72, NOW(), NOW());

-- ============================================================
-- COMMIT
-- ============================================================

COMMIT;
