-- Seed Data for AI Prompt Marketplace
-- AI Prompt Marketplace Seed Data

-- ============================================================
-- SEED EVALUATIONS (History)
-- ============================================================

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  1,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  92,
  '{"usefulness": 28, "innovation": 23, "completeness": 18, "popularity": 23, "author_influence": 5}'::jsonb,
  95,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  2,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  88,
  '{"usefulness": 27, "innovation": 21, "completeness": 17, "popularity": 23, "author_influence": 4}'::jsonb,
  90,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  3,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  85,
  '{"usefulness": 25, "innovation": 20, "completeness": 17, "popularity": 23, "author_influence": 4}'::jsonb,
  88,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  4,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  82,
  '{"usefulness": 24, "innovation": 19, "completeness": 16, "popularity": 23, "author_influence": 4}'::jsonb,
  85,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  5,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  80,
  '{"usefulness": 24, "innovation": 18, "completeness": 16, "popularity": 22, "author_influence": 4}'::jsonb,
  82,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  6,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  78,
  '{"usefulness": 23, "innovation": 17, "completeness": 16, "popularity": 22, "author_influence": 4}'::jsonb,
  80,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  7,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  75,
  '{"usefulness": 22, "innovation": 17, "completeness": 15, "popularity": 21, "author_influence": 4}'::jsonb,
  78,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  8,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  72,
  '{"usefulness": 21, "innovation": 16, "completeness": 14, "popularity": 21, "author_influence": 3}'::jsonb,
  75,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  9,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  68,
  '{"usefulness": 20, "innovation": 15, "completeness": 14, "popularity": 19, "author_influence": 3}'::jsonb,
  70,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  10,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'Original',
  65,
  '{"usefulness": 19, "innovation": 15, "completeness": 13, "popularity": 18, "author_influence": 3}'::jsonb,
  68,
  NOW(),
  NOW();

-- ============================================================
-- SEED X ALGORITHM EVALUATIONS
-- ============================================================

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  1,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  94,
  '{"phoenix_score": 92, "history_relevance": 95, "freshness": 94, "diversity": 92, "confidence": 97}'::jsonb,
  98,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  2,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  90,
  '{"phoenix_score": 88, "history_relevance": 91, "freshness": 92, "diversity": 89, "confidence": 95}'::jsonb,
  92,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  3,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  87,
  '{"phoenix_score": 86, "history_relevance": 89, "freshness": 87, "diversity": 86, "confidence": 90}'::jsonb,
  89,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  4,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  84,
  '{"phoenix_score": 84, "history_relevance": 86, "freshness": 84, "diversity": 83, "confidence": 87}'::jsonb,
  86,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  5,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  82,
  '{"phoenix_score": 82, "history_relevance": 84, "freshness": 82, "diversity": 81, "confidence": 85}'::jsonb,
  84,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  6,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  80,
  '{"phoenix_score": 80, "history_relevance": 82, "freshness": 81, "diversity": 79, "confidence": 83}'::jsonb,
  82,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  7,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  78,
  '{"phoenix_score": 78, "history_relevance": 80, "freshness": 79, "diversity": 77, "confidence": 80}'::jsonb,
  79,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  8,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  75,
  '{"phoenix_score": 76, "history_relevance": 78, "freshness": 77, "diversity": 75, "confidence": 77}'::jsonb,
  76,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  9,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  72,
  '{"phoenix_score": 72, "history_relevance": 75, "freshness": 74, "diversity": 72, "confidence": 74}'::jsonb,
  73,
  NOW(),
  NOW();

INSERT INTO evaluations (prompt_id, user_id, algorithm, score, sub_scores, confidence, created_at, updated_at)
SELECT
  10,
  (SELECT id FROM users WHERE email = 'admin@ai-prompt-marketplace.com'),
  'X Algorithm',
  70,
  '{"phoenix_score": 70, "history_relevance": 72, "freshness": 71, "diversity": 69, "confidence": 71}'::jsonb,
  71,
  NOW(),
  NOW();

-- ============================================================
-- COMMIT
-- ============================================================

COMMIT;
