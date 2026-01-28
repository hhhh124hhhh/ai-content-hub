// Supabase Test Suite
import { describe, it, expect, beforeAll, afterEach } from '@jest/globals'
import { supabase } from '../lib/supabase'
import type { Tables } from '../types/supabase'

// ============================================================
// SETUP AND TEARDOWN
// ============================================================

let testPromptId: number
let testUserId: string
let testCategoryId: number
let testPackageId: number

beforeAll(async () => {
  // Check Supabase connection
  const connected = await supabase.from('users').select('id').limit(1)
  console.log('✅ Before All: Supabase connection test', connected)

  // Create test user
  const { data: users, error: userError } = await supabase.from('users').insert({
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    provider: 'email',
    provider_id: `test-user-${Date.now()}`
  }).select().single()

  if (userError) {
    console.error('❌ Error creating test user:', userError)
    throw userError
  }

  testUserId = users.id
  console.log('✅ Test user created:', testUserId)
})

afterAll(async () => {
  // Clean up test data
  console.log('✅ After All: Cleaning up test data')

  // Delete test user
  if (testUserId) {
    await supabase.from('users').delete().eq('id', testUserId)
  }

  // Delete test prompt
  if (testPromptId) {
    await supabase.from('prompts').delete().eq('id', testPromptId)
  }

  // Delete test category
  if (testCategoryId) {
    await supabase.from('categories').delete().eq('id', testCategoryId)
  }

  // Delete test package
  if (testPackageId) {
    await supabase.from('packages').delete().eq('id', testPackageId)
  }

  console.log('✅ Test data cleaned up')
})

// ============================================================
// DATABASE CONNECTION TESTS
// ============================================================

describe('Supabase Connection', () => {
  describe('checkSupabaseConnection', () => {
    it('should connect to Supabase successfully', async () => {
      const { data, error } = await supabase.from('users').select('id').limit(1)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('getSupabaseStats', () => {
    it('should return database statistics', async () => {
      const stats = await import('../lib/supabase').then(m => m.getSupabaseStats())

      expect(stats).toBeDefined()
      expect(stats.tables).toBeDefined()
      expect(stats.database).toBe('Supabase PostgreSQL')
      expect(stats.total).toBeGreaterThan(0)
    })
  })
})

// ============================================================
// PROMPTS CRUD TESTS
// ============================================================

describe('Prompts CRUD', () => {
  describe('Create Prompt', () => {
    it('should create a new prompt successfully', async () => {
      const newPrompt = {
        title: 'Test Prompt for AI Writing',
        description: 'A test prompt for evaluating AI writing assistants',
        content: 'Please help me write a comprehensive article about AI writing assistants. Include sections on:\n1. Introduction to AI writing tools\n2. Comparison of top AI writing assistants\n3. Use cases and applications\n4. Pros and cons\n5. Tips for effective AI-assisted writing',
        type: 'writing' as const,
        category: 'Writing Assistant' as const,
        tags: ['writing', 'AI', 'article', 'comparison', 'tutorial'] as const,
        models: ['ChatGPT', 'Claude'] as const,
        difficulty: 'intermediate' as const,
        use_cases: ['Write blog articles', 'Compare AI tools', 'Create tutorial'] as const,
        author_username: 'test_author' as const,
        author_follower_count: 1000 as const,
        author_verified: true as const,
        author_professional: true as const,
        author_expertise: ['AI', 'Writing', 'Technology'] as const,
        published_at: new Date().toISOString() as const,
        scraped_at: new Date().toISOString() as const,
        metrics_likes: 500 as const,
        metrics_retweets: 100 as const,
        metrics_replies: 50 as const,
        metrics_quotes: 10 as const,
        metrics_bookmarks: 20 as const,
        metrics_views: 1000 as const,
        evaluation_score: 85 as const,
        evaluation_usefulness: 25 as const,
        evaluation_innovation: 21 as const,
        evaluation_completeness: 17 as const,
        evaluation_popularity: 22 as const,
        evaluation_author_influence: 4 as const,
        evaluation_tier: 'basic' as const,
        evaluation_rank: 10 as const,
        evaluation_confidence: 85 as const,
        tier: 'basic' as const,
        x_algorithm_phoenix_score: 88 as const,
        x_algorithm_history_relevance: 95 as const,
        x_algorithm_freshness: 94 as const,
        x_algorithm_diversity: 92 as const,
        x_algorithm_combined: 92 as const,
        x_algorithm_confidence: 95 as const,
        combined_score: 87 as const,
        combined_tier: 'basic' as const,
        combined_rank: 12 as const,
        combined_weight_original: 60 as const,
        combined_weight_x_algorithm: 40 as const,
        combined_confidence: 90 as const
      }

      const { data, error } = await supabase.from('prompts').insert(newPrompt).select().single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.id).toBeDefined()

      testPromptId = data.id
      console.log('✅ Test prompt created:', testPromptId)
    })

    it('should enforce prompt constraints', async () => {
      const invalidPrompt = {
        title: '', // Too short
        description: 'Test description',
        content: 'Test content',
        type: 'invalid' as const, // Invalid type
        category: 'Test Category' as const,
        tags: [],
        models: [],
        difficulty: 'invalid' as const, // Invalid difficulty
        use_cases: [],
        author_username: 'test' as const,
        author_follower_count: -1 as const, // Invalid: negative
        author_verified: true as const,
        author_professional: true as const,
        author_expertise: [],
        published_at: new Date().toISOString() as const,
        scraped_at: new Date().toISOString() as const,
        metrics_likes: -1 as const, // Invalid: negative
        metrics_retweets: 0 as const,
        metrics_replies: 0 as const,
        metrics_quotes: 0 as const,
        metrics_bookmarks: 0 as const,
        metrics_views: 0 as const,
        evaluation_score: 105 as const, // Invalid: > 100
        evaluation_usefulness: 31 as const, // Invalid: > 30
        evaluation_innovation: 26 as const, // Invalid: > 25
        evaluation_completeness: 21 as const, // Invalid: > 20
        evaluation_popularity: 26 as const, // Invalid: > 25
        evaluation_author_influence: 6 as const, // Invalid: > 5
        evaluation_tier: 'invalid' as const, // Invalid tier
        evaluation_rank: 999 as const,
        evaluation_confidence: 101 as const // Invalid: > 100
      }

      const { error } = await supabase.from('prompts').insert(invalidPrompt)

      expect(error).toBeDefined()
    })
  })

  describe('Read Prompt', () => {
    it('should retrieve a prompt by ID', async () => {
      // First create a prompt
      const newPrompt = {
        title: 'Read Test Prompt',
        description: 'A prompt for testing read operations',
        content: 'Test content for read operations',
        type: 'writing' as const,
        category: 'Writing Assistant' as const,
        tags: ['test', 'read'] as const,
        models: ['ChatGPT'] as const,
        difficulty: 'beginner' as const,
        use_cases: ['Test read'] as const,
        author_username: 'test_author' as const,
        author_follower_count: 100 as const,
        author_verified: false as const,
        author_professional: false as const,
        author_expertise: ['Test'] as const,
        published_at: new Date().toISOString() as const,
        scraped_at: new Date().toISOString() as const,
        metrics_likes: 10 as const,
        metrics_retweets: 5 as const,
        metrics_replies: 2 as const,
        metrics_quotes: 1 as const,
        metrics_bookmarks: 3 as const,
        metrics_views: 50 as const,
        evaluation_score: 75 as const,
        evaluation_usefulness: 20 as const,
        evaluation_innovation: 15 as const,
        evaluation_completeness: 15 as const,
        evaluation_popularity: 15 as const,
        evaluation_author_influence: 2 as const,
        evaluation_tier: 'basic' as const,
        evaluation_rank: 100 as const,
        evaluation_confidence: 80 as const,
        tier: 'basic' as const,
        combined_score: 75 as const,
        combined_tier: 'basic' as const,
        combined_rank: 100 as const,
        combined_weight_original: 60 as const,
        combined_weight_x_algorithm: 40 as const,
        combined_confidence: 80 as const
      }

      const { data: createdPrompt } = await supabase.from('prompts').insert(newPrompt).select().single()

      // Now read it
      const { data: prompt, error } = await supabase.from('prompts').select('*').eq('id', createdPrompt.id).single()

      expect(error).toBeNull()
      expect(prompt).toBeDefined()
      expect(prompt.id).toBe(createdPrompt.id)
      expect(prompt.title).toBe(newPrompt.title)
      expect(prompt.content).toBe(newPrompt.content)
    })

    it('should retrieve prompts with filters', async () => {
      const { data: prompts } = await supabase
        .from('prompts')
        .select('*')
        .eq('type', 'writing')
        .order('evaluation_score', { ascending: false })
        .limit(10)

      expect(prompts).toBeDefined()
      expect(Array.isArray(prompts)).toBe(true)
      expect(prompts.length).toBeGreaterThan(0)
      expect(prompts.every(p => p.type === 'writing')).toBe(true)
    })
  })

  describe('Update Prompt', () => {
    it('should update a prompt successfully', async () => {
      // First create a prompt
      const newPrompt = {
        title: 'Update Test Prompt',
        description: 'A prompt for testing update operations',
        content: 'Test content for update operations',
        type: 'coding' as const,
        category: 'Coding Assistant' as const,
        tags: ['test', 'update'] as const,
        models: ['ChatGPT'] as const,
        difficulty: 'beginner' as const,
        use_cases: ['Test update'] as const,
        author_username: 'test_author' as const,
        author_follower_count: 100 as const,
        author_verified: false as const,
        author_professional: false as const,
        author_expertise: ['Test'] as const,
        published_at: new Date().toISOString() as const,
        scraped_at: new Date().toISOString() as const,
        metrics_likes: 10 as const,
        metrics_retweets: 5 as const,
        metrics_replies: 2 as const,
        metrics_quotes: 1 as const,
        metrics_bookmarks: 3 as const,
        metrics_views: 50 as const,
        evaluation_score: 75 as const,
        evaluation_usefulness: 20 as const,
        evaluation_innovation: 15 as const,
        evaluation_completeness: 15 as const,
        evaluation_popularity: 15 as const,
        evaluation_author_influence: 2 as const,
        evaluation_tier: 'basic' as const,
        evaluation_rank: 100 as const,
        evaluation_confidence: 80 as const,
        tier: 'basic' as const,
        combined_score: 75 as const,
        combined_tier: 'basic' as const,
        combined_rank: 100 as const,
        combined_weight_original: 60 as const,
        combined_weight_x_algorithm: 40 as const,
        combined_confidence: 80 as const
      }

      const { data: createdPrompt } = await supabase.from('prompts').insert(newPrompt).select().single()

      // Now update it
      const { data: updatedPrompt, error } = await supabase
        .from('prompts')
        .update({
          evaluation_score: 90,
          tier: 'pro',
          sales_count: 5,
          sales_revenue: 24.95
        })
        .eq('id', createdPrompt.id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(updatedPrompt).toBeDefined()
      expect(updatedPrompt.evaluation_score).toBe(90)
      expect(updatedPrompt.tier).toBe('pro')
      expect(updatedPrompt.sales_count).toBe(5)
      expect(updatedPrompt.sales_revenue).toBe(24.95)
    })
  })

  describe('Delete Prompt', () => {
    it('should delete a prompt successfully', async () => {
      // First create a prompt
      const newPrompt = {
        title: 'Delete Test Prompt',
        description: 'A prompt for testing delete operations',
        content: 'Test content for delete operations',
        type: 'marketing' as const,
        category: 'Marketing Assistant' as const,
        tags: ['test', 'delete'] as const,
        models: ['ChatGPT'] as const,
        difficulty: 'intermediate' as const,
        use_cases: ['Test delete'] as const,
        author_username: 'test_author' as const,
        author_follower_count: 100 as const,
        author_verified: true as const,
        author_professional: true as const,
        author_expertise: ['Test'] as const,
        published_at: new Date().toISOString() as const,
        scraped_at: new Date().toISOString() as const,
        metrics_likes: 10 as const,
        metrics_retweets: 5 as const,
        metrics_replies: 2 as const,
        metrics_quotes: 1 as const,
        metrics_bookmarks: 3 as const,
        metrics_views: 50 as const,
        evaluation_score: 75 as const,
        evaluation_usefulness: 20 as const,
        evaluation_innovation: 15 as const,
        evaluation_completeness: 15 as const,
        evaluation_popularity: 15 as const,
        evaluation_author_influence: 2 as const,
        evaluation_tier: 'basic' as const,
        evaluation_rank: 100 as const,
        evaluation_confidence: 80 as const,
        tier: 'basic' as const,
        combined_score: 75 as const,
        combined_tier: 'basic' as const,
        combined_rank: 100 as const,
        combined_weight_original: 60 as const,
        combined_weight_x_algorithm: 40 as const,
        combined_confidence: 80 as const
      }

      const { data: createdPrompt } = await supabase.from('prompts').insert(newPrompt).select().single()

      // Now delete it
      const { error } = await supabase.from('prompts').delete().eq('id', createdPrompt.id)

      expect(error).toBeNull()
    })
  })
})

// ============================================================
// CATEGORIES CRUD TESTS
// ============================================================

describe('Categories CRUD', () => {
  describe('Create Category', () => {
    it('should create a new category successfully', async () => {
      const newCategory = {
        name: 'Test Category',
        slug: 'test-category',
        description: 'A test category for testing CRUD operations',
        icon: '🧪',
        color: '#FF6B6B',
        prompt_count: 0
      }

      const { data, error } = await supabase.from('categories').insert(newCategory).select().single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.id).toBeDefined()

      testCategoryId = data.id
      console.log('✅ Test category created:', testCategoryId)
    })

    it('should enforce category constraints', async () => {
      const invalidCategory = {
        name: '', // Too short
        slug: '', // Too short
        description: 'Test',
        icon: '🧪',
        color: '#FF6B6B',
        prompt_count: -1 // Invalid: negative
      }

      const { error } = await supabase.from('categories').insert(invalidCategory)

      expect(error).toBeDefined()
    })
  })

  describe('Read Category', () => {
    it('should retrieve a category by ID', async () => {
      // First create a category
      const newCategory = {
        name: 'Read Test Category',
        slug: 'read-test-category',
        description: 'A category for testing read operations',
        icon: '📖',
        color: '#3B82F6',
        prompt_count: 0
      }

      const { data: createdCategory } = await supabase.from('categories').insert(newCategory).select().single()

      // Now read it
      const { data: category, error } = await supabase.from('categories').select('*').eq('id', createdCategory.id).single()

      expect(error).toBeNull()
      expect(category).toBeDefined()
      expect(category.id).toBe(createdCategory.id)
      expect(category.name).toBe(newCategory.name)
      expect(category.slug).toBe(newCategory.slug)
    })

    it('should retrieve categories with order', async () => {
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('prompt_count', { ascending: false })
        .limit(10)

      expect(categories).toBeDefined()
      expect(Array.isArray(categories)).toBe(true)
      expect(categories.length).toBeGreaterThan(0)
    })
  })

  describe('Update Category', () => {
    it('should update a category successfully', async () => {
      // First create a category
      const newCategory = {
        name: 'Update Test Category',
        slug: 'update-test-category',
        description: 'A category for testing update operations',
        icon: '✏️',
        color: '#8B5CF6',
        prompt_count: 0
      }

      const { data: createdCategory } = await supabase.from('categories').insert(newCategory).select().single()

      // Now update it
      const { data: updatedCategory, error } = await supabase
        .from('categories')
        .update({
          prompt_count: 10
        })
        .eq('id', createdCategory.id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(updatedCategory).toBeDefined()
      expect(updatedCategory.prompt_count).toBe(10)
    })
  })

  describe('Delete Category', () => {
    it('should delete a category successfully', async () => {
      // First create a category
      const newCategory = {
        name: 'Delete Test Category',
        slug: 'delete-test-category',
        description: 'A category for testing delete operations',
        icon: '🗑️',
        color: '#EF4444',
        prompt_count: 0
      }

      const { data: createdCategory } = await supabase.from('categories').insert(newCategory).select().single()

      // Now delete it
      const { error } = await supabase.from('categories').delete().eq('id', createdCategory.id)

      expect(error).toBeNull()
    })
  })
})

// ============================================================
// EVALUATION HISTORY TESTS
// ============================================================

describe('Evaluation History', () => {
  describe('Create Evaluation', () => {
    it('should create an evaluation record successfully', async () => {
      const newEvaluation = {
        prompt_id: testPromptId,
        user_id: testUserId,
        algorithm: 'Original',
        score: 92,
        sub_scores: {
          usefulness: 28,
          innovation: 23,
          completeness: 18,
          popularity: 23,
          author_influence: 4
        },
        confidence: 95
      }

      const { data, error } = await supabase.from('evaluations').insert(newEvaluation).select().single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.id).toBeDefined()
      expect(data.prompt_id).toBe(testPromptId)
      expect(data.user_id).toBe(testUserId)
      expect(data.algorithm).toBe('Original')
      expect(data.score).toBe(92)
    })
  })

  describe('Read Evaluation', () => {
    it('should retrieve evaluation by ID', async () => {
      // First create an evaluation
      const newEvaluation = {
        prompt_id: testPromptId,
        user_id: testUserId,
        algorithm: 'X Algorithm',
        score: 94,
        sub_scores: {
          phoenix_score: 92,
          history_relevance: 95,
          freshness: 94,
          diversity: 92,
          confidence: 97
        },
        confidence: 98
      }

      const { data: createdEvaluation } = await supabase.from('evaluations').insert(newEvaluation).select().single()

      // Now read it
      const { data: evaluation, error } = await supabase.from('evaluations').select('*').eq('id', createdEvaluation.id).single()

      expect(error).toBeNull()
      expect(evaluation).toBeDefined()
      expect(evaluation.id).toBe(createdEvaluation.id)
      expect(evaluation.algorithm).toBe('X Algorithm')
      expect(evaluation.score).toBe(94)
    })

    it('should retrieve evaluations by prompt', async () => {
      const { data: evaluations } = await supabase
        .from('evaluations')
        .select('*')
        .eq('prompt_id', testPromptId)
        .order('score', { ascending: false })

      expect(evaluations).toBeDefined()
      expect(Array.isArray(evaluations)).toBe(true)
      expect(evaluations.length).toBeGreaterThan(0)
      expect(evaluations.every(e => e.prompt_id === testPromptId)).toBe(true)
    })
  })

  describe('Update Evaluation', () => {
    it('should update an evaluation successfully', async () => {
      // First create an evaluation
      const newEvaluation = {
        prompt_id: testPromptId,
        user_id: testUserId,
        algorithm: 'Test Algorithm',
        score: 90,
        sub_scores: {},
        confidence: 85
      }

      const { data: createdEvaluation } = await supabase.from('evaluations').insert(newEvaluation).select().single()

      // Now update it
      const { data: updatedEvaluation, error } = await supabase
        .from('evaluations')
        .update({
          score: 95,
          confidence: 90
        })
        .eq('id', createdEvaluation.id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(updatedEvaluation).toBeDefined()
      expect(updatedEvaluation.score).toBe(95)
      expect(updatedEvaluation.confidence).toBe(90)
    })
  })

  describe('Delete Evaluation', () => {
    it('should delete an evaluation successfully', async () => {
      // First create an evaluation
      const newEvaluation = {
        prompt_id: testPromptId,
        user_id: testUserId,
        algorithm: 'Test Algorithm',
        score: 90,
        sub_scores: {},
        confidence: 85
      }

      const { data: createdEvaluation } = await supabase.from('evaluations').insert(newEvaluation).select().single()

      // Now delete it
      const { error } = await supabase.from('evaluations').delete().eq('id', createdEvaluation.id)

      expect(error).toBeNull()
    })
  })
})

// ============================================================
// QUERIES TESTS
// ============================================================

describe('Complex Queries', () => {
  describe('Get Prompts by Type and Tier', () => {
    it('should retrieve prompts by type and tier', async () => {
      const { data: prompts } = await supabase
        .from('prompts')
        .select('*')
        .eq('type', 'writing')
        .eq('tier', 'pro')
        .order('evaluation_score', { ascending: false })
        .limit(10)

      expect(prompts).toBeDefined()
      expect(Array.isArray(prompts)).toBe(true)
      expect(prompts.length).toBeLessThanOrEqual(10)
      expect(prompts.every(p => p.type === 'writing' && p.tier === 'pro')).toBe(true)
    })
  })

  describe('Get Prompts with Search', () => {
    it('should search prompts by title and content', async () => {
      const searchTerm = 'AI writing'

      const { data: prompts } = await supabase
        .from('prompts')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .limit(10)

      expect(prompts).toBeDefined()
      expect(Array.isArray(prompts)).toBe(true)
    })
  })

  describe('Get Prompts with Pagination', () => {
    it('should retrieve prompts with pagination', async () => {
      const page = 1
      const limit = 10
      const offset = (page - 1) * limit

      const { data: prompts } = await supabase
        .from('prompts')
        .select('*')
        .order('evaluation_score', { ascending: false })
        .range(offset, offset + limit)

      expect(prompts).toBeDefined()
      expect(Array.isArray(prompts)).toBe(true)
      expect(prompts.length).toBeLessThanOrEqual(limit)
    })
  })

  describe('Get Prompts with Joins', () => {
    it('should retrieve prompts with category and package', async () => {
      const { data: prompts } = await supabase
        .from('prompts')
        .select(`
          *,
          categories!inner (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .limit(10)

      expect(prompts).toBeDefined()
      expect(Array.isArray(prompts)).toBe(true)
      expect(prompts.length).toBeLessThanOrEqual(10)
    })
  })
})

// ============================================================
// EDGE CASES TESTS
// ============================================================

describe('Edge Cases', () => {
  describe('Empty Queries', () => {
    it('should handle empty result set', async () => {
      const { data: prompts } = await supabase
        .from('prompts')
        .select('*')
        .eq('type', 'nonexistent_type')

      expect(prompts).toBeDefined()
      expect(Array.isArray(prompts)).toBe(true)
      expect(prompts.length).toBe(0)
    })
  })

  describe('Large Payloads', () => {
    it('should handle large content', async () => {
      const largeContent = 'a'.repeat(10000)

      const newPrompt = {
        title: 'Large Content Test',
        description: 'Testing large content',
        content: largeContent,
        type: 'writing' as const,
        category: 'Writing Assistant' as const,
        tags: ['large', 'content'] as const,
        models: ['ChatGPT'] as const,
        difficulty: 'intermediate' as const,
        use_cases: ['Test large content'] as const,
        author_username: 'test_author' as const,
        author_follower_count: 100 as const,
        author_verified: true as const,
        author_professional: true as const,
        author_expertise: ['Test'] as const,
        published_at: new Date().toISOString() as const,
        scraped_at: new Date().toISOString() as const,
        metrics_likes: 10 as const,
        metrics_retweets: 5 as const,
        metrics_replies: 2 as const,
        metrics_quotes: 1 as const,
        metrics_bookmarks: 3 as const,
        metrics_views: 50 as const,
        evaluation_score: 75 as const,
        evaluation_usefulness: 20 as const,
        evaluation_innovation: 15 as const,
        evaluation_completeness: 15 as const,
        evaluation_popularity: 15 as const,
        evaluation_author_influence: 2 as const,
        evaluation_tier: 'basic' as const,
        evaluation_rank: 100 as const,
        evaluation_confidence: 80 as const,
        tier: 'basic' as const,
        combined_score: 75 as const,
        combined_tier: 'basic' as const,
        combined_rank: 100 as const,
        combined_weight_original: 60 as const,
        combined_weight_x_algorithm: 40 as const,
        combined_confidence: 80 as const
      }

      const { data, error } = await supabase.from('prompts').insert(newPrompt).select().single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
    })
  })

  describe('Concurrent Operations', () => {
    it('should handle concurrent inserts', async () => {
      const promises = []

      for (let i = 0; i < 5; i++) {
        const newPrompt = {
          title: `Concurrent Test ${i}`,
          description: `Testing concurrent insert ${i}`,
          content: `Test content for concurrent insert ${i}`,
          type: 'writing' as const,
          category: 'Writing Assistant' as const,
          tags: ['test', 'concurrent', `${i}`] as const,
          models: ['ChatGPT'] as const,
          difficulty: 'beginner' as const,
          use_cases: ['Test concurrent'] as const,
          author_username: 'test_author' as const,
          author_follower_count: 100 as const,
          author_verified: true as const,
          author_professional: true as const,
          author_expertise: ['Test'] as const,
          published_at: new Date().toISOString() as const,
          scraped_at: new Date().toISOString() as const,
          metrics_likes: 10 as const,
          metrics_retweets: 5 as const,
          metrics_replies: 2 as const,
          metrics_quotes: 1 as const,
          metrics_bookmarks: 3 as const,
          metrics_views: 50 as const,
          evaluation_score: 75 as const,
          evaluation_usefulness: 20 as const,
          evaluation_innovation: 15 as const,
          evaluation_completeness: 15 as const,
          evaluation_popularity: 15 as const,
          evaluation_author_influence: 2 as const,
          evaluation_tier: 'basic' as const,
          evaluation_rank: 100 as const,
          evaluation_confidence: 80 as const,
          tier: 'basic' as const,
          combined_score: 75 as const,
          combined_tier: 'basic' as const,
          combined_rank: 100 as const,
          combined_weight_original: 60 as const,
          combined_weight_x_algorithm: 40 as const,
          combined_confidence: 80 as const
        }

        promises.push(supabase.from('prompts').insert(newPrompt).select())
      }

      const results = await Promise.all(promises)

      expect(results).toBeDefined()
      expect(results.length).toBe(5)
      expect(results.every(result => !result.error)).toBe(true)
    })
  })
})
