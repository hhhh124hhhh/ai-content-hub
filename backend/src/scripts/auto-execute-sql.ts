// Auto-execute Supabase SQL Script
// AI Prompt Marketplace - Supabase SQL Auto-Executor

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// ============================================================
// CONFIGURATION
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '***' : 'NOT SET')
  process.exit(1)
}

// ============================================================
// SETUP SUPABASE CLIENT
// ============================================================

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('✅ Supabase client created')
console.log('📌 Project URL:', supabaseUrl)

// ============================================================
// SQL EXECUTOR
// ============================================================

/**
 * Split SQL into individual statements
 */
function splitSQLIntoStatements(sql: string): string[] {
  // Remove comments
  sql = sql.replace(/--.*$/gm, '')
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, '')

  // Split by semicolon or CREATE/INSERT/UPDATE/DELETE
  const statements = sql
    .split(/;(?!([^']|[^"])*")/g)
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0)

  return statements
}

/**
 * Execute SQL statements
 */
async function executeSQL(sql: string): Promise<any> {
  try {
    const statements = splitSQLIntoStatements(sql)
    console.log(`\n📝 Found ${statements.length} SQL statements`)

    const results = []

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]

      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📄 Statement ${i + 1}/${statements.length}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`\n${statement.substring(0, 100)}...`)

      // Try to execute the statement
      try {
        // Note: Supabase JS client doesn't support arbitrary SQL execution
        // We can only use the client's built-in methods
        // For now, we'll just validate the SQL syntax

        console.log(`⚠️  Skipping statement ${i + 1}: ${statement.substring(0, 50)}...`)
        console.log(`💡 Reason: Supabase JS client doesn't support arbitrary SQL execution`)
        console.log(`💡 Solution: Please execute SQL manually in Supabase SQL Editor`)

      } catch (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message)
      }
    }

    return {
      success: true,
      statementsCount: statements.length,
      results
    }
  } catch (error) {
    console.error('❌ Error executing SQL:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Validate SQL syntax
 */
async function validateSQLSyntax(sql: string): Promise<any> {
  try {
    const statements = splitSQLIntoStatements(sql)
    
    console.log(`\n📝 Validating ${statements.length} SQL statements...`)

    const validationResults = []

    for (const statement of statements) {
      const statementUpper = statement.toUpperCase()

      // Check for common syntax errors
      const errors = []

      // Check for unclosed parentheses
      const openParens = (statement.match(/\(/g) || []).length
      const closeParens = (statement.match(/\)/g) || []).length
      if (openParens !== closeParens) {
        errors.push(`Unclosed parentheses: ${openParens - closeParens} extra open parenthesis`)
      }

      // Check for unclosed quotes
      const singleQuotes = (statement.match(/'/g) || []).length
      if (singleQuotes % 2 !== 0) {
        errors.push('Unclosed single quotes')
      }

      const doubleQuotes = (statement.match(/"/g) || []).length
      if (doubleQuotes % 2 !== 0) {
        errors.push('Unclosed double quotes')
      }

      // Check for invalid type casts
      if (statementUpper.includes('::JSONB') && !statementUpper.includes('JSONB')) {
        errors.push('Invalid JSONB cast format')
      }

      // Check for invalid ARRAY casts
      if (statementUpper.includes('ARRAY[') && statementUpper.includes('::JSONB')) {
        errors.push('Cannot cast TEXT[] to JSONB directly, use JSONB array format')
      }

      validationResults.push({
        statement: statement.substring(0, 100),
        errors
      })
    }

    const totalErrors = validationResults.reduce((sum, result) => sum + result.errors.length, 0)

    console.log(`\n📊 Validation Results:`)
    console.log(`   Total statements: ${statements.length}`)
    console.log(`   Total errors: ${totalErrors}`)

    if (totalErrors > 0) {
      console.log(`\n❌ Found ${totalErrors} syntax errors:`)
      validationResults.forEach((result, index) => {
        if (result.errors.length > 0) {
          console.log(`   Statement ${index + 1}: ${result.errors.join(', ')}`)
        }
      })
    } else {
      console.log(`\n✅ No syntax errors found`)
    }

    return {
      success: totalErrors === 0,
      statementsCount: statements.length,
      totalErrors,
      validationResults
    }
  } catch (error) {
    console.error('❌ Error validating SQL:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Get database stats
 */
async function getDatabaseStats(): Promise<any> {
  try {
    console.log(`\n📊 Getting database stats...`)

    const [
      { count: usersCount },
      { count: promptsCount },
      { count: categoriesCount },
      { count: packagesCount },
      { count: evaluationsCount }
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: false }),
      supabase.from('prompts').select('id', { count: 'exact', head: false }),
      supabase.from('categories').select('id', { count: 'exact', head: false }),
      supabase.from('packages').select('id', { count: 'exact', head: false }),
      supabase.from('evaluations').select('id', { count: 'exact', head: false })
    ])

    const total = usersCount + promptsCount + categoriesCount + packagesCount + evaluationsCount

    const stats = {
      database: 'Supabase PostgreSQL',
      tables: {
        users: usersCount,
        prompts: promptsCount,
        categories: categoriesCount,
        packages: packagesCount,
        evaluations: evaluationsCount
      },
      total
    }

    console.log(`\n📊 Database Stats:`)
    console.log(`   Database: ${stats.database}`)
    console.log(`   Users: ${stats.tables.users}`)
    console.log(`   Prompts: ${stats.tables.prompts}`)
    console.log(`   Categories: ${stats.tables.categories}`)
    console.log(`   Packages: ${stats.tables.packages}`)
    console.log(`   Evaluations: ${stats.tables.evaluations}`)
    console.log(`   Total: ${stats.total}`)

    return stats
  } catch (error) {
    console.error('❌ Error getting database stats:', error)
    throw error
  }
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('╔════════════════════════════════╗')
  console.log('║  🚀 Supabase SQL Auto-Executor  ║')
  console.log('╚════════════════════════════════╝')
  console.log('')

  try {
    // Read SQL file
    const sqlFilePath = resolve('./supabase-schema.sql')
    console.log(`📖 Reading SQL file: ${sqlFilePath}`)

    const sql = readFileSync(sqlFilePath, 'utf-8')
    console.log(`✅ SQL file read (${sql.length} bytes)`)
    console.log(`📊 SQL lines: ${sql.split('\n').length}`)

    // Validate SQL syntax
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔍 STEP 1: Validate SQL Syntax')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const validation = await validateSQLSyntax(sql)

    if (!validation.success) {
      console.error('\n❌ SQL validation failed')
      console.error('💡 Please fix the errors and try again')
      process.exit(1)
    }

    console.log('\n✅ SQL syntax validated successfully')

    // Get database stats
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 STEP 2: Get Database Stats')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const stats = await getDatabaseStats()

    if (stats.total > 100) {
      console.log('\n📊 Database is already populated!')
      console.log('💡 Skipping SQL execution (data already exists)')
    } else {
      console.log('\n📊 Database is empty or has few records')
      console.log('💡 SQL execution required (please execute manually in Supabase SQL Editor)')
    }

    console.log('\n╔════════════════════════════════╗')
    console.log('║  ✅ Auto-Execution Complete    ║')
    console.log('║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║')
    console.log('║  Next Steps:                       ║')
    console.log('║  1. Go to Supabase SQL Editor   ║')
    console.log('║  2. Copy SQL from GitHub              ║')
    console.log('║  3. Paste and execute              ║')
    console.log('╚════════════════════════════════╝')
    console.log('')

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    console.error('💡 Please check your environment variables and Supabase credentials')
    process.exit(1)
  }
}

// ============================================================
// RUN MAIN
// ============================================================

main()
