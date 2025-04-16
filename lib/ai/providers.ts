import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

// 创建自定义OpenAI提供者
const customOpenAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_COMPLETION_URL,
  compatibility: 'compatible', // 使用兼容模式
});

// 使用环境变量中的模型
const defaultModelId = process.env.OPENAI_MODEL || 'google/gemini-flash-1.5';

// 为了兼容性，创建模拟图像模型
const mockImageModel = {
  doGenerate: async ({ prompt }: { prompt: string }) => {
    console.warn('使用模拟图像模型，不会生成真实图像。请配置真实的图像生成服务。');
    // 返回一个1x1像素的透明图像
    return {
      image: {
        base64: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      },
    };
  },
};

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': customOpenAI(defaultModelId),
        'chat-model-reasoning': wrapLanguageModel({
          model: customOpenAI(defaultModelId),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': customOpenAI(defaultModelId),
        'artifact-model': customOpenAI(defaultModelId),
      },
      imageModels: {
        // 使用模拟图像模型，因为Gemini API可能不支持标准的图像生成接口
        'small-model': mockImageModel,
      },
    });
