// Supabase Client
import { createClient } from '@supabase/supabase-js'

// Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not defined')
}

/**
 * Create Supabase client
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Service Role Client (for backend)
 */
export const supabaseService = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''
)

/**
 * Check Supabase connection
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('id').limit(1)
    if (error) {
      console.error('❌ Supabase connection check failed:', error)
      return false
    }
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Error checking Supabase connection:', error)
    return false
  }
}

/**
 * Get Supabase connection stats
 */
export async function getSupabaseStats(): Promise<any> {
  try {
    // Get counts from each table
    const { count: usersCount } = await supabase.from('users').select('id', { count: 'exact', head: false })
    const { count: promptsCount } = await supabase.from('prompts').select('id', { count: 'exact', head: false })
    const { count: categoriesCount } = await supabase.from('categories').select('id', { count: 'exact', head: false })
    const { count: packagesCount } = await supabase.from('packages').select('id', { count: 'exact', head: false })
    const { count: evaluationsCount } = await supabase.from('evaluations').select('id', { count: 'exact', head: false })

    return {
      database: 'Supabase PostgreSQL',
      tables: {
        users: usersCount,
        prompts: promptsCount,
        categories: categoriesCount,
        packages: packagesCount,
        evaluations: evaluationsCount
      },
      total: usersCount + promptsCount + categoriesCount + packagesCount + evaluationsCount
    }
  } catch (error) {
    console.error('❌ Error getting Supabase stats:', error)
    throw error
  }
}

/**
 * Test all table connections
 */
export async function testAllTableConnections(): Promise<any> {
  const results = {}

  try {
    // Test users table
    const { data: users, error: usersError } = await supabase.from('users').select('id, email, name').limit(1)
    results.users = { success: !usersError, count: users?.length || 0, error: usersError }

    // Test prompts table
    const { data: prompts, error: promptsError } = await supabase.from('prompts').select('id, title, description').limit(1)
    results.prompts = { success: !promptsError, count: prompts?.length || 0, error: promptsError }

    // Test categories table
    const { data: categories, error: categoriesError } = await supabase.from('categories').select('id, name, slug').limit(1)
    results.categories = { success: !categoriesError, count: categories?.length || 0, error: categoriesError }

    // Test packages table
    const { data: packages, error: packagesError } = await supabase.from('packages').select('id, name, slug').limit(1)
    results.packages = { success: !packagesError, count: packages?.length || 0, error: packagesError }

    // Test evaluations table
    const { data: evaluations, error: evaluationsError } = await supabase.from('evaluations').select('id, algorithm, score').limit(1)
    results.evaluations = { success: !evaluationsError, count: evaluations?.length || 0, error: evaluationsError }

    console.log('🧪 All table connections tested')
    return results
  } catch (error) {
    console.error('❌ Error testing all table connections:', error)
    throw error
  }
}

export default supabase
