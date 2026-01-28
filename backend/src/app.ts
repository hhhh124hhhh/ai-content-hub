import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// MongoDB 连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-prompt-marketplace';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 创建 Express 应用
const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
import { ScraperService } from './services/scraperService';
import { EvaluationService } from './services/evaluationService';

// 抓取端点
app.post('/api/scrape', async (req: Request, res: Response) => {
  try {
    const { query, count } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await ScraperService.scrapeTwitter(query, count || 20);
    
    // 评估提示词
    const evaluated = await EvaluationService.evaluateBatch(result.prompts);
    const sorted = EvaluationService.sortAndRank(evaluated);

    return res.json({
      success: true,
      scraped: result.prompts.length,
      evaluated: sorted.length,
      prompts: sorted
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 批量抓取端点
app.post('/api/scrape/batch', async (req: Request, res: Response) => {
  try {
    const { queries } = req.body;
    
    if (!queries || !Array.isArray(queries)) {
      return res.status(400).json({ error: 'Queries must be an array' });
    }

    const prompts = await ScraperService.scrapeBatch(queries);
    
    // 评估提示词
    const evaluated = await EvaluationService.evaluateBatch(prompts);
    const sorted = EvaluationService.sortAndRank(evaluated);

    return res.json({
      success: true,
      scraped: prompts.length,
      evaluated: sorted.length,
      prompts: sorted
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 评估端点
app.post('/api/evaluate', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const evaluation = await EvaluationService.evaluate(prompt);
    
    return res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 批量评估端点
app.post('/api/evaluate/batch', async (req: Request, res: Response) => {
  try {
    const { prompts } = req.body;
    
    if (!prompts || !Array.isArray(prompts)) {
      return res.status(400).json({ error: 'Prompts must be an array' });
    }

    const evaluated = await EvaluationService.evaluateBatch(prompts);
    const sorted = EvaluationService.sortAndRank(evaluated);

    return res.json({
      success: true,
      evaluated: sorted.length,
      prompts: sorted
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 更新所有 Rank
app.post('/api/evalution/update-ranks', async (req: Request, res: Response) => {
  try {
    await EvaluationService.updateAllRanks();
    
    return res.json({
      success: true,
      message: 'All ranks updated successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 健康检查
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('╔════════════════════════════════╗');
  console.log('║  🚀 服务器启动                ║');
  console.log('║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║');
  console.log('║  📡  端口: ' + PORT + '             ║');
  console.log('║  🧪  环境: ' + (process.env.NODE_ENV || 'development') + '     ║');
  console.log('╚════════════════════════════════╝');
  console.log('');
  console.log('📋 可用的端点:');
  console.log('  POST /api/scrape - 抓取单次查询');
  console.log('  POST /api/scrape/batch - 批量抓取');
  console.log('  POST /api/evaluate - 评估单个提示词');
  console.log('  POST /api/evaluate/batch - 批量评估');
  console.log('  POST /api/evalution/update-ranks - 更新所有 Rank');
  console.log('  GET  /api/health - 健康检查');
  console.log('');
});
