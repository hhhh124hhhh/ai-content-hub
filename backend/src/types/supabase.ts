// Supabase Types
import { Database } from './supabase-types';

// ============================================================
// TABLE TYPES
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | Json[] }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          name: string
          slug: string
          description: string
          icon: string
          color: string
          prompt_count: number
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          description: string
          icon: string
          color: string
          prompt_count?: number
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          description?: string
          icon?: string
          color?: string
          prompt_count?: number
        }
      }
      evaluations: {
        Row: {
          id: number
          created_at: string
          prompt_id: number
          user_id: string
          algorithm: string
          score: number
          sub_scores: Json
          confidence: number
        }
        Insert: {
          id?: number
          created_at?: string
          prompt_id: number
          user_id: string
          algorithm: string
          score: number
          sub_scores?: Json
          confidence?: number
        }
        Update: {
          id?: number
          created_at?: string
          prompt_id?: number
          user_id?: string
          algorithm?: string
          score?: number
          sub_scores?: Json
          confidence?: number
        }
      }
      packages: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          name: string
          slug: string
          description: string
          category: string
          prompt_ids: number[]
          tier: 'free' | 'basic' | 'pro' | 'premium' | 'enterprise'
          price_single: number
          price_monthly: number
          price_yearly: number
          original_price_single: number
          original_price_monthly: number
          original_price_yearly: number
          discount_percentage: number
          discount_valid_until: string | null
          sales_count: number
          sales_revenue: number
          active: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          description: string
          category: string
          prompt_ids?: number[]
          tier?: 'free' | 'basic' | 'pro' | 'premium' | 'enterprise'
          price_single: number
          price_monthly: number
          price_yearly: number
          original_price_single: number
          original_price_monthly: number
          original_price_yearly: number
          discount_percentage?: number
          discount_valid_until?: string | null
          sales_count?: number
          sales_revenue?: number
          active?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          description?: string
          category?: string
          prompt_ids?: number[]
          tier?: 'free' | 'basic' | 'pro' | 'premium' | 'enterprise'
          price_single?: number
          price_monthly?: number
          price_yearly?: number
          original_price_single?: number
          original_price_monthly?: number
          original_price_yearly?: number
          discount_percentage?: number
          discount_valid_until?: string | null
          sales_count?: number
          sales_revenue?: number
          active?: boolean
        }
      }
      prompts: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          title: string
          description: string
          content: string
          type: 'writing' | 'coding' | 'marketing' | 'design' | 'analysis' | 'other'
          category: string
          tags: string[]
          models: string[]
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          use_cases: string[]
          author_username: string
          author_avatar: string | null
          author_follower_count: number
          author_verified: boolean
          author_professional: boolean
          author_expertise: string[]
          published_at: string
          scraped_at: string
          metrics_likes: number
          metrics_retweets: number
          metrics_replies: number
          metrics_quotes: number
          metrics_bookmarks: number
          metrics_views: number
          evaluation_score: number | null
          evaluation_usefulness: number
          evaluation_innovation: number
          evaluation_completeness: number
          evaluation_popularity: number
          evaluation_author_influence: number
          evaluation_tier: 'free' | 'basic' | 'pro' | 'premium' | null
          evaluation_rank: number
          evaluation_confidence: number
          tier: 'free' | 'basic' | 'pro' | 'premium' | null
          x_algorithm_phoenix_score: number
          x_algorithm_history_relevance: number
          x_algorithm_freshness: number
          x_algorithm_diversity: number
          x_algorithm_combined: number
          x_algorithm_confidence: number
          combined_score: number | null
          combined_tier: 'free' | 'basic' | 'pro' | 'premium' | null
          combined_rank: number
          combined_weight_original: number
          combined_weight_x_algorithm: number
          combined_confidence: number
          sales_count: number
          sales_revenue: number
          sales_last_sale: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          title: string
          description: string
          content: string
          type: 'writing' | 'coding' | 'marketing' | 'design' | 'analysis' | 'other'
          category: string
          tags?: string[]
          models?: string[]
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          use_cases?: string[]
          author_username: string
          author_avatar?: string | null
          author_follower_count?: number
          author_verified?: boolean
          author_professional?: boolean
          author_expertise?: string[]
          published_at: string
          scraped_at?: string
          metrics_likes?: number
          metrics_retweets?: number
          metrics_replies?: number
          metrics_quotes?: number
          metrics_bookmarks?: number
          metrics_views?: number
          evaluation_score?: number | null
          evaluation_usefulness?: number
          evaluation_innovation?: number
          evaluation_completeness?: number
          evaluation_popularity?: number
          evaluation_author_influence?: number
          evaluation_tier?: 'free' | 'basic' | 'pro' | 'premium' | null
          evaluation_rank?: number
          evaluation_confidence?: number
          tier?: 'free' | 'basic' | 'pro' | 'premium' | null
          x_algorithm_phoenix_score?: number
          x_algorithm_history_relevance?: number
          x_algorithm_freshness?: number
          x_algorithm_diversity?: number
          x_algorithm_combined?: number
          x_algorithm_confidence?: number
          combined_score?: number | null
          combined_tier?: 'free' | 'basic' | 'pro' | 'premium' | null
          combined_rank?: number
          combined_weight_original?: number
          combined_weight_x_algorithm?: number
          combined_confidence?: number
          sales_count?: number
          sales_revenue?: number
          sales_last_sale?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          content?: string
          type?: 'writing' | 'coding' | 'marketing' | 'design' | 'analysis' | 'other'
          category?: string
          tags?: string[]
          models?: string[]
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          use_cases?: string[]
          author_username?: string
          author_avatar?: string | null
          author_follower_count?: number
          author_verified?: boolean
          author_professional?: boolean
          author_expertise?: string[]
          published_at?: string
          scraped_at?: string
          metrics_likes?: number
          metrics_retweets?: number
          metrics_replies?: number
          metrics_quotes?: number
          metrics_bookmarks?: number
          metrics_views?: number
          evaluation_score?: number | null
          evaluation_usefulness?: number
          evaluation_innovation?: number
          evaluation_completeness?: number
          evaluation_popularity?: number
          evaluation_author_influence?: number
          evaluation_tier?: 'free' | 'basic' | 'pro' | 'premium' | null
          evaluation_rank?: number
          evaluation_confidence?: number
          tier?: 'free' | 'basic' | 'pro' | 'premium' | null
          x_algorithm_phoenix_score?: number
          x_algorithm_history_relevance?: number
          x_algorithm_freshness?: number
          x_algorithm_diversity?: number
          x_algorithm_combined?: number
          x_algorithm_confidence?: number
          combined_score?: number | null
          combined_tier?: 'free' | 'basic' | 'pro' | 'premium' | null
          combined_rank?: number
          combined_weight_original?: number
          combined_weight_x_algorithm?: number
          combined_confidence?: number
          sales_count?: number
          sales_revenue?: number
          sales_last_sale?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string
          avatar_url: string | null
          provider: 'email' | 'google' | 'github'
          provider_id: string
          subscription_tier: 'free' | 'basic' | 'pro' | 'premium' | 'enterprise'
          subscription_plan: string | null
          subscription_status: 'active' | 'past_due' | 'canceled' | 'incomplete'
          subscription_current_period_start: string | null
          subscription_current_period_end: string | null
          subscription_cancel_at_period_end: boolean
          subscription_canceled_at: string | null
          subscription_stripe_customer_id: string | null
          subscription_stripe_subscription_id: string | null
          favorites: string[]
          purchases: string[]
          usage_prompts_viewed: number
          usage_prompts_purchased: number
          usage_prompts_evaluated: number
          usage_last_active_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          name: string
          avatar_url?: string | null
          provider: 'email' | 'google' | 'github'
          provider_id: string
          subscription_tier?: 'free' | 'basic' | 'pro' | 'premium' | 'enterprise'
          subscription_plan?: string | null
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'incomplete'
          subscription_current_period_start?: string | null
          subscription_current_period_end?: string | null
          subscription_cancel_at_period_end?: boolean
          subscription_canceled_at?: string | null
          subscription_stripe_customer_id?: string | null
          subscription_stripe_subscription_id?: string | null
          favorites?: string[]
          purchases?: string[]
          usage_prompts_viewed?: number
          usage_prompts_purchased?: number
          usage_prompts_evaluated?: number
          usage_last_active_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string
          avatar_url?: string | null
          provider?: 'email' | 'google' | 'github'
          provider_id?: string
          subscription_tier?: 'free' | 'basic' | 'pro' | 'premium' | 'enterprise'
          subscription_plan?: string | null
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'incomplete'
          subscription_current_period_start?: string | null
          subscription_current_period_end?: string | null
          subscription_cancel_at_period_end?: boolean
          subscription_canceled_at?: string | null
          subscription_stripe_customer_id?: string | null
          subscription_stripe_subscription_id?: string | null
          favorites?: string[]
          purchases?: string[]
          usage_prompts_viewed?: number
          usage_prompts_purchased?: number
          usage_prompts_evaluated?: number
          usage_last_active_at?: string
        }
      }
    }
    Views: {
      [_in never_]: {}
    }
    Functions: {
      [_in never_]: {}
    }
    Enums: {
      subscription_tier: ['free', 'basic', 'pro', 'premium', 'enterprise']
      subscription_status: ['active', 'past_due', 'canceled', 'incomplete']
      user_provider: ['email', 'google', 'github']
      prompt_type: ['writing', 'coding', 'marketing', 'design', 'analysis', 'other']
      prompt_difficulty: ['beginner', 'intermediate', 'advanced']
      evaluation_tier: ['free', 'basic', 'pro', 'premium']
      package_tier: ['free', 'basic', 'pro', 'premium', 'enterprise']
    }
  }
}

// ============================================================
// TYPE HELPERS
// ============================================================

export type Tables = Database['public']['Tables']
export type Users = Tables['users']
export type Prompts = Tables['prompts']
export type Categories = Tables['categories']
export type Packages = Tables['packages']
export type Evaluations = Tables['evaluations']

export type UsersInsert = Tables['users']['Insert']
export type PromptsInsert = Tables['prompts']['Insert']
export type CategoriesInsert = Tables['categories']['Insert']
export type PackagesInsert = Tables['packages']['Insert']
export type EvaluationsInsert = Tables['evaluations']['Insert']

export type UsersUpdate = Tables['users']['Update']
export type PromptsUpdate = Tables['prompts']['Update']
export type CategoriesUpdate = Tables['categories']['Update']
export type PackagesUpdate = Tables['packages']['Update']
export type EvaluationsUpdate = Tables['evaluations']['Update']

// ============================================================
// QUERY TYPES
// ============================================================

export type PromptsWithEvaluations = Prompts['Row'] & {
  evaluations: Evaluations['Row'][]
}

export type UsersWithPrompts = Users['Row'] & {
  favorite_prompts: Prompts['Row'][]
  purchased_prompts: Prompts['Row'][]
}

export type CategoryWithPrompts = Categories['Row'] & {
  prompts: Prompts['Row'][]
}

export type PackageWithPrompts = Packages['Row'] & {
  prompts: Prompts['Row'][]
}

// ============================================================
// FILTER TYPES
// ============================================================

export interface PromptFilter {
  type?: PromptType
  category?: string
  difficulty?: Difficulty
  tier?: EvaluationTier
  minScore?: number
  maxScore?: number
  tags?: string[]
  search?: string
  sort?: 'score' | 'rank' | 'likes' | 'recent'
  limit?: number
  offset?: number
}

export type PromptType = 'writing' | 'coding' | 'marketing' | 'design' | 'analysis' | 'other'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type EvaluationTier = 'free' | 'basic' | 'pro' | 'premium'

// ============================================================
// RESPONSE TYPES
// ============================================================

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PromptEvaluationResponse {
  prompt: Prompts['Row']
  original_evaluation: {
    score: number
    sub_scores: {
      usefulness: number
      innovation: number
      completeness: number
      popularity: number
      author_influence: number
    }
    tier: EvaluationTier
    rank: number
    confidence: number
  }
  x_algorithm_evaluation: {
    phoenix_score: number
    history_relevance: number
    freshness: number
    diversity: number
    combined: number
    confidence: number
  }
  combined_evaluation: {
    score: number
    tier: EvaluationTier
    rank: number
    weight: {
      original: number
      x_algorithm: number
    }
    confidence: number
  }
}

// ============================================================
// MUTATION TYPES
// ============================================================

export interface PromptUpsert {
  id?: number
  created_at?: string
  updated_at?: string
  title: string
  description: string
  content: string
  type: PromptType
  category: string
  tags?: string[]
  models?: string[]
  difficulty: Difficulty
  use_cases?: string[]
  author_username: string
  author_avatar?: string | null
  author_follower_count?: number
  author_verified?: boolean
  author_professional?: boolean
  author_expertise?: string[]
  published_at: string
  scraped_at?: string
  metrics_likes?: number
  metrics_retweets?: number
  metrics_replies?: number
  metrics_quotes?: number
  metrics_bookmarks?: number
  metrics_views?: number
  evaluation_score?: number | null
  evaluation_usefulness?: number
  evaluation_innovation?: number
  evaluation_completeness?: number
  evaluation_popularity?: number
  evaluation_author_influence?: number
  evaluation_tier?: EvaluationTier | null
  evaluation_rank?: number
  evaluation_confidence?: number
  tier?: EvaluationTier | null
  x_algorithm_phoenix_score?: number
  x_algorithm_history_relevance?: number
  x_algorithm_freshness?: number
  x_algorithm_diversity?: number
  x_algorithm_combined?: number
  x_algorithm_confidence?: number
  combined_score?: number | null
  combined_tier?: EvaluationTier | null
  combined_rank?: number
  combined_weight_original?: number
  combined_weight_x_algorithm?: number
  combined_confidence?: number
  sales_count?: number
  sales_revenue?: number
  sales_last_sale?: string | null
}

export interface CategoryUpsert {
  id?: number
  created_at?: string
  updated_at?: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  prompt_count?: number
}

export interface PackageUpsert {
  id?: number
  created_at?: string
  updated_at?: string
  name: string
  slug: string
  description: string
  category: string
  prompt_ids?: number[]
  tier?: 'free' | 'basic' | 'pro' | 'premium' | 'enterprise'
  price_single: number
  price_monthly: number
  price_yearly: number
  original_price_single?: number
  original_price_monthly?: number
  original_price_yearly?: number
  discount_percentage?: number
  discount_valid_until?: string | null
  sales_count?: number
  sales_revenue?: number
  active?: boolean
}

export interface EvaluationUpsert {
  id?: number
  created_at?: string
  prompt_id: number
  user_id: string
  algorithm: string
  score: number
  sub_scores?: Json
  confidence?: number
}

export interface UserUpsert {
  id?: string
  created_at?: string
  updated_at?: string
  email: string
  name: string
  avatar_url?: string | null
  provider?: 'email' | 'google' | 'github'
  provider_id: string
  subscription_tier?: 'free' | 'basic' | 'pro' | 'premium' | 'enterprise'
  subscription_plan?: string | null
  subscription_status?: 'active' | 'past_due' | 'canceled' | 'incomplete'
  subscription_current_period_start?: string | null
  subscription_current_period_end?: string | null
  subscription_cancel_at_period_end?: boolean
  subscription_canceled_at?: string | null
  subscription_stripe_customer_id?: string | null
  subscription_stripe_subscription_id?: string | null
  favorites?: string[]
  purchases?: string[]
  usage_prompts_viewed?: number
  usage_prompts_purchased?: number
  usage_prompts_evaluated?: number
  usage_last_active_at?: string
}
