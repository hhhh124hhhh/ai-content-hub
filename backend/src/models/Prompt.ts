import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPrompt extends Document {
  title: string;
  description: string;
  content: string;
  type: 'writing' | 'coding' | 'marketing' | 'design' | 'analysis' | 'other';
  category: string;
  tags: string[];
  models: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  useCases: string[];
  author: {
    username: string;
    followerCount: number;
    verified: boolean;
    professional: boolean;
    expertise: string[];
  };
  publishedAt: Date;
  scrapedAt: Date;
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
    bookmarks: number;
    views: number;
  };
  evaluation: {
    score: number;
    subScores: {
      usefulness: number;
      innovation: number;
      completeness: number;
      popularity: number;
      authorInfluence: number;
    };
    tier: 'free' | 'basic' | 'pro' | 'premium';
    rank: number;
  };
  tier: 'free' | 'basic' | 'pro' | 'premium';
  sales: {
    count: number;
    revenue: number;
    lastSale: Date;
  };
}

const PromptSchema = new Schema<IPrompt>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ['writing', 'coding', 'marketing', 'design', 'analysis', 'other']
  },
  category: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  models: [{ type: String, trim: true }],
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  useCases: [{ type: String, trim: true }],
  author: {
    username: { type: String, required: true, trim: true },
    followerCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    professional: { type: Boolean, default: false },
    expertise: [{ type: String, trim: true }]
  },
  publishedAt: { type: Date, required: true },
  scrapedAt: { type: Date, default: Date.now },
  metrics: {
    likes: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    quotes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  evaluation: {
    score: { type: Number, required: true, min: 0, max: 100 },
    subScores: {
      usefulness: { type: Number, default: 0, min: 0, max: 30 },
      innovation: { type: Number, default: 0, min: 0, max: 25 },
      completeness: { type: Number, default: 0, min: 0, max: 20 },
      popularity: { type: Number, default: 0, min: 0, max: 25 },
      authorInfluence: { type: Number, default: 0, min: 0, max: 5 }
    },
    tier: {
      type: String,
      enum: ['free', 'basic', 'pro', 'premium'],
      default: 'free'
    },
    rank: { type: Number, default: 999 }
  },
  tier: {
    type: String,
    enum: ['free', 'basic', 'pro', 'premium'],
    default: 'free'
  },
  sales: {
    count: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    lastSale: { type: Date }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: false }
});

// Indexes
PromptSchema.index({ title: 'text', evaluation: 1, type: 1, tier: 1 });
PromptSchema.index({ category: 1, type: 1, difficulty: 1 });
PromptSchema.index({ tags: 1, evaluation: 1 });
PromptSchema.index({ 'evaluation.score': -1 });
PromptSchema.index({ 'evaluation.rank': -1 });

const Prompt = mongoose.model('Prompt', PromptSchema);

export default Prompt;
