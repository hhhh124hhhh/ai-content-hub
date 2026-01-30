import { supabase } from '@/lib/supabase'
import { PromptCard } from '@/components/PromptCard'
import { SearchBar } from '@/components/SearchBar'
import { CategoryList } from '@/components/CategoryList'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Star, TrendingUp, BookOpen, Zap } from 'lucide-react'

export default async function HomePage() {
  // 获取热门提示词
  const { data: hotPrompts } = await supabase
    .from('prompts')
    .select('*')
    .gte('evaluation_score', 80)
    .order('evaluation_score', { ascending: false })
    .limit(10)

  // 获取分类
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('prompt_count', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-white">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              AI Prompt Marketplace
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Discover high-quality AI prompts evaluated and ranked by our advanced AI algorithms
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-center mb-3">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-500">Prompts</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-10 h-10 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-500">Categories</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-center mb-3">
                  <Zap className="w-10 h-10 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-500">Updates</div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <SearchBar />
            </div>
            
            {/* Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Browse by Category
              </h2>
              <CategoryList categories={categories || []} />
            </div>
            
            {/* Hot Prompts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🔥 Hot Prompts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotPrompts?.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
