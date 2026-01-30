// Supabase Data Seeding Script (Direct Client Insert)
// AI Prompt Marketplace - Direct Data Insert (No SQL Execution)

import { createClient } from '@supabase/supabase-js'

// ============================================================
// CONFIGURATION
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://afslorzxwoqdwelbord.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmc2xvcnp4d29xb3JkcmIiwicm9sZSI6ImFmc2xvcnp4ZyIsImlhdCI6MTc2OTU3MDMyLCJleHAiOjIwODUxMzkwMzI3WiwiZXhwIjoiMzA0ODZhLmhfYzY2ODRlNmYzMTA3MzAiLCJhdWQiOiJhdXRoIn0'

console.log('✅ Supabase client configured')
console.log('📌 Project URL:', supabaseUrl)
console.log('🔑 Anon Key:', supabaseAnonKey ? '***' : 'NOT SET')

if (!supabaseAnonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// SEED DATA
// ============================================================

const seedData = {
  // Users
  users: [
    {
      email: 'admin@ai-prompt-marketplace.com',
      name: 'Admin',
      avatar_url: null,
      provider: 'email',
      provider_id: 'admin-user-123',
      subscription_tier: 'premium',
      subscription_plan: null,
      subscription_status: 'active',
      subscription_current_period_start: null,
      subscription_current_period_end: null,
      subscription_cancel_at_period_end: false,
      subscription_canceled_at: null,
      subscription_stripe_customer_id: null,
      subscription_stripe_subscription_id: null,
      favorites: [],
      purchases: [],
      usage_prompts_viewed: 0,
      usage_prompts_purchased: 0,
      usage_prompts_evaluated: 0,
      usage_last_active_at: new Date().toISOString()
    }
  ],

  // Categories
  categories: [
    {
      name: 'Writing Assistant',
      slug: 'writing-assistant',
      description: 'High-quality writing prompts for ChatGPT and other AI models',
      icon: '✍️',
      color: '#3b82f6',
      prompt_count: 254
    },
    {
      name: 'Coding Assistant',
      slug: 'coding-assistant',
      description: 'Expert coding prompts and algorithm explanations',
      icon: '💻',
      color: '#8b5cf6',
      prompt_count: 186
    },
    {
      name: 'Marketing Assistant',
      slug: 'marketing-assistant',
      description: 'Marketing and copywriting prompts for businesses',
      icon: '📢',
      color: '#ef4444',
      prompt_count: 142
    },
    {
      name: 'Design Assistant',
      slug: 'design-assistant',
      description: 'UI/UX and graphic design prompts',
      icon: '🎨',
      color: '#f97316',
      prompt_count: 128
    },
    {
      name: 'Analysis Assistant',
      slug: 'analysis-assistant',
      description: 'Data analysis and visualization prompts',
      icon: '📊',
      color: '#10b981',
      prompt_count: 98
    },
    {
      name: 'Other',
      slug: 'other',
      description: 'Miscellaneous AI prompts for various use cases',
      icon: '📚',
      color: '#64748b',
      prompt_count: 67
    }
  ],

  // Packages
  packages: [
    {
      name: 'Starter Pack',
      slug: 'starter-pack',
      description: 'Perfect for beginners getting started with AI prompts',
      category: 'Other',
      tier: 'basic',
      prompt_ids: [],
      price_single: 4.99,
      price_monthly: 4.99,
      price_yearly: 49.99,
      original_price_single: 9.99,
      original_price_monthly: 9.99,
      original_price_yearly: 99.99,
      discount_percentage: 0,
      discount_valid_until: null,
      sales_count: 0,
      sales_revenue: 0,
      active: true
    },
    {
      name: 'Pro Pack',
      slug: 'pro-pack',
      description: 'All the pro prompts you need for professional work',
      category: 'Other',
      tier: 'pro',
      prompt_ids: [],
      price_single: 14.99,
      price_monthly: 19.99,
      price_yearly: 199.99,
      original_price_single: 29.99,
      original_price_monthly: 39.99,
      original_price_yearly: 399.99,
      discount_percentage: 0,
      discount_valid_until: null,
      sales_count: 0,
      sales_revenue: 0,
      active: true
    },
    {
      name: 'Premium Pack',
      slug: 'premium-pack',
      description: 'Premium prompts with guaranteed quality',
      category: 'Other',
      tier: 'premium',
      prompt_ids: [],
      price_single: 49.99,
      price_monthly: 69.99,
      price_yearly: 699.99,
      original_price_single: 99.99,
      original_price_monthly: 139.99,
      original_price_yearly: 1399.99,
      discount_percentage: 0,
      discount_valid_until: null,
      sales_count: 0,
      sales_revenue: 0,
      active: true
    }
  ],

  // Prompts (simplified, avoiding complex JSONB fields that cause syntax errors)
  prompts: [
    {
      title: 'ChatGPT Writing Prompt - High Quality',
      description: 'This is an excellent ChatGPT writing prompt with complete steps and examples.',
      content: 'You are a professional writing assistant. Please help me complete the following tasks:',
      type: 'writing',
      category: 'Writing Assistant',
      tags: ['writing', 'ChatGPT', 'AI writing', 'article', 'outline', 'content'],
      models: ['ChatGPT', 'Claude'],
      difficulty: 'intermediate',
      use_cases: ['Write blog articles', 'Write outlines', 'Write article body', 'Edit and optimize content', 'Add images'],
      author_username: 'promptMaster',
      author_avatar: null,
      author_follower_count: 50000,
      author_verified: true,
      author_professional: true,
      author_expertise: ['AI', 'Writing', 'Technology'],
      published_at: new Date('2026-01-28').toISOString(),
      scraped_at: new Date().toISOString(),
      metrics_likes: 500,
      metrics_retweets: 100,
      metrics_replies: 50,
      metrics_quotes: 10,
      metrics_bookmarks: 20,
      metrics_views: 1000,
      evaluation_score: 92,
      evaluation_usefulness: 28,
      evaluation_innovation: 23,
      evaluation_completeness: 18,
      evaluation_popularity: 23,
      evaluation_author_influence: 5,
      evaluation_tier: 'basic',
      evaluation_rank: 10,
      evaluation_confidence: 95,
      tier: 'basic',
      x_algorithm_phoenix_score: 92,
      x_algorithm_history_relevance: 95,
      x_algorithm_freshness: 94,
      x_algorithm_diversity: 92,
      x_algorithm_combined: 92,
      x_algorithm_confidence: 95,
      combined_score: 92,
      combined_tier: 'basic',
      combined_rank: 92,
      combined_weight_original: 60,
      combined_weight_x_algorithm: 40,
      combined_confidence: 95,
      sales_count: 0,
      sales_revenue: 0,
      sales_last_sale: null
    }
  ]
}

// ============================================================
// SEEDING FUNCTIONS
// ============================================================

async function seedUsers() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👤 Seeding Users')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  for (const user of seedData.users) {
    console.log(`\n📄 Inserting user: ${user.name}`)
    console.log(`   Email: ${user.email}`)

    try {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()

      if (error) {
        console.error('❌ Error inserting user:', error.message)
        throw error
      }

      if (data) {
        console.log(`✅ User inserted successfully: ${data[0].name}`)
      }
    } catch (error) {
      console.error('❌ Error inserting user:', error)
      throw error
    }
  }

  console.log('\n✅ Users seeding complete')
}

async function seedCategories() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📂 Seeding Categories')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  for (const category of seedData.categories) {
    console.log(`\n📂 Inserting category: ${category.name}`)
    console.log(`   Slug: ${category.slug}`)

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()

      if (error) {
        console.error('❌ Error inserting category:', error.message)
        throw error
      }

      if (data) {
        console.log(`✅ Category inserted successfully: ${data[0].name}`)
      }
    } catch (error) {
      console.error('❌ Error inserting category:', error)
      throw error
    }
  }

  console.log('\n✅ Categories seeding complete')
}

async function seedPackages() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📦 Seeding Packages')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  for (const pkg of seedData.packages) {
    console.log(`\n📦 Inserting package: ${pkg.name}`)
    console.log(`   Slug: ${pkg.slug}`)
    console.log(`   Tier: ${pkg.tier}`)
    console.log(`   Price: $${pkg.price_single}`)

    try {
      const { data, error } = await supabase
        .from('packages')
        .insert(pkg)
        .select()

      if (error) {
        console.error('❌ Error inserting package:', error.message)
        throw error
      }

      if (data) {
        console.log(`✅ Package inserted successfully: ${data[0].name}`)
      }
    } catch (error) {
      console.error('❌ Error inserting package:', error)
      throw error
    }
  }

  console.log('\n✅ Packages seeding complete')
}

async function seedPrompts() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📝 Seeding Prompts')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  for (const prompt of seedData.prompts) {
    console.log(`\n📝 Inserting prompt: ${prompt.title}`)
    console.log(`   Type: ${prompt.type}`)
    console.log(`   Category: ${prompt.category}`)
    console.log(`   Difficulty: ${prompt.difficulty}`)
    console.log(`   Score: ${prompt.evaluation_score}`)
    console.log(`   Tier: ${prompt.tier}`)

    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert(prompt)
        .select()

      if (error) {
        console.error('❌ Error inserting prompt:', error.message)
        throw error
      }

      if (data) {
        console.log(`✅ Prompt inserted successfully: ${data[0].title}`)
      }
    } catch (error) {
      console.error('❌ Error inserting prompt:', error)
      throw error
    }
  }

  console.log('\n✅ Prompts seeding complete')
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('╔══════════════════════════════════════╗')
  console.log('║  🚀 Supabase Data Seeding (Direct)  ║')
  console.log('╚══════════════════════════════════════╝')
  console.log('')

  try {
    // Step 1: Seed Users
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 STEP 1: Seed Users')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    await seedUsers()

    // Step 2: Seed Categories
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 STEP 2: Seed Categories')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    await seedCategories()

    // Step 3: Seed Packages
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 STEP 3: Seed Packages')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    await seedPackages()

    // Step 4: Seed Prompts
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 STEP 4: Seed Prompts')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    await seedPrompts()

    // Step 5: Verify Seeding
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 STEP 5: Verify Seeding')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const [
      { count: usersCount },
      { count: categoriesCount },
      { count: packagesCount },
      { count: promptsCount }
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: false }),
      supabase.from('categories').select('id', { count: 'exact', head: false }),
      supabase.from('packages').select('id', { count: 'exact', head: false }),
      supabase.from('prompts').select('id', { count: 'exact', head: false })
    ])

    const total = usersCount + categoriesCount + packagesCount + promptsCount

    console.log('\n📊 Seeding Results:')
    console.log(`   Users: ${usersCount}`)
    console.log(`   Categories: ${categoriesCount}`)
    console.log(`   Packages: ${packagesCount}`)
    console.log(`   Prompts: ${promptsCount}`)
    console.log(`   Total: ${total}`)

    console.log('\n╔══════════════════════════════════════╗')
    console.log('║  ✅ Seeding Complete             ║')
    console.log('║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║')
    console.log('║  All data has been inserted!   ║')
    console.log('╚══════════════════════════════════════╝')
    console.log('')

  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error)
    console.error('💡 Please check your Supabase credentials and permissions')
    process.exit(1)
  }
}

// ============================================================
// RUN MAIN
// ============================================================

main()
